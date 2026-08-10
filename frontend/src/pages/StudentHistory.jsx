import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useParams, Link, useNavigate } from 'react-router-dom';

const StudentHistory = () => {
    const { id } = useParams(); // URL se student ki table ID nikalenge
    const navigate = useNavigate();
    
    const [studentData, setStudentData] = useState(null);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const adminUser = localStorage.getItem("adminUser");
        if (!adminUser) {
            navigate("/admin-login");
        } else {
            fetchStudentHistory();
        }
    }, [id, navigate]);

    const fetchStudentHistory = async () => {
        try {
            const res = await axios.get(`http://127.0.0.1:8000/api/students/${id}/history/`);
            if (res.data.success) {
                setStudentData(res.data.student);
                setHistory(res.data.history);
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to load student history.");
            navigate("/admin/students");
        } finally {
            setLoading(false);
        }
    };

    // Mobile masking logic (e.g., 1234******)
    const maskMobile = (mobileStr) => {
        if (!mobileStr) return "";
        const str = String(mobileStr);
        return str.length > 4 ? str.substring(0, 4) + "******" : str;
    };

    if (loading) {
        return (
            <div className="bg-light min-vh-100 d-flex justify-content-center align-items-center">
                <div className="spinner-border text-primary" role="status"></div>
            </div>
        );
    }

    return (
        <div className="bg-light min-vh-100 py-5">
            <div className="container px-4 px-lg-5">
                
                {/* Header Section */}
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-start mb-4 gap-3">
                    <div>
                        <h2 className="fw-bold text-dark fs-3 mb-2">
                            <span className="text-primary">#{studentData?.student_id}</span> Book Issued History
                        </h2>
                        <p className="text-muted small mb-0 fw-medium">
                            {studentData?.full_name} <span className="mx-2">•</span> 
                            {studentData?.email} <span className="mx-2">•</span> 
                            {maskMobile(studentData?.mobile)}
                        </p>
                    </div>
                    <div className="d-flex gap-2">
                        <Link to="/admin/students" className="btn btn-outline-secondary bg-white shadow-sm fw-medium btn-sm d-flex align-items-center gap-2 text-nowrap">
                            <i className="fa-solid fa-arrow-left"></i> Back to Students
                        </Link>
                        <Link to="/admin/manage-issued-books" className="btn btn-outline-primary bg-white shadow-sm fw-medium btn-sm d-flex align-items-center gap-2 text-nowrap">
                            <i className="fa-solid fa-list-ul"></i> Issued Books
                        </Link>
                    </div>
                </div>

                {/* Table Section */}
                <div className="card border-0 shadow-sm rounded-4">
                    <div className="card-body p-4 p-md-5">
                        <h5 className="fw-bold text-dark mb-4">{studentData?.student_id} Details</h5>
                        
                        <div className="table-responsive">
                            <table className="table align-middle table-borderless table-striped">
                                <thead>
                                    <tr className="border-bottom text-nowrap">
                                        <th className="text-dark fw-bold small pb-3">#</th>
                                        <th className="text-dark fw-bold small pb-3">Student ID</th>
                                        <th className="text-dark fw-bold small pb-3">Student Name</th>
                                        <th className="text-dark fw-bold small pb-3">Issued Book</th>
                                        <th className="text-dark fw-bold small pb-3">Issued Date</th>
                                        <th className="text-dark fw-bold small pb-3">Returned Date</th>
                                        <th className="text-dark fw-bold small pb-3">Fine (if any)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {history.length > 0 ? (
                                        history.map((item, index) => (
                                            <tr key={item.id} className="border-bottom">
                                                <td className="py-3 text-secondary">{index + 1}</td>
                                                <td className="py-3 text-dark fw-medium small">{studentData?.student_id}</td>
                                                <td className="py-3 text-secondary small">{studentData?.full_name}</td>
                                                <td className="py-3 text-dark fw-medium small">{item.book_name}</td>
                                                <td className="py-3 text-secondary small">
                                                    {new Date(item.issued_at).toLocaleString()}
                                                </td>
                                                <td className="py-3 text-secondary small">
                                                    {item.is_returned ? (
                                                        new Date(item.retuened_at).toLocaleString()
                                                    ) : (
                                                        <span className="text-danger small fw-medium">Not returned yet</span>
                                                    )}
                                                </td>
                                                <td className="py-3 text-secondary small">
                                                    {item.is_returned ? (
                                                        item.fine > 0 ? `₹ ${item.fine}` : "0"
                                                    ) : (
                                                        <span className="text-muted">Not returned yet</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="7" className="text-center py-5 text-muted">
                                                No book issue history found for this student.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
};

export default StudentHistory;