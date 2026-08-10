import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Local Storage se dono users ka data check kar rahe hain
  const adminUser = localStorage.getItem("adminUser");
  const studentUser = localStorage.getItem("studentUser");

  // Admin Logout Logic
  const handleAdminLogout = () => {
    localStorage.removeItem("adminUser");
    navigate("/admin-login");
  };

  // Student Logout Logic
  const handleUserLogout = () => {
    localStorage.removeItem("studentUser");
    navigate("/user-login");
  };

  const isActive = (path) =>
    location.pathname === path ? "active text-primary fw-bold" : "";

  return (
    <nav
      className="navbar navbar-expand-lg navbar-light bg-white shadow-sm"
      style={{ borderBottom: "1px solid #ddd" }}
    >
      <div className="container">
        {/* Logo */}
        <Link className="navbar-brand fw-bold d-flex align-items-center" to="{}">
          <i className="fa-solid fa-book-open text-primary fs-3"></i>
          <span className="ms-2">Smart Library</span>
        </Link>

        <button
          className="navbar-toggler"
          data-bs-toggle="collapse"
          data-bs-target="#navbarMenu"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarMenu">
          
          {/* ===================== PUBLIC MENU (Jab koi login na ho) ===================== */}
          {!adminUser && !studentUser && (
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link to="/" className={`nav-link ${isActive("/")}`}>
                  <i className="fa-solid fa-house me-2"></i>
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/user-login" className={`nav-link ${isActive("/user-login")}`}>
                  <i className="fa-solid fa-user me-2"></i>
                  User Login
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/user-signup" className={`nav-link ${isActive("/user-signup")}`}>
                  <i className="fa-solid fa-user-plus me-2"></i>
                  User Signup
                </Link>
              </li>
              <li className="nav-item ms-lg-3">
                <Link to="/admin-login" className="btn btn-primary">
                  <i className="fa-solid fa-shield-halved me-2"></i>
                  Admin Login
                </Link>
              </li>
            </ul>
          )}

          {/* ===================== STUDENT / USER MENU ===================== */}
          {studentUser && (
            <ul className="navbar-nav ms-auto align-items-lg-center">
              <li className="nav-item">
                <Link to="/user/dashboard" className={`nav-link ${isActive("/user/dashboard")}`}>
                  <i className="fa-solid fa-gauge me-2"></i>
                  Dashboard
                </Link>
              </li>
              
              <li className="nav-item">
                <Link to="/user/my-library" className={`nav-link ${isActive("/user/my-library")}`}>
                  <i className="fa-solid fa-book-reader me-2"></i>
                  My Library
                </Link>
              </li>

              <li className="nav-item">
                <Link to="/user/issued-books" className={`nav-link ${isActive("/user/issued-books")}`}>
                  <i className="fa-solid fa-book-journal-whills me-2"></i>
                  Issued Books
                </Link>
              </li>

              {/* My Account Dropdown */}
              <li className="nav-item dropdown">
                <a
                  href="/#"
                  className="nav-link dropdown-toggle fw-bold"
                  data-bs-toggle="dropdown"
                >
                  <i className="fa-solid fa-circle-user me-2"></i>
                  My Account
                </a>
                <ul className="dropdown-menu dropdown-menu-end shadow-sm border-0 mt-2">
                  <li>
                    <Link to="/user/profile" className="dropdown-item py-2">
                      <i className="fa-solid fa-id-badge me-2 text-secondary"></i> Profile
                    </Link>
                  </li>
                  <li>
                    <Link to="/user/change-password" className="dropdown-item py-2">
                      <i className="fa-solid fa-key me-2 text-secondary"></i> Change Password
                    </Link>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button className="dropdown-item text-danger py-2" onClick={handleUserLogout}>
                      <i className="fa-solid fa-right-from-bracket me-2"></i> Logout
                    </button>
                  </li>
                </ul>
              </li>
            </ul>
          )}

          {/* ===================== ADMIN MENU ===================== */}
          {adminUser && (
            <ul className="navbar-nav ms-auto align-items-lg-center">
              {/* Dashboard */}
              <li className="nav-item">
                <Link to="/admin/dashboard" className={`nav-link ${isActive("/admin/dashboard")}`}>
                  <i className="fa-solid fa-gauge me-2"></i>
                  Dashboard
                </Link>
              </li>

              {/* Categories Dropdown */}
              <li className="nav-item dropdown">
                <a href="/#" className="nav-link dropdown-toggle" data-bs-toggle="dropdown">
                  <i className="fa-solid fa-layer-group me-2"></i>
                  Categories
                </a>
                <ul className="dropdown-menu">
                  <li><Link to="/admin/category-add" className="dropdown-item">Add Category</Link></li>
                  <li><Link to="/admin/category-manage" className="dropdown-item">Manage Categories</Link></li>
                </ul>
              </li>

              {/* Authors Dropdown */}
              <li className="nav-item dropdown">
                <a href="/#" className="nav-link dropdown-toggle" data-bs-toggle="dropdown">
                  <i className="fa-solid fa-users me-2"></i>
                  Authors
                </a>
                <ul className="dropdown-menu">
                  <li><Link to="/admin/author-add" className="dropdown-item">Add Author</Link></li>
                  <li><Link to="/admin/author-manage" className="dropdown-item">Manage Authors</Link></li>
                </ul>
              </li>

              {/* Books Dropdown */}
              <li className="nav-item dropdown">
                <a href="/#" className="nav-link dropdown-toggle" data-bs-toggle="dropdown">
                  <i className="fa-solid fa-book me-2"></i>
                  Books
                </a>
                <ul className="dropdown-menu">
                  <li><Link to="/admin/book-add" className="dropdown-item">Add Book</Link></li>
                  <li><Link to="/admin/book-manage" className="dropdown-item">Manage Books</Link></li>
                </ul>
              </li>

              {/* Issue Book */}
              <li className="nav-item">
                <Link to="/admin/issue-book" className={`nav-link ${isActive("/admin/issue-book")}`}>
                  <i className="fa-solid fa-right-left me-2"></i>
                  Issue Book
                </Link>
              </li>

              {/* Students */}
              <li className="nav-item">
                <Link to="/admin/students" className={`nav-link ${isActive("/admin/students")}`}>
                  <i className="fa-solid fa-user-graduate me-2"></i>
                  Students
                </Link>
              </li>

              {/* Change Password */}
              <li className="nav-item">
                <Link to="/admin/change-password" className={`nav-link ${isActive("/admin/change-password")}`}>
                  <i className="fa-solid fa-key me-2"></i>
                  Change Password
                </Link>
              </li>

              {/* Admin Icon */}
              <li className="nav-item">
                <span className="nav-link fw-bold text-primary">
                  <i className="fa-solid fa-user-shield me-2"></i>
                  Admin
                </span>
              </li>

              {/* Logout */}
              <li className="nav-item ms-2">
                <button className="btn btn-outline-danger" onClick={handleAdminLogout}>
                  <i className="fa-solid fa-right-from-bracket me-2"></i>
                  Logout
                </button>
              </li>
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;