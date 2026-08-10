import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const adminUser = localStorage.getItem("adminUser");
        if (!adminUser) {
            navigate("/admin-login");
        } else {
            fetchStats();
        }
    }, [navigate]);

    const fetchStats = async () => {
        try {
            const res = await axios.get("http://127.0.0.1:8000/api/admin/dashboard-stats/");
            if (res.data.success) {
                setStats(res.data.stats);
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to load dashboard statistics.");
        } finally {
            setLoading(false);
        }
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
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div className="d-flex align-items-center gap-2">
                        <i className="fa-solid fa-gauge-high text-primary fs-3"></i>
                        <div>
                            <h2 className="fw-bold text-dark fs-4 mb-0">Admin Dashboard</h2>
                            <p className="text-muted small mb-0">Quick overview of students, books and issued records.</p>
                        </div>
                    </div>
                    <div>
                        <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill d-flex align-items-center gap-2">
                            <i className="fa-solid fa-shield-halved"></i> Admin Panel
                        </span>
                    </div>
                </div>

                {/* Dashboard Cards Row 1 */}
                <div className="row g-4 mb-4">
                    
                    {/* Total Students Card */}
                    <div className="col-lg-4 col-md-6">
                        <div className="card border-0 shadow-sm rounded-4 h-100 p-4">
                            <div className="d-flex align-items-start mb-3 gap-3">
                                <div className="bg-primary bg-opacity-10 text-primary rounded-circle p-2 d-flex align-items-center justify-content-center" style={{width: '45px', height: '45px'}}>
                                    <i className="fa-solid fa-user-graduate fs-5"></i>
                                </div>
                                <div>
                                    <h6 className="text-muted fw-bold mb-0 text-uppercase" style={{fontSize: '0.75rem', letterSpacing: '1px'}}>Total Students</h6>
                                    <h2 className="fw-bold text-dark mb-0 display-6">{stats?.students.total}</h2>
                                </div>
                            </div>
                            <div className="mt-auto pt-3 border-top">
                                <span className="text-success small fw-medium me-3">Active: {stats?.students.active}</span>
                                <span className="text-danger small fw-medium">Blocked: {stats?.students.blocked}</span>
                            </div>
                        </div>
                    </div>

                    {/* Total Books Card */}
                    <div className="col-lg-4 col-md-6">
                        <div className="card border-0 shadow-sm rounded-4 h-100 p-4">
                            <div className="d-flex align-items-start mb-3 gap-3">
                                <div className="bg-success bg-opacity-10 text-success rounded-circle p-2 d-flex align-items-center justify-content-center" style={{width: '45px', height: '45px'}}>
                                    <i className="fa-solid fa-book fs-5"></i>
                                </div>
                                <div>
                                    <h6 className="text-muted fw-bold mb-0 text-uppercase" style={{fontSize: '0.75rem', letterSpacing: '1px'}}>Total Books</h6>
                                    <h2 className="fw-bold text-dark mb-0 display-6">{stats?.books.total}</h2>
                                </div>
                            </div>
                            <div className="mt-auto pt-3 border-top">
                                <span className="text-success small fw-medium me-3">Available: {stats?.books.available}</span>
                                <span className="text-danger small fw-medium">Out of stock: {stats?.books.out_of_stock}</span>
                            </div>
                        </div>
                    </div>

                    {/* Issued Records Card */}
                    <div className="col-lg-4 col-md-6">
                        <div className="card border-0 shadow-sm rounded-4 h-100 p-4">
                            <div className="d-flex align-items-start mb-3 gap-3">
                                <div className="bg-warning bg-opacity-10 text-warning rounded-circle p-2 d-flex align-items-center justify-content-center" style={{width: '45px', height: '45px'}}>
                                    <i className="fa-solid fa-arrow-right-arrow-left fs-5"></i>
                                </div>
                                <div>
                                    <h6 className="text-muted fw-bold mb-0 text-uppercase" style={{fontSize: '0.75rem', letterSpacing: '1px'}}>Issued Records</h6>
                                    <h2 className="fw-bold text-dark mb-0 display-6">{stats?.issued.total}</h2>
                                </div>
                            </div>
                            <div className="mt-auto pt-3 border-top">
                                <span className="text-dark small fw-medium me-3">Currently issued: {stats?.issued.currently}</span>
                                <span className="text-secondary small fw-medium">Returned: {stats?.issued.returned}</span>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Dashboard Cards Row 2 */}
                <div className="row g-4">
                    
                    {/* Categories Card */}
                    <div className="col-lg-6 col-md-6">
                        <div className="card border-0 shadow-sm rounded-4 h-100 p-4">
                            <div className="d-flex align-items-center mb-2 gap-3">
                                <div className="bg-info bg-opacity-10 text-info rounded-circle p-2 d-flex align-items-center justify-content-center" style={{width: '45px', height: '45px'}}>
                                    <i className="fa-solid fa-layer-group fs-5"></i>
                                </div>
                                <div>
                                    <h6 className="text-muted fw-bold mb-0 text-uppercase" style={{fontSize: '0.75rem', letterSpacing: '1px'}}>Categories</h6>
                                    <h2 className="fw-bold text-dark mb-0 fs-2">{stats?.categories}</h2>
                                </div>
                            </div>
                            <p className="text-muted small mb-0 mt-2 ms-5 ps-2">Different genres / sections available.</p>
                        </div>
                    </div>

                    {/* Authors Card */}
                    <div className="col-lg-6 col-md-6">
                        <div className="card border-0 shadow-sm rounded-4 h-100 p-4">
                            <div className="d-flex align-items-center mb-2 gap-3">
                                <div className="bg-danger bg-opacity-10 text-danger rounded-circle p-2 d-flex align-items-center justify-content-center" style={{width: '45px', height: '45px'}}>
                                    <i className="fa-solid fa-user-pen fs-5"></i>
                                </div>
                                <div>
                                    <h6 className="text-muted fw-bold mb-0 text-uppercase" style={{fontSize: '0.75rem', letterSpacing: '1px'}}>Authors</h6>
                                    <h2 className="fw-bold text-dark mb-0 fs-2">{stats?.authors}</h2>
                                </div>
                            </div>
                            <p className="text-muted small mb-0 mt-2 ms-5 ps-2">Authors whose books are available in library.</p>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
};

export default AdminDashboard;