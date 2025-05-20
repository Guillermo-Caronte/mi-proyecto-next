export default function Input({ className = '', ...props }) {
    return (
      <input
        className={`px-3 py-2 border border-gray-300 rounded ${className}`}
        {...props}
      />
    );
  }