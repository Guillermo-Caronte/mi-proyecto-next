
export default function Button({ children, className = '', ...props }) {
    return (
      <button
        className={`pl-2 px-3 py-1 bg-[#e41b23] text-white rounded hover:bg-red-900 ${className} cursor-pointer`}
        {...props}
      >
        {children}
      </button>
    );
  }