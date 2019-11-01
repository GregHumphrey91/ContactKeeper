import { toast } from "react-toastify";

export const success = string => {
  return toast.success(string, {
    autoClose: 2000,
    position: "top-right",
    className: "success"
  });
};

export const failure = string => {
  return toast.error(string, {
    className: "failure"
  });
};

export default toast;
