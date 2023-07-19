import React from 'react'
import TopNav from '../molecules/TopNav/TopNav';
import SideNav from '../molecules/SideNav/SideNav';

const Layout = ({ children }) => {
  return (
    <>
        <SideNav />
      <div className="site-body-wrapper sm-site-body">
      <TopNav />
        <section className="new-page-bpdy-content ml-0">
          {children}
        </section>
      </div>
    </>
  );
};

export default Layout