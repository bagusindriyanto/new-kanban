const ControlButton = ({ status, children }) => {
  return (
    <button
      className={`cursor-pointer rounded-full size-6 text-white p-1
        ${status === 'todo' ? 'bg-rose-600' : ''} 
        ${status === 'on progress' ? 'bg-orange-600' : ''} 
        ${status === 'done' ? 'bg-green-600' : ''}
        ${status === 'archived' ? 'bg-gray-600' : ''}`}
    >
      {children}
    </button>
  );
};

export default ControlButton;
