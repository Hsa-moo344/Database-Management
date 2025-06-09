import React, { useState, useEffect } from "react";
import ProfileCss from "../css/staff.module.css";
import axios from "axios";

function Individual() {
  const initialForm = {
    name: "",
    gender: "",
    position: "",
    department: "",
    email: "",
    type: "",
    date: "",
    timeIn: "",
    timeOut: "",
    workingHours: "",
    startLeaveDay: "",
    endLeaveDay: "",
    totalLeaveDaysThisMonth: 0,
    activities: "",
    approvedBy: "",
  };

  const [formData, setFormData] = useState(initialForm);
  const [data, setData] = useState([]);
  const [editId, setEditId] = useState(null);

  const getLastDayOfMonth = (date) => {
    const d = new Date(date);
    return new Date(d.getFullYear(), d.getMonth() + 1, 0);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedFormData = { ...formData, [name]: value };

    if (
      (name === "timeIn" || name === "timeOut") &&
      updatedFormData.timeIn &&
      updatedFormData.timeOut
    ) {
      const [startHour, startMinute] = updatedFormData.timeIn
        .split(":")
        .map(Number);
      const [endHour, endMinute] = updatedFormData.timeOut
        .split(":")
        .map(Number);

      const start = new Date();
      const end = new Date();
      start.setHours(startHour, startMinute, 0);
      end.setHours(endHour, endMinute, 0);

      let diff = end - start;
      if (diff < 0) {
        end.setDate(end.getDate() + 1);
        diff = end - start;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      updatedFormData.workingHours = `${hours
        .toString()
        .padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
    }

    if (name === "startLeaveDay" || name === "endLeaveDay") {
      const start = new Date(updatedFormData.startLeaveDay);
      const end = new Date(updatedFormData.endLeaveDay);

      if (!isNaN(start) && !isNaN(end) && end >= start) {
        const lastDayOfStartMonth = getLastDayOfMonth(start);
        const lastCountDay =
          end > lastDayOfStartMonth ? lastDayOfStartMonth : end;
        const dayInMs = 1000 * 60 * 60 * 24;
        const diffDays = Math.ceil((lastCountDay - start) / dayInMs) + 1;
        updatedFormData.totalLeaveDaysThisMonth = diffDays;
      } else {
        updatedFormData.totalLeaveDaysThisMonth = 0;
      }
    }

    setFormData(updatedFormData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8000/individualfunction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Data submitted successfully!");
        setFormData(initialForm);
      } else {
        const errorText = await response.text();
        alert("Failed to submit: " + errorText);
      }
    } catch (error) {
      console.error("Error submitting:", error);
      alert("Server error, please try again later.");
    }
  };

  const fetchData = () => {
    axios.get("http://localhost:8000/individualfunction").then((res) => {
      setData(res.data);
    });
  };

  const editFunction = (id) => {
    const staff = data.find((s) => s.id === id);
    if (staff) {
      setFormData({ ...staff });
      setEditId(id);
    }
  };

  const UpdateFunction = () => {
    if (!editId) {
      alert("No item selected for update");
      return;
    }

    axios
      .put(`http://localhost:8000/individualfunction/${editId}`, formData)
      .then(() => {
        alert("Updated successfully");
        fetchData();
        setFormData(initialForm);
        setEditId(null);
      })
      .catch((err) => {
        console.log("Update failed", err);
        alert("Update failed");
      });
  };

  const deleteFunction = (id) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      axios
        .delete(`http://localhost:8000/individualfunction/${id}`)
        .then(() => {
          alert("Deleted successfully");
          fetchData();
        })
        .catch((err) => {
          console.log("Delete failed", err);
          alert("Failed to delete");
        });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className={ProfileCss.MainAttendance}>
      <h2>Mae Tao Clinic Individual Timesheet</h2>
      <form className={ProfileCss.Attend} onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Gender:
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
          >
            <option value="">Select</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
        </label>

        <label>
          Position:
          <select
            name="position"
            value={formData.position}
            onChange={handleChange}
            required
          >
            <option value="">position</option>
            <option>Director</option>
            <option>Assistant Director</option>
            <option>Deputy Director</option>
            <option>Assistant Deputy Director</option>
            <option>Manager</option>
            <option>in charge</option>
            <option>Supervisor</option>
            <option>Shiftleader</option>
            <option>Medic Staff</option>
            <option>Accountant</option>
            <option>Volunteer</option>
            <option>Technical Support</option>
            <option>Medical Educator</option>
          </select>
        </label>

        <label>
          Department:
          <select
            name="department"
            value={formData.department}
            onChange={handleChange}
            required
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
        </label>

        <label>
          Email:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </label>

        <label>
          Type:
          <input
            list="typeOptions"
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
          />
          <datalist id="typeOptions">
            <option value="Work" />
            <option value="Leave" />
            <option value="Absent" />
            <option value="Day Off" />
            <option value="Leave Without Pay" />
            <option value="Maternity Leave" />
            <option value="Paternity Leave" />
            <option value="Health Accident" />
            <option value="Education Leave" />
          </datalist>
        </label>

        <label>
          Date:
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </label>

        {/* Leave start date */}
        <label>
          Leave Start Date:
          <input
            type="date"
            name="startLeaveDay"
            value={formData.startLeaveDay}
            onChange={handleChange}
          />
        </label>

        {/* Leave end date */}
        <label>
          Leave End Date:
          <input
            type="date"
            name="endLeaveDay"
            value={formData.endLeaveDay}
            onChange={handleChange}
          />
        </label>

        {/* Display leave days this month */}
        <label>
          Leave Days This Month:
          <input
            type="number"
            value={formData.totalLeaveDaysThisMonth}
            readOnly
          />
        </label>

        <label>
          Time In:
          <input
            type="time"
            name="timeIn"
            value={formData.timeIn}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Time Out:
          <input
            type="time"
            name="timeOut"
            value={formData.timeOut}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Working hour:
          <input
            type="text"
            name="workingHours"
            value={formData.workingHours}
            readOnly
          />
        </label>
        <label>
          Activities:
          <textarea
            name="activities"
            onChange={handleChange}
            rows="5"
            cols="40"
            placeholder="Enter your activities here..."
          />
        </label>

        <label>
          Approved By:
          <input
            type="text"
            name="approvedBy"
            value={formData.approvedBy}
            onChange={handleChange}
          />
        </label>

        <button type="submit" className={ProfileCss.submitBtn}>
          Submit
        </button>
      </form>
      <h3>Individual Staff Records List</h3>
      {data.map((individual) => (
        <div key={individual.id} className={ProfileCss.CardIndividual}>
          <thead>
            <tr>
              <th>Name:</th>
              <th>Gender:</th>
              <th>Position:</th>
              <th>Type:</th>
              <th>Date:</th>
              <th>Time In:</th>
              <th>Time Out:</th>
              <th>Working Hours:</th>
            </tr>
            <tr>
              <td>
                <p> {individual.name}</p>
              </td>
              <td>
                <p> {individual.gender}</p>
              </td>
              <td>
                <p> {individual.position}</p>
              </td>

              <td>
                <p> {individual.type}</p>
              </td>
              <td>
                <p> {individual.date}</p>
              </td>
              <td>
                <p> {individual.timeIn}</p>
              </td>
              <td>
                <p> {individual.timeOut}</p>
              </td>
              <td>
                <p> {individual.workingHours}</p>
              </td>
            </tr>
          </thead>

          <button
            className={ProfileCss.editIndividual}
            onClick={() => editFunction(individual.id)}
          >
            Edit
          </button>
          <button
            className={ProfileCss.deleteIndividual}
            onClick={() => deleteFunction(individual.id)}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default Individual;
