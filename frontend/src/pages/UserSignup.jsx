import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';

const UserSignup = () => {
    const navigate = useNavigate();

    // 1. STATE MANAGEMENT
    const [fullName, setFullName] = useState('');
    const [mobile, setMobile] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    // 2. FORM SUBMIT LOGIC
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation Rules
        if (!fullName || !mobile || !email || !password || !confirmPassword) {
            return toast.warning("Please fill all the fields.");
        }
        
        if (mobile.length !== 10) {
            return toast.warning("Mobile number must be 10 digits.");
        }

        if (password.length < 6) {
            return toast.warning("Password must be at least 6 characters long.");
        }

        if (password !== confirmPassword) {
            return toast.error("Passwords do not match!");
        }

        try {
            setLoading(true);
            
            // Backend API par data bhejna (keys Django model se match karni chahiye)
            const res = await axios.post("https://library-management-system-0haj.onrender.com/api/student/signup/", {
                full_name: fullName,
                mobile: mobile,
                email: email,
                password: password
            });

            if (res.data.success) {
                toast.success(res.data.message);
                // Signup successful hone ke baad user ko login page par bhej do
                navigate("/user-login"); 
            }
        } catch (error) {
            // Agar email pehle se exist karti hai to error dikhayenge
            console.error(error);
            toast.error("Registration failed. Email might already be in use.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-light min-vh-100 d-flex align-items-center py-5">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-12 col-md-8 col-lg-6 col-xl-5">
                        
                        <div className="card border-0 shadow-sm rounded-4">
                            <div className="card-body p-4 p-md-5">
                                
                                {/* Header Section */}
                                <div className="text-center mb-4">
                                    <h3 className="fw-bold text-primary d-flex align-items-center justify-content-center gap-2">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M15 7a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm-2 4a5 5 0 0 0-5 5v2h10v-2a5 5 0 0 0-5-5z"></path>
                                            <path d="M19 8h-2v2h-2V8h-2V6h2V4h2v2h2v2z"></path>
                                        </svg>
                                        User Signup
                                    </h3>
                                    <p className="text-muted small">
                                        Create your library account to issue and manage books.
                                    </p>
                                </div>

                                {/* Signup Form */}
                                <form onSubmit={handleSubmit}>
                                    
                                    <div className="mb-3">
                                        <label className="form-label small text-secondary fw-medium">Full Name</label>
                                        <input 
                                            type="text" 
                                            className="form-control" 
                                            placeholder="Enter your full name" 
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label small text-secondary fw-medium">Mobile Number</label>
                                        <input 
                                            type="number" 
                                            className="form-control" 
                                            placeholder="10-digit mobile number" 
                                            value={mobile}
                                            onChange={(e) => setMobile(e.target.value)}
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label small text-secondary fw-medium">Email</label>
                                        <input 
                                            type="email" 
                                            className="form-control" 
                                            placeholder="Enter your email" 
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label small text-secondary fw-medium">Password <span className="text-muted" style={{fontSize: "0.75rem"}}>(min 6 characters)</span></label>
                                        <input 
                                            type="password" 
                                            className="form-control" 
                                            placeholder="Enter password" 
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label className="form-label small text-secondary fw-medium">Confirm Password</label>
                                        <input 
                                            type="password" 
                                            className="form-control" 
                                            placeholder="Re-enter password" 
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                        />
                                    </div>

                                    <button 
                                        type="submit" 
                                        className="btn btn-primary w-100 fw-medium py-2 d-flex align-items-center justify-content-center gap-2"
                                        disabled={loading}
                                    >
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>
                                        {loading ? "Registering..." : "Register Now"}
                                    </button>

                                </form>

                                <div className="text-center mt-4">
                                    <p className="small text-muted mb-0">
                                        Already registered? <Link to="/user-login" className="text-decoration-none">Login here.</Link>
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

export default UserSignup;