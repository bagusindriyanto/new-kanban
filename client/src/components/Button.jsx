const Button = ({ children }) => {
  return (
    <button className="rounded-lg bg-blue-500 transition duration-300 ease-in-out hover:bg-blue-600 px-3 py-2 text-white font-semibold cursor-pointer">
      {children}
    </button>
  );
};

export default Button;
