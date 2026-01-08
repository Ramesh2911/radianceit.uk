import React, { useCallback, useEffect, useState } from 'react';
import {
   API_DEPARTMENT_COUNT,
   API_DESIGNATION_COUNT,
   API_EMPLOYEES_COUNT,
   API_FETCH_EMPLOYEE,
   API_LIST_DEPARTMENT,
   API_LIST_DESIGNATION,
   API_LIST_PROJECTS,
   API_PROJECTS_COUNT
}
   from '../../config/Api';
import { Link } from 'react-router-dom';

const Dashboard = (props) => {

   const roleName = localStorage.getItem("role_name");
   const empId = localStorage.getItem('emp_id');

   const getHolidaysByYear = useCallback((year) => {
      const getDayName = (dateStr) =>
         new Date(dateStr).toLocaleDateString("en-US", { weekday: "long" });

      const getEasterSunday = (year) => {
         const f = Math.floor;
         const G = year % 19;
         const C = Math.floor(year / 100);
         const H = (C - Math.floor(C / 4) - Math.floor((8 * C + 13) / 25) + 19 * G + 15) % 30;
         const I = H - Math.floor(H / 28) * (1 - Math.floor(29 / (H + 1)) * Math.floor((21 - G) / 11));
         const J = (year + Math.floor(year / 4) + I + 2 - C + Math.floor(C / 4)) % 7;
         const L = I - J;
         const month = 3 + Math.floor((L + 40) / 44);
         const day = L + 28 - 31 * Math.floor(month / 4);
         return new Date(year, month - 1, day);
      };

      const getNthWeekdayOfMonth = (year, month, weekday, nth) => {
         const firstDay = new Date(year, month, 1);
         const offset = ((7 + weekday - firstDay.getDay()) % 7) + (nth - 1) * 7;
         return new Date(year, month, 1 + offset).toISOString().split("T")[0];
      };

      const getLastWeekdayOfMonth = (year, month, weekday) => {
         const lastDay = new Date(year, month + 1, 0);
         const offset = (7 + lastDay.getDay() - weekday) % 7;
         return new Date(year, month + 1, 0 - offset).toISOString().split("T")[0];
      };

      const easterSunday = getEasterSunday(year);
      const format = (d) => d.toISOString().split("T")[0];

      return [
         { name: "New Year's Day", date: `${year}-01-01` },
         { name: "Good Friday", date: format(new Date(easterSunday.getTime() - 2 * 86400000)) },
         { name: "Easter Monday", date: format(new Date(easterSunday.getTime() + 86400000)) },
         { name: "Early May Bank Holiday", date: getNthWeekdayOfMonth(year, 4, 1, 1) },
         { name: "Spring Bank Holiday", date: getLastWeekdayOfMonth(year, 4, 1) },
         { name: "Summer Bank Holiday", date: getLastWeekdayOfMonth(year, 7, 1) },
         { name: "Christmas Day", date: `${year}-12-25` },
         { name: "Boxing Day", date: `${year}-12-26` }
      ].map(h => ({ ...h, day: getDayName(h.date) }));
   }, []);

   const [upcomingHoliday, setUpcomingHoliday] = useState(null);

   useEffect(() => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const year = today.getFullYear();
      const holidays = getHolidaysByYear(year);

      const nextHoliday = holidays
         .sort((a, b) => new Date(a.date) - new Date(b.date))
         .find(h => new Date(h.date) >= today);

      setUpcomingHoliday(nextHoliday || null);
   }, [getHolidaysByYear]);

   const [empCount, setEmpCount] = useState({ total_employees: 0 });
   const [projectCount, setProjectCount] = useState(0);
   const [departmentCount, setDepartmentCount] = useState(0);
   const [designationCount, setDesignationCount] = useState(0);
   const [empDetailsCount, setEmpDetailsCount] = useState([]);
   const [projectData, setProjectData] = useState([]);
   const [departmentData, setDepartmentData] = useState([]);
   const [designationData, setDesignationData] = useState([]);

   useEffect(() => {
      if (roleName === "ADMIN") {
         fetchEmpCount();
         fetchProjectCount();
         fetchDepartmentCount();
         fetchDesignationCount();
      } else {
         fetchDesignation();
         fetchDepartment();
         fetchProject();
         fetchEmpDetailsCount();
      }
   }, [roleName]);

   const fetchEmpCount = () => {
      props.callRequest("GET", API_EMPLOYEES_COUNT, true, null)
         .then(res => setEmpCount(res?.data?.data))
         .catch(console.log);
   };

   const fetchProjectCount = () => {
      props.callRequest("GET", API_PROJECTS_COUNT, true, null)
         .then(res => setProjectCount(res?.data))
         .catch(console.log);
   };

   const fetchDepartmentCount = () => {
      props.callRequest("GET", API_DEPARTMENT_COUNT, true, null)
         .then(res => setDepartmentCount(res?.data))
         .catch(console.log);
   };

   const fetchDesignationCount = () => {
      props.callRequest("GET", API_DESIGNATION_COUNT, true, null)
         .then(res => setDesignationCount(res?.data))
         .catch(console.log);
   };

   const fetchProject = () => {
      props.callRequest("GET", API_LIST_PROJECTS, true, null)
         .then(res => setProjectData(res?.data?.data || []))
         .catch(console.log);
   };

   const fetchDepartment = () => {
      props.callRequest("GET", API_LIST_DEPARTMENT, true, null)
         .then(res => setDepartmentData(res?.data?.data || []))
         .catch(console.log);
   };

   const fetchDesignation = () => {
      props.callRequest("GET", API_LIST_DESIGNATION, true, null)
         .then(res => setDesignationData(res?.data?.data || []))
         .catch(console.log);
   };

   const fetchEmpDetailsCount = () => {
      props.callRequest("GET", `${API_FETCH_EMPLOYEE}/${empId}`, true, null)
         .then(res => setEmpDetailsCount(res?.data?.data))
         .catch(console.log);
   };

   const getDepartmentName = (id) =>
      departmentData.find(d => d.id === Number(id))?.department_name || "Not Assigned";

   const getDesignationName = (id) =>
      designationData.find(d => d.id === Number(id))?.designation_name || "Not Assigned";

   const getProjectName = (id) =>
      projectData.find(p => p.id === Number(id))?.project_title || "Not Assigned";

   return (
      <>
         <div className='p-3 d-flex justify-content-around mt-3'>
            {roleName === "ADMIN" && (
               <div className='px-3 pt-2 pb-3 border shadow-sm w-25'>
                  <div className='text-center pb-1'>
                     <Link to="/employees">
                        <h4>Employee</h4>
                     </Link>
                  </div>
                  <hr />
                  <div className='d-flex justify-content-between'>
                     <i className="las la-users"></i>
                     <h5>{empCount?.total_employees || 0}</h5>
                  </div>
               </div>
            )}
            <div className='px-3 pt-2 pb-3 border shadow-sm w-25'>
               <div className='text-center pb-1'>
                  {roleName === "ADMIN" ? (
                     <Link to="/project">
                        <h4>Project</h4>
                     </Link>
                  ) : (
                     <h4>Project</h4>
                  )}
               </div>
               <hr />
               <div className='d-flex justify-content-between'>
                  <i className="las la-briefcase"></i>
                  {roleName === "ADMIN" ? (
                     <h5>{projectCount?.data?.total_projects || 0}</h5>
                  ) : (
                     <h5>
                        {empDetailsCount?.assigned_project ? getProjectName(empDetailsCount?.assigned_project) : "Not Assigned"}
                     </h5>
                  )}
               </div>
            </div>
            <div className='px-3 pt-2 pb-3 border shadow-sm w-25'>
               <div className='text-center pb-1'>
                  {roleName === "ADMIN" ? (
                     <Link to="/department">
                        <h4>Department</h4>
                     </Link>
                  ) : (
                     <h4>Department</h4>
                  )}
               </div>
               <hr />
               <div className='d-flex justify-content-between'>
                  <i className="las la-home"></i>
                  {roleName === "ADMIN" ? (
                     <h5>{departmentCount?.data?.total_departments || 0}</h5>
                  ) : (
                     <h5>
                        {empDetailsCount?.emp_department ? getDepartmentName(empDetailsCount?.emp_department) : "Not Assigned"}
                     </h5>
                  )}
               </div>
            </div>
         </div>
         <div className='p-3 d-flex justify-content-around mt-3'>
            <div className='px-3 pt-2 pb-3 border shadow-sm w-25'>
               <div className='text-center pb-1'>
                  {roleName === "ADMIN" ? (
                     <Link to="/designation">
                        <h4>Designation</h4>
                     </Link>
                  ) : (
                     <h4>Designation</h4>
                  )}
               </div>
               <hr />
               <div className='d-flex justify-content-between'>
                  <i className="las la-file"></i>
                  {roleName === "ADMIN" ? (
                     <h5>{designationCount?.data?.total_designations || 0}</h5>
                  ) : (
                     <h5>
                        {empDetailsCount?.emp_position ? getDesignationName(empDetailsCount?.emp_position) : "Not Assigned"}
                     </h5>
                  )}
               </div>
            </div>
            <div className='px-3 pt-2 pb-3 border shadow-sm w-25'>
               <div className='text-center pb-1'>
                  <h4>Upcoming Holiday</h4>
               </div>
               <hr />
               <div>
                  {upcomingHoliday ? (
                     <div>
                        <h5>{upcomingHoliday.name}</h5>
                        <p>{props.getFormatedDate(upcomingHoliday.date)} - {upcomingHoliday.day}</p>
                     </div>
                  ) : (
                     <p>No upcoming holidays</p>
                  )}
               </div>
            </div>
         </div>
      </>
   );
};

export default Dashboard;
