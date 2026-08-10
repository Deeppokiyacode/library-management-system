import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function StudentDashboard() {
    const navigate = useNavigate();
    
    // States for data and loading
    const [stats, setStats] = useState({
        totalBooks: 0,
        pendingReturns: 0,
        totalIssued: 0
    });
    const [loading, setLoading] = useState(false);
    const [studentData, setStudentData] = useState(null);

    // Component load hote hi data fetch karna
    useEffect(() => {
        const storedUser = localStorage.getItem("studentUser");
        if (!storedUser) {
            navigate("/user-login"); // Agar login nahi hai to wapas bhej do
        } else {
            const parsedUser = JSON.parse(storedUser);
            setStudentData(parsedUser);
            fetchDashboardStats(parsedUser.student_id);
        }
    }, [navigate]);

    const fetchDashboardStats = async (studentId) => {
        try {
            setLoading(true);
            const res = await axios.get(`http://[https://library-management-system-0haj.onrender.com](https://library-management-system-0haj.onrender.com)/api/student/dashboard-stats/${studentId}/`);
            if (res.data.success) {
                setStats({
                    totalBooks: res.data.total_books,
                    pendingReturns: res.data.pending_returns,
                    totalIssued: res.data.total_issued
                });
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to load dashboard stats.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-light min-vh-100 py-5">
            <div className="container px-4 px-lg-5">
                
                {/* Header Section */}
                <div className="d-flex justify-content-between align-items-center mb-5">
                    <div>
                        <h2 className="fw-bold text-dark fs-3 mb-1 d-flex align-items-center gap-2">
                            <i className="fa-solid fa-graduation-cap text-secondary"></i> 
                            My Library Dashboard
                        </h2>
                        <p className="text-muted small mb-0">
                            Track your issued books, pending returns and explore all books in the library.
                        </p>
                    </div>
                    <div>
                        <button 
                            className="btn btn-outline-secondary bg-white shadow-sm fw-medium d-flex align-items-center gap-2"
                            onClick={() => fetchDashboardStats(studentData?.student_id)}
                            disabled={loading}
                        >
                            <i className={`fa-solid fa-rotate-right ${loading ? 'fa-spin' : ''}`}></i>
                            Refresh
                        </button>
                    </div>
                </div>

                {/* Data Cards Row */}
                <div className="row g-4 mb-5">
                    
                    {/* Total Books Card */}
                    <div className="col-lg-4 col-md-6">
                        <div className="card border-0 shadow-sm rounded-4 h-100 p-4">
                            <div className="d-flex justify-content-between align-items-start mb-3">
                                <h6 className="text-muted fw-bold mb-0 text-uppercase" style={{fontSize: '0.75rem', letterSpacing: '1px'}}>Total Books</h6>
                                <div className="bg-primary bg-opacity-10 text-primary rounded-circle p-2 d-flex align-items-center justify-content-center" style={{width: '35px', height: '35px'}}>
                                    <i className="fa-solid fa-layer-group"></i>
                                </div>
                            </div>
                            <h2 className="fw-bold text-dark mb-2 display-6">{stats.totalBooks}</h2>
                            <p className="text-muted small mb-4">All books currently available in the library catalogue.</p>
                            <div className="mt-auto">
                                <Link to="/user/my-library" className="text-decoration-none fw-medium small text-primary d-flex align-items-center gap-1 hover-underline">
                                    Browse books <i className="fa-solid fa-arrow-right"></i>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Pending Returns Card (Orange Variant) */}
                    <div className="col-lg-4 col-md-6">
                        {/* Using custom gradient inline style for the orange look from your image */}
                        <div className="card border-0 shadow-sm rounded-4 h-100 p-4 text-white" style={{ background: 'linear-gradient(135deg, #f6a033 0%, #ff7824 100%)' }}>
                            <div className="d-flex justify-content-between align-items-start mb-3">
                                <h6 className="text-white-50 fw-bold mb-0 text-uppercase" style={{fontSize: '0.75rem', letterSpacing: '1px'}}>Pending Returns</h6>
                                <div className="bg-white bg-opacity-25 text-white rounded-circle p-2 d-flex align-items-center justify-content-center" style={{width: '35px', height: '35px'}}>
                                    <i className="fa-solid fa-clock-rotate-left"></i>
                                </div>
                            </div>
                            <h2 className="fw-bold mb-2 display-6">{stats.pendingReturns}</h2>
                            <p className="text-white-50 small mb-4">Books you've issued but not returned yet. Please return on time to avoid fines.</p>
                        </div>
                    </div>

                    {/* Total Books Issued Card */}
                    <div className="col-lg-4 col-md-6">
                        <div className="card border-0 shadow-sm rounded-4 h-100 p-4">
                            <div className="d-flex justify-content-between align-items-start mb-3">
                                <h6 className="text-muted fw-bold mb-0 text-uppercase" style={{fontSize: '0.75rem', letterSpacing: '1px'}}>Total Books Issued</h6>
                                <div className="bg-success bg-opacity-10 text-success rounded-circle p-2 d-flex align-items-center justify-content-center" style={{width: '35px', height: '35px'}}>
                                    <i className="fa-solid fa-book-reader"></i>
                                </div>
                            </div>
                            <h2 className="fw-bold text-dark mb-2 display-6">{stats.totalIssued}</h2>
                            <p className="text-muted small mb-4">Count of all books ever issued on your student account.</p>
                            <div className="mt-auto">
                                <Link to="/user/issued-books" className="text-decoration-none fw-medium small text-success d-flex align-items-center gap-1">
                                    View issue history <i className="fa-solid fa-arrow-right"></i>
                                </Link>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Tip Section Box */}
                <div className="card border-0 shadow-sm rounded-4 bg-white p-4">
                    <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3">
                        <div className="d-flex gap-3">
                            <div className="mt-1 text-warning fs-4">
                                <i className="fa-regular fa-lightbulb"></i>
                            </div>
                            <div>
                                <h6 className="fw-bold text-dark mb-1">Tip</h6>
                                <p className="text-muted small mb-0">Regularly check your pending returns to avoid late fines and keep your library account in good standing.</p>
                            </div>
                        </div>
                        <div>
                            <Link to="/user/issued-books" className="btn btn-outline-secondary btn-sm bg-white fw-medium text-nowrap">
                                Go to issued books
                            </Link>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default StudentDashboard;