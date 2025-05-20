export default function Button({ children, className = '', ...props }) {
    return (
      <button
        className={`px-1 py-1 ${className} flex gap-2 cursor-pointer align-middle items-center`}
        {...props}
      >
        {children}
      </button>
  );
}