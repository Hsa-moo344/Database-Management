import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProfileCss from "../css/staff.module.css";

function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("username");
    if (isLoggedIn !== "true") {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div>
      {/* <div className={ProfileCss.Dropdown}>
        <button className={ProfileCss.dropbtl}>Departments</button>
        <div className={ProfileCss.BtlContent}>
          <a href="#">Finance</a>
          <a href="#">Security/Public Relation</a>
          <a href="#">Administration/HR</a>
          <a href="#">Organizational Development</a>
          <a href="#">HIS/Registration</a>
          <a href="#">Health Adminstration Office</a>
          <a href="#">Eye</a>
          <a href="#">Adult OPD</a>
          <a href="#">Dental</a>
          <a href="#">Child OPD/Immunization</a>
          <a href="#">RH OPD</a>
          <a href="#">VCT/Blood Bank</a>
          <a href="#">Pharmacy OPD/Main Cental</a>
          <a href="#">Physio/TCM</a>
          <a href="#">RH IPD</a>
          <a href="#">Child IPD</a>
          <a href="#">Adult IPD</a>
          <a href="#">Surgical IPD</a>
        </div>
      </div> */}
      <h2 className={ProfileCss.MainPage}>
        Welcome to Staff Management Main Page
      </h2>

      <div className={ProfileCss.navBtl}>
        <button
          className={ProfileCss.addButton}
          onClick={() => navigate("/attendance")}
        >
          Staff Attendance/Timesheet
        </button>
        <button
          className={ProfileCss.addButton}
          onClick={() => navigate("/individual")}
        >
          Individual Timesheet
        </button>
        <button
          className={ProfileCss.addButton}
          onClick={() => navigate("/payroll")}
        >
          Staff Payroll
        </button>

        <button
          className={ProfileCss.addButton}
          onClick={() => navigate("/add-staff")}
        >
          + Add New Staff Name
        </button>

        <button
          className={ProfileCss.addButton}
          onClick={() => navigate("/staffdatabase")}
        >
          Staff Profile Database
        </button>

        <button
          className={ProfileCss.addButton}
          onClick={() => navigate("/profile")}
        >
          Staff Profile
        </button>
        <button
          className={ProfileCss.addButton}
          onClick={() => navigate("/fundraising")}
        >
          Fundraising
        </button>
      </div>
    </div>
  );
}

export default Home;
