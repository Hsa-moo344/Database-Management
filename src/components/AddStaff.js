import React, { useEffect, useState } from "react";
import axios from "axios";
import ProfileCss from "../css/staff.module.css";

const initialStaffForm = {
  staffCode: "",
  fullName: "",
  gender: "",
  position: "",
  department: "",
};

function AddStaff() {
  const [formData, setFormData] = useState(initialStaffForm);
  const [staffData, setStaffData] = useState([]);
  const [editId, setEditId] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentStaff = staffData.slice(indexOfFirstRow, indexOfLastRow);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const fetchData = () => {
    axios
      .get("http://localhost:8000/staffdepartment")
      .then((res) => setStaffData(res.data))
      .catch((err) => console.error("Fetch error:", err));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editId !== null) {
      handleUpdate();
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:8000/staffdepartment",
        formData
      );

      if (res.status === 200 || res.status === 201) {
        alert("Staff added successfully!");
        setFormData(initialStaffForm);
        fetchData();
      }
    } catch (err) {
      console.error("Submit error:", err);
      alert("Failed to submit");
    }
  };

  const handleUpdate = () => {
    axios
      .put(`http://localhost:8000/staffdepartment/${editId}`, formData)
      .then(() => {
        alert("Staff updated successfully");
        setFormData(initialStaffForm);
        setEditId(null);
        fetchData();
      })
      .catch((err) => {
        console.error("Update error:", err);
        alert("Update failed");
      });
  };

  const handleEdit = (id) => {
    const staff = staffData.find((s) => s.id === id);
    if (staff) {
      setFormData({
        staffCode: staff.staffCode || "",
        fullName: staff.fullName || "",
        gender: staff.gender || "",
        position: staff.position || "",
        department: staff.department || "",
      });
      setEditId(id);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this staff?")) {
      axios
        .delete(`http://localhost:8000/staffdepartment/${id}`)
        .then(() => {
          alert("Deleted successfully");
          fetchData();
        })
        .catch((err) => {
          console.error("Delete error:", err);
          alert("Failed to delete");
        });
    }
  };

  return (
    <div className={ProfileCss.StaffMainTbl}>
      <h1 className={ProfileCss.Heading}>💹Add Staff Page Form</h1>

      <form onSubmit={handleSubmit} className={ProfileCss.FormContainer}>
        <label>
          Staff Code:
          <input
            type="text"
            name="staffCode"
            value={formData.staffCode}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Full Name:
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
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
            <option value="">Select Gender</option>
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
            <option value="">Select Position</option>
            <option>Director</option>
            <option>Assistant Director</option>
            <option>Deputy Director</option>
            <option>Assistant Deputy Director</option>
            <option>Manager</option>
            <option>In Charge</option>
            <option>Coordinator</option>
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
            <option value="">Select Department</option>
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

        <button type="submit" className={ProfileCss.submitBtn}>
          {editId ? "Update" : "Submit"}
        </button>
      </form>

      <table className={ProfileCss.StaffTable}>
        <thead>
          <tr>
            <th>No.</th>
            <th>Staff Code</th>
            <th>Full Name</th>
            <th>Gender</th>
            <th>Position</th>
            <th>Department</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentStaff.map((item, index) => (
            <tr key={item.id}>
              <td>{indexOfFirstRow + index + 1}</td>
              <td>{item.staffCode}</td>
              <td>{item.fullName}</td>
              <td>{item.gender}</td>
              <td>{item.position}</td>
              <td>{item.department}</td>
              <td>
                <button
                  onClick={() => handleEdit(item.id)}
                  className={ProfileCss.EditBtn}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className={ProfileCss.DeletetBtn}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
        <div>
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Prev
          </button>

          <span style={{ margin: "0 10px" }}>Page {currentPage}</span>

          <button
            onClick={() =>
              setCurrentPage((prev) =>
                prev < Math.ceil(staffData.length / rowsPerPage)
                  ? prev + 1
                  : prev
              )
            }
            disabled={currentPage >= Math.ceil(staffData.length / rowsPerPage)}
          >
            Next
          </button>
        </div>
      </table>
    </div>
  );
}

export default AddStaff;
