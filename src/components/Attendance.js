import React, { useState, useEffect } from "react";
import axios from "axios";
import ProfileCss from "../css/staff.module.css";

// Declare this early to avoid use-before-declaration
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
  approvedBy: "",
};

function Attendance() {
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

    // Calculate working hours
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
        end.setDate(end.getDate() + 1); // Overnight shift
        diff = end - start;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      updatedFormData.workingHours = `${hours
        .toString()
        .padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
    }

    // Calculate leave days
    if (name === "startLeaveDay" || name === "endLeaveDay") {
      const start = new Date(updatedFormData.startLeaveDay);
      const end = new Date(updatedFormData.endLeaveDay);
      if (!isNaN(start) && !isNaN(end) && end >= start) {
        const lastDay = getLastDayOfMonth(start);
        const countUntil = end > lastDay ? lastDay : end;
        const diffDays =
          Math.ceil((countUntil - start) / (1000 * 60 * 60 * 24)) + 1;
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
      const response = await fetch("http://localhost:8000/attendancefunction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Data submitted successfully!");
        setFormData(initialForm);
        fetchData();
      } else {
        const errorText = await response.text();
        alert("Failed to submit: " + errorText);
      }
    } catch (error) {
      console.error("Error submitting:", error);
      alert("Server error");
    }
  };

  const fetchData = () => {
    axios.get("http://localhost:8000/attendancefunction").then((res) => {
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
      .put(`http://localhost:8000/attendancefunction/${editId}`, formData)
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
        .delete(`http://localhost:8000/attendancefunction/${id}`)
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
      <h2>Mae Tao Clinic Staff Timesheet</h2>
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
            <option value="">Gender</option>
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
            <option>in charge</option>
            <option>Supervisor</option>
            <option>Shiftleader</option>
            <option>Medic Staff</option>
            <option>Accountant</option>
            <option>Staff</option>
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
          Working Hours:
          <input
            type="text"
            name="workingHours"
            value={formData.workingHours}
            onChange={handleChange}
          />
        </label>

        <label>
          Start Leave:
          <input
            type="date"
            name="startLeaveDay"
            value={formData.startLeaveDay}
            onChange={handleChange}
          />
        </label>

        <label>
          End Leave:
          <input
            type="date"
            name="endLeaveDay"
            value={formData.endLeaveDay}
            onChange={handleChange}
          />
        </label>

        <label>
          Total Leave:
          <input
            type="text"
            name="totalLeaveDaysThisMonth"
            value={formData.totalLeaveDaysThisMonth}
            onChange={handleChange}
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
        <button
          type="button"
          className={ProfileCss.submitBtn}
          onClick={UpdateFunction}
        >
          Update
        </button>
      </form>

      <h3>Staff Attendance Records List</h3>
      {data.map((attendance) => (
        <div key={attendance.id} className={ProfileCss.Card}>
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
                <p> {attendance.name}</p>
              </td>
              <td>
                <p> {attendance.gender}</p>
              </td>
              <td>
                <p> {attendance.position}</p>
              </td>

              <td>
                <p> {attendance.type}</p>
              </td>
              <td>
                <p> {attendance.date}</p>
              </td>
              <td>
                <p> {attendance.timeIn}</p>
              </td>
              <td>
                <p> {attendance.timeOut}</p>
              </td>
              <td>
                <p> {attendance.workingHours}</p>
              </td>
            </tr>
          </thead>

          <button
            className={ProfileCss.editAttendance}
            onClick={() => editFunction(attendance.id)}
          >
            Edit
          </button>
          <button
            className={ProfileCss.deleteAttendance}
            onClick={() => deleteFunction(attendance.id)}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default Attendance;
