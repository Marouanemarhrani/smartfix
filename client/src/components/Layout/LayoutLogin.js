import React from 'react';
import HeaderLogin from './HeaderLogin';
import { Helmet } from "react-helmet";
import  { Toaster } from "react-hot-toast";

const LayoutLogin = ({
  children,
  title = "Smart Fix - Login",
  description = "Login to Smart Fix - Connect with qualified tradespeople",
  keywords = "login, authentication, tradespeople, repairs",
  author = "Smart Fix Team"
}) => {
  return (
    <div>
      <Helmet>
        <meta charSet='utf-8' />
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />
            <meta name="author" content={author} />
        <title>{title}</title>
      </Helmet>
        <HeaderLogin />
            <main style={{ minHeight: "80vh"}}>
              <Toaster />
                {children}
            </main>
    </div>
  );
};

export default LayoutLogin;
