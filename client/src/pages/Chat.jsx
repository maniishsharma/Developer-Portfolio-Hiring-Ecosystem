import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import api from '../services/api';
import { useSelector } from 'react-redux';

export default function Chat() {
  const user = useSelector((s) => s.auth.user);
  const [dir, setDir] = useState([]);
  const [selected, setSelected] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const socketRef = useRef(null);

  useEffect(() => {
    api.get('/messages/directory').then((r) => setDir(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    if (!user) return;
    const token = user.token;
    const socket = io({ auth: { token } });
    socketRef.current = socket;
    socket.on('connect_error', (err) => console.error('Socket error', err));
    socket.on('receive_message', (m) => {
      if (selected && (m.sender._id === selected._id || m.receiver === selected._id)) {
        setMessages((s) => [...s, m]);
      }
    });
    return () => { socket.disconnect(); };
  }, [user, selected]);

  const openConversation = async (u) => {
    setSelected(u);
    const res = await api.get(`/messages/${u._id}`);
    setMessages(res.data);
  };

  const send = () => {
    if (!text.trim() || !selected) return;
    socketRef.current.emit('send_message', { receiverId: selected._id, text });
    setMessages((s) => [...s, { sender: { _id: user._id, name: user.name }, receiver: selected._id, text, createdAt: new Date().toISOString() }]);
    setText('');
  };

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <aside className="space-y-2 md:col-span-1">
        <h2 className="text-xl font-black">Contacts</h2>
        <div className="mt-2 space-y-2">
          {dir.map((u) => (
            <button key={u._id} onClick={() => openConversation(u)} className="w-full text-left rounded-lg p-3 glass-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold">{u.name}</p>
                  <p className="text-xs text-ink/60">{u.role}</p>
                </div>
                <div className={`h-2 w-2 rounded-full ${u.isOnline ? 'bg-green-400' : 'bg-gray-400'}`} />
              </div>
            </button>
          ))}
        </div>
      </aside>
      <div className="md:col-span-2">
        {selected ? (
          <div>
            <h3 className="text-2xl font-black">Chat with {selected.name}</h3>
            <div className="mt-4 max-h-[60vh] space-y-2 overflow-auto">
              {messages.map((m, i) => (
                <div key={i} className={`p-3 rounded-lg ${m.sender?._id === user._id ? 'bg-blush/40 ml-auto max-w-[70%]' : 'bg-sand max-w-[70%]'}`}>
                  <p className="text-sm font-bold">{m.sender?.name}</p>
                  <p className="mt-1 text-sm">{m.text}</p>
                  <p className="mt-1 text-xs text-ink/50">{new Date(m.createdAt).toLocaleString()}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              <input value={text} onChange={(e) => setText(e.target.value)} className="flex-1 rounded-2xl bg-sand px-4 py-3 outline-none" placeholder="Type a message" />
              <button onClick={send} className="btn-primary px-4">Send</button>
            </div>
          </div>
        ) : (
          <p className="text-ink/60">Select a contact to start chatting.</p>
        )}
      </div>
    </div>
  );
}
