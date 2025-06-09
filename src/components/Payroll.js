import React, { useState, useEffect } from "react";
import axios from "axios";
import ProfileCss from "../css/staff.module.css";
import jsPDF from "jspdf";
import "jspdf-autotable";

const PayRollForm = {
  staffCode: "",
  fullName: "",
  salaryYear: "",
  payMonth: "",
  workingDays: "",
  leaveDays: "",
  totalHours: "",
  hourlyRate: "",
  grossSalary: "",
  deductions: "",
  netSalary: "",
  paymentStatus: "",
};

function Payroll() {
  const [PayRollData, setPayRollData] = useState(PayRollForm);
  const [data, setData] = useState([]);
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Handle input change and calculate netSalary when grossSalary or deductions change
  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedData = { ...PayRollData, [name]: value };

    const grossSalary =
      parseFloat(name === "grossSalary" ? value : updatedData.grossSalary) || 0;
    const deductions =
      parseFloat(name === "deductions" ? value : updatedData.deductions) || 0;

    if (name === "grossSalary" || name === "deductions") {
      updatedData.netSalary = (grossSalary - deductions).toFixed(2); // Fixed to 2 decimals
    }

    setPayRollData(updatedData);
  };

  // Fetch data from backend
  const fetchData = () => {
    axios
      .get("http://localhost:8000/payrollfunction")
      .then((res) => setData(res.data))
      .catch((err) => console.error("Failed to fetch payroll data:", err));
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Submit new payroll data
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Exclude grossSalary and netSalary because they are calculated values
      const { grossSalary, netSalary, ...submitData } = PayRollData;

      const response = await fetch("http://localhost:8000/payrollfunction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitData),
      });

      if (response.ok) {
        alert("Data submitted successfully!");
        setPayRollData(PayRollForm);
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

  // Load data into form for editing
  const editFunction = (id) => {
    const payrollItem = data.find((item) => item.id === id);
    if (payrollItem) {
      setPayRollData({ ...payrollItem });
      setEditId(id);
    }
  };

  // Update existing payroll data
  const UpdateFunction = () => {
    if (!editId) {
      alert("No item selected for update");
      return;
    }

    const { grossSalary, netSalary, ...submitData } = PayRollData;

    axios
      .put(`http://localhost:8000/payrollfunction/${editId}`, submitData)
      .then(() => {
        alert("Updated successfully");
        fetchData();
        setPayRollData(PayRollForm);
        setEditId(null);
      })
      .catch((err) => {
        console.error("Update failed", err);
        alert("Update failed");
      });
  };

  // Delete payroll record
  const deleteFunction = (id) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      axios
        .delete(`http://localhost:8000/payrollfunction/${id}`)
        .then(() => {
          alert("Deleted successfully");
          fetchData();
        })
        .catch((err) => {
          console.error("Delete failed", err);
          alert("Failed to delete");
        });
    }
  };

  // Search filter
  const filteredData = data.filter(
    (item) =>
      item.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.staffCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const displayedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Export table data to PDF
  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Payroll Report", 14, 10);

    const tableColumn = [
      "Staff Code",
      "Full Name",
      "Salary Year",
      "Pay Month",
      "Working Days",
      "Leave Days",
      "Total Hours",
      "Hourly Rate",
      "Gross Salary",
      "Deductions",
      "Net Salary",
      "Payment Status",
    ];

    const tableRows = data.map((row) => [
      row.staffCode,
      row.fullName,
      row.salaryYear,
      row.payMonth,
      row.workingDays,
      row.leaveDays,
      row.totalHours,
      row.hourlyRate,
      row.grossSalary,
      row.deductions,
      row.netSalary,
      row.paymentStatus,
    ]);

    doc.autoTable({ head: [tableColumn], body: tableRows, startY: 20 });
    doc.save("payroll_report.pdf");
  };

  return (
    <div className={ProfileCss.MainAttendance}>
      <h2>Mae Tao Clinic Payroll Staff</h2>

      <input
        type="text"
        placeholder="Search by Name or Code"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setCurrentPage(1); // Reset page when searching
        }}
        className={ProfileCss.searchBox}
      />

      <form className={ProfileCss.Attend} onSubmit={handleSubmit}>
        {Object.entries(PayRollForm).map(([key]) => (
          <label key={key}>
            {key
              .replace(/([A-Z])/g, " $1")
              .replace(/^./, (str) => str.toUpperCase())}
            :
            {key === "payMonth" || key === "paymentStatus" ? (
              <select
                name={key}
                value={PayRollData[key]}
                onChange={handleChange}
                required
              >
                <option value="">
                  Select {key === "payMonth" ? "Month" : "Status"}
                </option>
                {key === "payMonth"
                  ? [
                      "January",
                      "February",
                      "March",
                      "April",
                      "May",
                      "June",
                      "July",
                      "August",
                      "September",
                      "October",
                      "November",
                      "December",
                    ].map((month) => (
                      <option key={month} value={month}>
                        {month}
                      </option>
                    ))
                  : ["Pending", "Paid"].map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
              </select>
            ) : (
              <input
                type={
                  key.includes("Days") ||
                  key.includes("Hours") ||
                  key.includes("Rate") ||
                  key.includes("Salary") ||
                  key === "deductions"
                    ? "number"
                    : "text"
                }
                name={key}
                value={PayRollData[key]}
                onChange={handleChange}
                required={key !== "deductions"} // deductions can be empty
                step="any" // allows decimals
                min={key === "deductions" ? 0 : undefined} // deductions min 0
              />
            )}
          </label>
        ))}

        <button type="submit" className={ProfileCss.submitBtn}>
          Submit
        </button>
        <button
          type="button"
          onClick={UpdateFunction}
          className={ProfileCss.submitBtn}
          disabled={!editId}
          title={!editId ? "Select a record to update" : ""}
        >
          Update
        </button>
      </form>

      <h3>Payroll Records List</h3>
      <div className={ProfileCss.tableContainer}>
        <table className={ProfileCss.table}>
          <thead>
            <tr>
              {Object.keys(PayRollForm).map((key) => (
                <th key={key}>
                  {key
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, (str) => str.toUpperCase())}
                </th>
              ))}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayedData.map((payroll) => (
              <tr key={payroll.id}>
                {Object.keys(PayRollForm).map((key) => (
                  <td key={key}>{payroll[key]}</td>
                ))}
                <td>
                  <button
                    onClick={() => editFunction(payroll.id)}
                    className={ProfileCss.editPayroll}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteFunction(payroll.id)}
                    className={ProfileCss.deletePayroll}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {displayedData.length === 0 && (
              <tr>
                <td colSpan={Object.keys(PayRollForm).length + 1}>
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <button onClick={downloadPDF} className={ProfileCss.submitBtn}>
          Download PDF
        </button>
      </div>

      {/* Pagination buttons */}
      {totalPages > 1 && (
        <div className={ProfileCss.pagination}>
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index + 1)}
              className={`${ProfileCss.pageBtn} ${
                currentPage === index + 1 ? ProfileCss.activePage : ""
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default Payroll;
