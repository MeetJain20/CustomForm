import { useEffect } from "react";
 
const useInsideClick = (ref, callback) => {
  const handleClickInside = (event) => {
    if (ref.current && ref.current.contains(event.target)) {
      callback();
    }
  };
 
  useEffect(() => {
    document.addEventListener("click", handleClickInside);
 
    return () => {
      document.removeEventListener("click", handleClickInside);
    };
  }, [ref, callback]);
};
 
export default useInsideClick;