import {
  createContext,
  useContext,
  useRef,
  useState,
} from "react";

const EditModalContext = createContext();

export const EditModalProvider = ({
  children,
}) => {

  // ACTIVE TRANSACTION
  const [actionTx, setActionTx] =
    useState(null);

  // FUNCTION REFS
  const handleDeleteRef = useRef(null);

  const globalEditTxRef = useRef(null);

  return (
    <EditModalContext.Provider
      value={{

        actionTx,
        setActionTx,

        handleDeleteRef,

        globalEditTxRef,

      }}
    >
      {children}
    </EditModalContext.Provider>
  );
};

export const useEditModal = () =>
  useContext(EditModalContext);