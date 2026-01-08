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
        <div
          className="m-header"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "12px 0",
            backgroundColor: "#aee0df"
          }}
        >
          <a
            href="/"
            className="b-brand"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <img
              src="/assets/images/logo.png"
              alt="Radiance Logo"
              style={{
                maxWidth: "180px",
                width: "100%",
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
