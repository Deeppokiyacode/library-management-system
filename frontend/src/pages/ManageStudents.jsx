import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';

const ManageStudents = () => {
    const navigate = useNavigate();
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Admin security check
        const adminUser = localStorage.getItem("adminUser");
        if (!adminUser) {
            navigate("/admin-login");
        } else {
            fetchStudents();
        }
    }, [navigate]);

    const fetchStudents = async () => {
        try {
            setLoading(true);
            const res = await axios.get("https://library-management-system-0haj.onrender.com/api/students/");
            setStudents(res.data);
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch students data");
        } finally {
            setLoading(false);
        }
    };

    // Active/Inactive toggle karne ka logic
    const handleToggleStatus = async (id) => {
        try {
            const res = await axios.put(`https://library-management-system-0haj.onrender.com/api/students/${id}/toggle-status/`);
            if (res.data.success) {
                toast.success(res.data.message);
                fetchStudents(); // Table ko refresh karne ke liye wapas call kiya
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to update status");
        }
    };

    // Mobile number mask karne ka logic (e.g. 1234******)
    const maskMobile = (mobileStr) => {
        if (!mobileStr) return "";
        const str = String(mobileStr);
        if (str.length > 4) {
            return str.substring(0, 4) + "******";
        }
        return str;
    };

    return (
        <div className="bg-light min-vh-100 py-5">
            <div className="container px-4 px-lg-5">
                
                {/* Header Section */}
                <div className="d-flex justify-content-between align-items-center mb-5">
                    <div className="d-flex align-items-start gap-3">
                        <div className="text-primary mt-1">
                            <i className="fa-solid fa-users-gear fs-2"></i>
                        </div>
                        <div>
                            <h2 className="fw-bold text-dark fs-4 mb-1">Manage Registered Students</h2>
                            <p className="text-muted small mb-0">
                                View all registered students, block/unblock them, and open their book issue history.
                            </p>
                        </div>
                    </div>
                    <div>
                        <Link to="/admin/issue-book" className="btn btn-outline-primary bg-white shadow-sm fw-medium d-flex align-items-center gap-2">
                            <i className="fa-solid fa-list-ul"></i> Issued Books
                        </Link>
                    </div>
                </div>

                {/* Table Section */}
                <div className="card border-0 shadow-sm rounded-4">
                    <div className="card-body p-4">
                        {loading ? (
                            <div className="text-center py-5">
                                <div className="spinner-border text-primary" role="status"></div>
                                <p className="mt-2 text-muted">Loading students...</p>
                            </div>
                        ) : (
                            <div className="table-responsive">
                                <table className="table align-middle table-borderless table-hover">
                                    <thead>
                                        <tr className="border-bottom">
                                            <th className="text-dark fw-bold small pb-3">#</th>
                                            <th className="text-dark fw-bold small pb-3">Student ID</th>
                                            <th className="text-dark fw-bold small pb-3">Student Name</th>
                                            <th className="text-dark fw-bold small pb-3">Email</th>
                                            <th className="text-dark fw-bold small pb-3">Mobile</th>
                                            <th className="text-dark fw-bold small pb-3">Reg Date</th>
                                            <th className="text-dark fw-bold small pb-3">Status</th>
                                            <th className="text-dark fw-bold small pb-3">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {students.length > 0 ? (
                                            students.map((student, index) => (
                                                <tr key={student.id} className="border-bottom">
                                                    <td className="py-3 text-secondary">{index + 1}</td>
                                                    <td className="py-3 text-dark fw-medium small">{student.student_id}</td>
                                                    <td className="py-3 text-secondary small">{student.full_name}</td>
                                                    <td className="py-3 text-secondary small">{student.email}</td>
                                                    <td className="py-3 text-secondary small">{maskMobile(student.mobile)}</td>
                                                    <td className="py-3 text-secondary small">
                                                        {new Date(student.created_at).toLocaleDateString()}
                                                    </td>
                                                    
                                                    {/* Status Badge */}
                                                    <td className="py-3">
                                                        {student.is_active ? (
                                                            <span className="badge bg-success bg-opacity-10 text-success px-2 py-1 border border-success border-opacity-25 rounded-pill">
                                                                Active
                                                            </span>
                                                        ) : (
                                                            <span className="badge bg-danger bg-opacity-10 text-danger px-2 py-1 border border-danger border-opacity-25 rounded-pill">
                                                                Blocked
                                                            </span>
                                                        )}
                                                    </td>
                                                    
                                                    {/* Action Buttons */}
                                                    <td className="py-3">
                                                        <div className="d-flex gap-2">
                                                            {/* Toggle Button */}
                                                            {student.is_active ? (
                                                                <button 
                                                                    className="btn btn-sm btn-outline-danger px-2 text-nowrap"
                                                                    onClick={() => handleToggleStatus(student.id)}
                                                                >
                                                                    Inactive
                                                                </button>
                                                            ) : (
                                                                <button 
                                                                    className="btn btn-sm btn-outline-primary px-2 text-nowrap"
                                                                    onClick={() => handleToggleStatus(student.id)}
                                                                >
                                                                    Active
                                                                </button>
                                                            )}
                                                            
                                                           
                                                            <Link 
                                                                to={`/admin/student-history/${student.id}`} 
                                                                className="btn btn-sm btn-success d-flex align-items-center gap-1 px-2 text-nowrap"
                                                            >
                                                                <i className="fa-solid fa-circle-info"></i> Details
                                                            </Link>
                                                                                                                    </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="8" className="text-center py-5 text-muted">
                                                    No registered students found.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ManageStudents;