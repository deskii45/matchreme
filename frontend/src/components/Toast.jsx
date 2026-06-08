// src/components/Toast.jsx
import { useEffect } from 'react';

export default function Toast({ message, type, onHide }) {
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(onHide, 3500);
    return () => clearTimeout(t);
  }, [message]);

  if (!message) return null;
  return (
    <div className={`toast show toast-${type || ''}`}>
      <span>{type === 'err' ? '❌' : type === 'fav' ? '❤️' : '✅'}</span>
      {message}
    </div>
  );
}
