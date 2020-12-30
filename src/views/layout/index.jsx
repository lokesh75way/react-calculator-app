import React, { useEffect } from 'react';
import Routes from '../../routes';
import { toast } from 'react-toastify';

const Layout = () => {
  useEffect(() => {
    const handleToasifySnack = (e) => {
      const { message, variant } = e.detail;
      toast[variant](message, { position: toast.POSITION.TOP_CENTER });
    };

    document.addEventListener('setToastify', handleToasifySnack);
    return () => {
      document.removeEventListener('setToastify', handleToasifySnack);
    };
  }, []);

  return (
    <>
      <Routes />
    </>
  );
};

Layout.propTypes = {};

export default Layout;
