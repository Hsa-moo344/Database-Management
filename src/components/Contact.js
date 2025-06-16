import axios from "axios";
import ProfileCss from "../css/staff.module.css";
import React, { useState } from "react";

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

function Contact() {
  const [openGroup, setOpenGroup] = useState(null);

  const toggleGroup = (groupName) => {
    setOpenGroup(openGroup === groupName ? null : groupName);
  };

  return (
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
  );
}

export default Contact;
