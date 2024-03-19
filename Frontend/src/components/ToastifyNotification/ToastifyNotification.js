import React from "react";
// import { Toaster, toast } from 'sonner'
import { Toaster } from 'sonner'

const ToastifyNotification = () => {
  return (
    <Toaster
      position="top-right"
      duration={2500}
      richColors
      closeButton
      toastOptions={{
        style: {
          height: '70px',
          fontSize:"1.05rem"
        }
      }}
    />
  );
};

export default ToastifyNotification;
