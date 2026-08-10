import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const AdminLogin = () => {
  // ============================
  // State Variables
  // ============================
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // ============================
  // Handle Form Submit
  // ============================
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const res = await axios.post(
        "https://library-management-system-0haj.onrender.com/api/admin-login/",
        {
          username,
          password,
        }
      );

      if (res.data.success) {
        toast.success(res.data.message || "Login Successful");

        // Save username in Local Storage
        localStorage.setItem(
          "adminUser",
          res.data.username || username
        );

        // Redirect
        navigate("/admin/dashboard");
      } else {
        toast.error(res.data.message || "Invalid Credentials");
      }
    } catch (err) {
      console.error(err);

      toast.error(
        err.response?.data?.message ||
          "Something went wrong!"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="container-fluid d-flex justify-content-center align-items-center"
      style={{
        minHeight: "100vh",
        background: "#f5f7fb",
      }}
    >
      <div
        className="text-center"
        style={{
          width: "100%",
          maxWidth: "600px",
        }}
      >
        {/* ============================
            Heading
        ============================ */}

        <h2 className="fw-bold mb-2">
          <i className="fa-solid fa-shield-halved text-primary me-2"></i>

          Admin Sign In
        </h2>

        <p className="text-muted mb-4">
          Use the admin account created via{" "}
          <span className="text-danger">
            createsuperuser
          </span>
        </p>

        {/* ============================
            Login Card
        ============================ */}

        <div
          className="card border-0 shadow rounded-4 p-4"
          style={{
            backgroundColor: "#fff",
          }}
        >
          <form onSubmit={handleSubmit}>
            {/* Username */}

            <div className="mb-3 text-start">
              <label className="form-label fw-semibold">
                Username
              </label>

              <div className="input-group">
                <span className="input-group-text bg-white">
                  <i className="fa-regular fa-user"></i>
                </span>

                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter admin username"
                  value={username}
                  onChange={(e) =>
                    setUserName(e.target.value)
                  }
                  required
                />
              </div>
            </div>

            {/* Password */}

            <div className="mb-4 text-start">
              <label className="form-label fw-semibold">
                Password
              </label>

              <div className="input-group">
                <span className="input-group-text bg-white">
                  <i className="fa-solid fa-key"></i>
                </span>

                <input
                  type="password"
                  className="form-control"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  required
                />
              </div>
            </div>

            {/* Login Button */}

            <button
              type="submit"
              className="btn btn-primary btn-lg w-100"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                  ></span>

                  Signing In...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-right-to-bracket me-2"></i>

                  Sign In
                </>
              )}
            </button>
          </form>
        </div>

        {/* Bottom Link */}

        <p className="mt-4 text-secondary">
          Not an admin?{" "}
          <Link
            to="/"
            className="text-decoration-none fw-semibold"
          >
            Go back to user area
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;