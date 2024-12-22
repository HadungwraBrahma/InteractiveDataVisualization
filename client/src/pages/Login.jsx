import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../config/axiosConfig.js";
import "../styles/Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showCredentials, setShowCredentials] = useState(false);
  const navigate = useNavigate();

  const testCredentials = [
    { email: "test0@gmail.com", password: "123456" },
    { email: "test2@gmail.com", password: "123456" },
  ];

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await axios.post("/api/auth/login", {
        email,
        password,
      });

      // Store token in localStorage
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const fillTestCredentials = (testAccount) => {
    setEmail(testAccount.email);
    setPassword(testAccount.password);
  };

  return (
    <div className="login-container">
      <div className="login-wrapper">
        <h2>Login</h2>

        {isLoading && (
          <div className="server-message">
            Since the website has been deployed on a free server that
            automatically shuts down after inactivity, the server may take up to
            1 minute to wake up. Please wait...
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div>
            <label htmlFor="email">Email:</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="password">Password:</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="error">{error}</p>}

          <button type="submit" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        <button
          className="test-credentials-button"
          onClick={() => setShowCredentials(!showCredentials)}
        >
          {showCredentials ? "Hide Test Credentials" : "Show Test Credentials"}
        </button>

        {showCredentials && (
          <div className="test-credentials-container">
            {testCredentials.map((cred, index) => (
              <div
                key={index}
                className="test-credential-box"
                onClick={() => fillTestCredentials(cred)}
              >
                <p>
                  <span className="label">Email:</span> {cred.email}
                </p>
                <p>
                  <span className="label">Password:</span> {cred.password}
                </p>
              </div>
            ))}
          </div>
        )}

        <p>
          Don&apos;t have an account?
          <button onClick={() => navigate("/signup")}>Sign Up</button>
        </p>
      </div>
    </div>
  );
};

export default Login;
