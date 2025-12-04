import React, { useState } from "react";

import Sidebar from "../../components/common/Sidebar";

function SidebarsScreen(props) {
  // const [showSidebar, setShowSidebar] = useState(false);

  const { showSidebar } = props;
  return (
    <nav
      className={showSidebar ? "pc-sidebar mob-sidebar-active" : "pc-sidebar"}
    >
      <div className="navbar-wrapper">
        <div className="m-header">
          <a href="/" className="b-brand">
            <img
              src="/assets/images/logo.jpeg"
              alt=""
              className="logo logo-lg"
              style={{
        width: "45%",      
        height: "auto",       
        objectFit: "contain",
        display: "block"
      }}
            />
          </a>
        </div>
        <Sidebar {...props} />
      </div>
    </nav>
  );
}

export default SidebarsScreen;
