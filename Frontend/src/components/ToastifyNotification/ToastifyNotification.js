import React from "react";
import { ToastContainer } from "react-toastify";

const ToastifyNotification = () => {
  return (
    <ToastContainer
      position="top-center"
      autoClose={1000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      draggable
      theme="light"
    />
  );
};

export default ToastifyNotification;
