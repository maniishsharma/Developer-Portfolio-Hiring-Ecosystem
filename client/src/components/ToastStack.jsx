import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { removeToast } from '../redux/uiSlice';

export default function ToastStack() {
  const toasts = useSelector((s) => s.ui.toasts);
  const dispatch = useDispatch();

  useEffect(() => {
    toasts.forEach((t) => {
      const id = setTimeout(() => dispatch(removeToast(t.id)), 3200);
      return () => clearTimeout(id);
    });
  }, [toasts, dispatch]);

  return (
    <div className="fixed bottom-6 right-6 z-[80] space-y-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`rounded-2xl px-4 py-3 text-sm font-semibold shadow-lg ${
            t.type === 'error' ? 'bg-ink text-cream' : 'bg-blush text-ink'
          }`}
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}
