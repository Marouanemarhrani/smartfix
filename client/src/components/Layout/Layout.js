import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { Helmet } from "react-helmet";
import  { Toaster } from "react-hot-toast";

const Layout = ({
  children,
  title = "Smart Fix - Connect with Tradespeople",
  description = "Connect with qualified tradespeople for all your repair needs",
  keywords = "repairs, tradespeople, home maintenance, plumbing, electrical, carpentry",
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
        <Header />
            <main style={{ minHeight: "80vh"}}>
              <Toaster />
                {children}
            </main>
        <Footer />
    </div>
  );
};

export default Layout;
