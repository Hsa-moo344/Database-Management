import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import ProfileCss from "../css/staff.module.css";

function Login({ setIsLoggedIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();

  const testUser = {
    email: "hsamoomoo02@gmail.com",
    password: "123456",
  };

  useEffect(() => {
    const stored = localStorage.getItem("username");
    if (stored === "true") {
      setLoggedIn(true);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (email === testUser.email && password === testUser.password) {
      localStorage.setItem("username", true);
      setLoggedIn(true);
      setIsLoggedIn(true);
      navigate("/home");
    } else {
      setError("Invalid email or password");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("username");
    setEmail("");
    setPassword("");
    setLoggedIn(false);
    setIsLoggedIn(false);
  };

  return (
    <div className={ProfileCss.Main}>
      <div className={ProfileCss.MianCont}>Login</div>

      {error && <p style={{ color: "#f70d3f" }}>{error}</p>}
      <label>Email:</label>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <br />
      <label>Password:</label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <br />
      <button onClick={handleSubmit}>Login</button>
    </div>
  );
}

export default Login;
