import React, { createContext, useContext } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

export const AlertContext = createContext();

export const useAlert = () => {
    const context = useContext(AlertContext);
    if (!context) {
        throw new Error("useAlert must be used within an AlertProvider");
    }
    return context;
};

export const AlertProvider = ({ children }) => {
    const showAlert = (title, text, icon = 'error') => {
        return MySwal.fire({
            title: title,
            text: text,
            icon: icon,
            confirmButtonText: 'Ok'
        });
    };

    const showSuccess = (title, text) => {
        return showAlert(title, text, 'success');
    };

    const showError = (title, text) => {
        return showAlert(title, text, 'error');
    };

    const showWarning = (title, text) => {
        return showAlert(title, text, 'warning');
    };

    const showInfo = (title, text) => {
        return showAlert(title, text, 'info');
    };

    return (
        <AlertContext.Provider value={{ showAlert, showSuccess, showError, showWarning, showInfo }}>
            {children}
        </AlertContext.Provider>
    );
};