import React from "react";

const EditModal = ({
  actionTx,
  setActionTx,
  setEditTx,
  handleDelete,
}) => {

  if (!actionTx) return null;

  return (
    <div
      className="action-overlay"
      onClick={() => setActionTx(null)}
    >
      <div
        className="action-sheet"
        onClick={(e) => e.stopPropagation()}
      >

        <button
          className="action-btn edit-btn"
          onClick={() => {
            setEditTx(actionTx);
            setActionTx(null);
          }}
        >
          <i className="bx bx-edit-alt"></i>
          Edit
        </button>

        <button
          className="action-btn delete-btn"
          onClick={() => handleDelete(actionTx)}
        >
          <i className="bx bx-trash"></i>
          Delete
        </button>

      </div>
    </div>
  );
};

export default EditModal;