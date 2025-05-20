
import {useRef, useEffect } from 'react';

export function DropdownMenu({ children }) {
  return <div className="relative inline-block">{children}</div>;
}

export function DropdownMenuTrigger({ children, onClick }) {
  return (
    <span onClick={onClick} className="p-2 ">
      {children}
    </span>
  );
}

export function DropdownMenuContent({ open, onClose, children, className = "" }) {
  const ref = useRef();

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        onClose();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [ref, onClose]);

  if (!open) return null;

  return (
    <div
      ref={ref}
      className={`absolute w-max rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50 ${className}`}
      style={{
        top: '49px', // Mueve el menú hacia arriba
      }}
    >
      <div className="py-1">{children}</div>
    </div>
  );
}
export function DropdownMenuItem({ children, onClick }) {
  return (
    <span
      onClick={onClick}
      className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 flex gap-2 cursor-pointer"
    >
      {children}
    </span>
  );
}
