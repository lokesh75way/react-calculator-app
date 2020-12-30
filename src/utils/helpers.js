import { useState, useRef, useEffect } from 'react';

export const useStateCallback = (initialState) => {
  const [isSubmit, setIsSubmit] = useState(initialState);
  const cbRef = useRef(null);

  const setIsSubmitCallback = (isSubmit, cb) => {
    cbRef.current = cb;
    setIsSubmit(isSubmit);
  };

  useEffect(() => {
    if (cbRef.current) {
      cbRef.current(isSubmit);
      cbRef.current = null;
    }
  }, [isSubmit]);

  return [isSubmit, setIsSubmitCallback];
};
