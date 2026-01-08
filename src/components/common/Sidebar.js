import React, { useEffect, useState } from "react";
import AdminSidebar from "../sidebars/AdminSidebar";
import EmployeeSidebar from "../sidebars/EmpSidebar";
import useAuth from "../../hooks/useAuth";

function Sidebar(props) {
  const { isAuthenticated } = useAuth();
  const { showSidebar } = props;

  const userData = localStorage.getItem("role_name");
  const [roleName, setRoleName] = useState(
    isAuthenticated && userData ? userData : null
  );

  return (
    <>
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
          <div className="navbar-content">
            <li className="pc-item pc-caption">
              <label>&nbsp;</label>
            </li>
            {roleName === "ADMIN" && <AdminSidebar {...props} />}
            {roleName === "EMPLOYEE" && <EmployeeSidebar {...props} />}
          </div>
        </div>
      </nav>
    </>
  );
}

export default Sidebar;
