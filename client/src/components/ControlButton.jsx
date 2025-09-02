const ControlButton = ({ children }) => {
  return (
    <button className="rounded-full size-6 bg-black/15 text-white p-1">
      {children}
    </button>
  );
};

export default ControlButton;
