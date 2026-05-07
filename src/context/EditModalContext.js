import { createContext, useContext, useState } from "react";

const EditModalContext = createContext();

export const EditModalProvider = ({ children }) => {

  const [actionTx, setActionTx] = useState(null);

  const [handleDelete, setHandleDelete] =
    useState(() => () => {});

  const [setEditTx, setGlobalEditTx] =
    useState(() => () => {});

  return (
    <EditModalContext.Provider
      value={{
        actionTx,
        setActionTx,

        handleDelete,
        setHandleDelete,

        setEditTx,
        setGlobalEditTx,
      }}
    >
      {children}
    </EditModalContext.Provider>
  );
};

export const useEditModal = () =>
  useContext(EditModalContext);