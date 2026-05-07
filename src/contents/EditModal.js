import React from "react";
import { useEditModal } from "../context/EditModalContext";

const EditModal = () => {

  const {
    actionTx,
    setActionTx,
    handleDelete,
    setEditTx,
  } = useEditModal();

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

        {/* EDIT */}
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

        {/* DELETE */}
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