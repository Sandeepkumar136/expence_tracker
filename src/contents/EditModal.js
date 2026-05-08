import React from "react";

import { motion, AnimatePresence } from "motion/react";

import { useEditModal } from "../context/EditModalContext";

const EditModal = () => {
  const {
    actionTx,
    setActionTx,

    handleDeleteRef,

    globalEditTxRef,
  } = useEditModal();

  if (!actionTx) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="action-overlay"
        onClick={() => setActionTx(null)}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="action-sheet"
          onClick={(e) => e.stopPropagation()}
          initial={{ y: 250 }}
          animate={{ y: 0 }}
          exit={{ y: 250 }}
          transition={{
            type: "spring",
            damping: 22,
            stiffness: 240,
          }}
        >
          <button
            className="action-btn edit-btn"
            onClick={() => {
              globalEditTxRef.current(actionTx);

              setActionTx(null);
            }}
          >
            <i className="bx bx-edit-alt"></i>
            Edit
          </button>
          <button
            className="action-btn delete-btn"
            onClick={() => {
              handleDeleteRef.current(actionTx);
              setActionTx(null); 
            }}
          >
            <i className="bx bx-trash"></i>
            Delete
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default EditModal;
