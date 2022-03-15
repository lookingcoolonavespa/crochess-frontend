import NavBar from './NavBar';
import React from 'react';

type Layout = {
  children: React.ReactNode;
};

const Layout = ({ children }: Layout) => {
  return (
    <>
      <NavBar />;<main>{children}</main>
    </>
  );
};
