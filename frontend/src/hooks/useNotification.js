import { notification } from "antd";

const useNotification = () => {
  const [api, contextHolder] = notification.useNotification();

  const showNotification = ({ type, title, message }) => {
    api[type]({
      message: title,
      description: message,
    });
  };

  const showSuccess = ({ title, message }) => {
    showNotification({ type: "success", title, message });
  };

  const showFailure = ({ title, message }) => {
    showNotification({ type: "error", title, message });
  };

  return [contextHolder, showFailure, showSuccess];
};

export default useNotification;

