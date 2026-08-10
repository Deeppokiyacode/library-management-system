import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';

const UserLogin = () => {
    const navigate = useNavigate();

    // State Variables
    const [loginId, setLoginId] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!loginId || !password) {
            return toast.warning("Please enter both login ID and password.");
        }

        try {
            setLoading(true);
            
            // Backend par request bhejna
            const res = await axios.post("http://[https://library-management-system-0haj.onrender.com](https://library-management-system-0haj.onrender.com)/api/student/login/", {
                login_id: loginId,
                password: password
            });

            if (res.data.success) {
                toast.success(res.data.message);
                
                // IMPORTANT: Login ke baad student ka data browser me save karna
                // Isse baad me Navbar (Dashboard, Logout dropdown) me data dikhane me madad milegi
                localStorage.setItem("studentUser", JSON.stringify(res.data.student));
                
                // Login hone ke baad user dashboard par bhej do
                navigate("/user/dashboard");
            }
        } catch (error) {
            if (error.response && error.response.data) {
                toast.error(error.response.data.message);
            } else {
                toast.error("Something went wrong!");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-light min-vh-100 d-flex align-items-center py-5">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-12 col-md-8 col-lg-6 col-xl-5">
                        
                        {/* Header Section */}
                        <div className="text-center mb-4">
                            <h3 className="fw-bold text-primary d-flex align-items-center justify-content-center gap-2">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"></path>
                                </svg>
                                User Login
                            </h3>
                            <p className="text-muted small">
                                Please enter your login credentials to access your account.
                            </p>
                        </div>

                        {/* Login Form Card */}
                        <div className="card border-0 shadow-sm rounded-4">
                            <div className="card-body p-4 p-md-5">
                                <form onSubmit={handleSubmit}>
                                    
                                    <div className="mb-4">
                                        <label className="form-label small text-secondary fw-medium">Email or Student ID</label>
                                        <input 
                                            type="text" 
                                            className="form-control py-2" 
                                            placeholder="Enter email or student ID" 
                                            value={loginId}
                                            onChange={(e) => setLoginId(e.target.value)}
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label className="form-label small text-secondary fw-medium">Password</label>
                                        <input 
                                            type="password" 
                                            className="form-control py-2" 
                                            placeholder="Enter password" 
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                    </div>

                                    <button 
                                        type="submit" 
                                        className="btn btn-primary w-100 fw-medium py-2 d-flex align-items-center justify-content-center gap-2"
                                        disabled={loading}
                                    >
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" y1="12" x2="3" y2="12"></line></svg>
                                        {loading ? "Logging in..." : "Login"}
                                    </button>

                                </form>

                                <div className="text-center mt-4">
                                    <p className="small text-muted mb-0">
                                        New here ? <Link to="/user-signup" className="text-decoration-none">Register now</Link>
                                    </p>
                                </div>

                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserLogin;