import React, { useState, useEffect } from "react";
import axios from "axios";

const About = () => {
  const [department, setDepartment] = useState("Finance");
  const [month, setMonth] = useState("June");
  const [records, setRecords] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/about", {
          params: { month, department },
        });
        setRecords(res.data);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    fetchData();
  }, [month, department]);

  return (
    <div>
      <h2>Staff Report</h2>

      <label>Department: </label>
      <select
        value={department}
        onChange={(e) => setDepartment(e.target.value)}
      >
        <option value="">Departments</option>
        <option>Finance</option>
        <option>HR</option>
        <option>Adult OPD</option>
        <option>Eye</option>
        <option>Dental</option>
        <option>Child OPD/Immunization</option>
        <option>RH OPD</option>
        <option>Lab</option>
        <option>RH IPD</option>
        <option>VCT/Blood Bank</option>
        <option>Pharmacy OPD/IPD/Main Center</option>
        <option>RH IPD</option>
        <option>Child IPD</option>
        <option>Surgical OPD/IPD</option>
        <option>Adult IPD</option>
        <option>Physiotherapy</option>
        <option>TCM</option>
        <option>Security/Public Relation</option>
        <option>Health Administraion Office</option>
        <option>HIS/Registration</option>
        <option>HR/OD</option>
        <option>ECU</option>
        <option>Administartion</option>
        <option>Kitchen</option>
        <option>BBHS</option>
        <option>Training</option>
      </select>

      <label>Month: </label>
      <select value={month} onChange={(e) => setMonth(e.target.value)}>
        <option value="January">January</option>
        <option value="FEbruary">February</option>
        <option value="March">March</option>
        <option value="April">April</option>
        <option value="May">May</option>
        <option value="June">June</option>
        <option value="July">July</option>
        <option value="August">August</option>
        <option value="September">September</option>
        <option value="October">October</option>
        <option value="November">November</option>
        <option value="December">December</option>
      </select>

      <table border="1">
        <thead>
          <tr>
            <th>Staff Code</th>
            <th>Name</th>
            <th>Gender</th>
            <th>Banding</th>
            <th>Position</th>
            <th>Department</th>
          </tr>
        </thead>
        <tbody>
          {records.map((r, index) => (
            <tr key={index}>
              <td>{r.staffCode}</td>
              <td>{r.fullName}</td>
              <td>{r.gender}</td>
              <td>{r.banding}</td>
              <td>{r.position}</td>
              <td>{r.department}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default About;
