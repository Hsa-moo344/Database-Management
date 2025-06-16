import React, { useEffect, useState } from "react";
import axios from "axios";
import ProfileCss from "../css/staff.module.css";

const Dashboard = () => {
  const [departments, setDepartments] = useState([]);
  const [openGroup, setOpenGroup] = useState(null);
  const [staffGroup, setStaffGroup] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  const toggleGroup = (groupName) => {
    setOpenGroup(openGroup === groupName ? null : groupName);
  };

  const handleDepartmentClick = (departmentName) => {
    setSelectedDepartment(departmentName);
  };

  const handleStaffClick = (departmentName) => {
    setSelectedDepartment(departmentName);
  };

  const departmentGroups = {
    "Admin Units": [
      "Finance",
      "Security/Public Relation/Kitchen",
      "Administration",
      "HR",
      "OD",
      "Organizational Development",
      "Health Adminstration Office",
      "HIS/Registration",
      "BBHS",
      "Training",
      "CDC",
    ],
    "OPD Units": [
      "Adult OPD",
      "Child OPD/Immunization",
      "RH OPD",
      "Eye",
      "Dental",
      "VCT/Blood Bank",
      "Pharmacy OPD/Main Cental",
      "Physio/TCM",
      "IPU",
    ],
    "IPD Units": [
      "RH IPD",
      "Child IPD",
      "Adult IPD",
      "Surgical IPD",
      "Lab",
      "Nursing Aid",
      "ECU",
    ],
  };
  const stafftimesheet = {
    "Operation Units": [
      "Human Resource Profile",
      "Staff Timesheet",
      "Individual Timesheet",
      "Staff Payroll",
      "Staff Profile Detail",
    ],
  };

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/department-count")
      .then((res) => setDepartments(res.data))
      .catch((err) => console.error("Failed to fetch department counts", err));
  }, []);

  const filteredDepartments = selectedDepartment
    ? departments.filter((d) => d.department === selectedDepartment)
    : departments;

  return (
    <div className={ProfileCss.DahsboardBar}>
      {/* === Slide Navigation === */}
      <div className={ProfileCss.SubDahsboardBar}>
        <h3>Departments</h3>
        {Object.entries(departmentGroups).map(([group, depts]) => (
          <div key={group}>
            <div
              onClick={() => toggleGroup(group)}
              className={ProfileCss.GrpNav}
            >
              {group}
            </div>
            {openGroup === group && (
              <ul style={{ paddingLeft: "20px", listStyle: "none", margin: 0 }}>
                {depts.map((dept) => (
                  <li
                    key={dept}
                    className={`${ProfileCss.DeptDash} ${
                      selectedDepartment === dept ? ProfileCss.ActiveDept : ""
                    }`}
                    onClick={() => handleDepartmentClick(dept)}
                  >
                    {dept}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
        <div>
          Staff Profile Display
          {Object.entries(stafftimesheet).map(([group, depts]) => (
            <div key={group}>
              <div
                onClick={() => toggleGroup(group)}
                className={ProfileCss.GrpNav}
              >
                {group}
              </div>
              {openGroup === group && (
                <ul
                  style={{ paddingLeft: "20px", listStyle: "none", margin: 0 }}
                >
                  {depts.map((dept) => (
                    <li
                      key={dept}
                      className={`${ProfileCss.DeptDash} ${
                        selectedDepartment === dept ? ProfileCss.ActiveDept : ""
                      }`}
                      onClick={() => handleDepartmentClick(dept)}
                    >
                      {dept}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
        <button
          onClick={() => setSelectedDepartment(null)}
          className={ProfileCss.DashBtn}
        >
          Show All
        </button>
      </div>

      {/* === Table === */}
      <div
        className={ProfileCss.MainAttendance}
        style={{ flex: 1, padding: "20px" }}
      >
        <h2>
          {selectedDepartment
            ? `Staff Count for: ${selectedDepartment}`
            : "Staff Count by Department"}
        </h2>

        <table className={ProfileCss.AttendanceTable}>
          <thead>
            <tr>
              <th>No.</th>
              <th>Department</th>
              <th>Total Staff</th>
            </tr>
          </thead>
          <tbody>
            {filteredDepartments.map((item, index) => (
              <tr key={item.department}>
                <td>{index + 1}</td>
                <td>{item.department}</td>
                <td>{item.total_staff}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
