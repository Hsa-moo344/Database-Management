import React, { useEffect, useState } from "react";
import axios from "axios";
import ProfileCss from "../css/staff.module.css";

const TotalStaff = () => {
  const [departments, setDepartments] = useState([]);
  const [openGroup, setOpenGroup] = useState(null);

  const toggleGroup = (groupName) => {
    setOpenGroup(openGroup === groupName ? null : groupName);
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

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/department-count")
      .then((res) => setDepartments(res.data))
      .catch((err) => console.error("Failed to fetch department counts", err));
  }, []);

  return (
    <div className={ProfileCss.MainAttendance}>
      <h2>Staff Count by Department</h2>

      <table className={ProfileCss.AttendanceTable}>
        <thead>
          <tr>
            <th>No.</th>
            <th>Department</th>
            <th>Total Staff</th>
          </tr>
        </thead>
        <tbody>
          {departments.map((item, index) => (
            <tr key={item.department}>
              <td>{index + 1}</td>
              <td>{item.department}</td>
              <td>{item.total_staff}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* All the department Table */}
      <div className={ProfileCss.DashboardMainGroup}>
        {Object.entries(departmentGroups).map(([groupName, departments]) => (
          <div key={groupName} className={ProfileCss.SubDashboard}>
            <button
              className={ProfileCss.BtnGroup}
              onClick={() => toggleGroup(groupName)}
            >
              {groupName}
            </button>
            {openGroup === groupName && (
              <div className={ProfileCss.BtnGroup}>
                {departments.map((dept, index) => (
                  <a href="#" key={index}>
                    {dept}
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TotalStaff;
