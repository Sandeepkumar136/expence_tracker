import { createContext, useContext, useState } from "react";

const EditModalContext = createContext();

export const EditModalProvider = ({children})=>{
    const [isEditOpen, setIsEditOpen] = useState(false);
    const openEdit = () => setIsEditOpen(true);
    const closeEdit = () => setIsEditOpen(false);

    return(
        <EditModalContext.Provider value={{openEdit, closeEdit, isEditOpen}}>
            {children}
        </EditModalContext.Provider>
    )


}
export const useEdit = () => useContext(EditModalContext);