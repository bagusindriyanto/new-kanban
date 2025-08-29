const Modal = ({ onCancel, onSubmit }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-lg text-neutral-700 font-bold">Add Task</h2>
        <form onSubmit={onSubmit} className="space-y-4">
          <input type="text" />
        </form>
      </div>
    </div>
  );
};

export default Modal;
