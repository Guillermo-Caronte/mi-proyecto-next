export default function MainButton({children}) {
    return (
        <button className="bg-blue-500 text-white font-bold py-2 px-4 rounded
         hover:bg-blue-700 transition duration-300 ease-in-out">
            {children}
        </button>
    );
}