import { useDispatch } from 'react-redux';
import { pushToast } from '../redux/uiSlice';

export const useToast = () => {
  const dispatch = useDispatch();
  return (message, type = 'success') => dispatch(pushToast({ message, type }));
};
