import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate, Link } from 'react-router-dom';

const ChangePassword = () => {
    const navigate = useNavigate();

    // 1. STATE MANAGEMENT: Ye variables hamara data hold karenge
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    
    // Eye icon ke liye states: Toggles visibility
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    
    const [loading, setLoading] = useState(false);
    const [username, setUsername] = useState("");

    // 2. CHECK LOGIN: Component load hote hi check karo admin logged in hai ya nahi
    useEffect(() => {
        // App jab login hoti hai to hume username localStorage me save kar lena chahiye.
        const storedUser = localStorage.getItem("adminUser"); 
        if (!storedUser) {
            navigate("/admin-login");
        } else {
            setUsername(storedUser); // Backend ko bhejne ke liye username set kiya
        }
    }, [navigate]);

    // 3. FORM SUBMIT LOGIC: Jab 'Update Password' button click hoga
    const handleSubmit = async (e) => {
        e.preventDefault(); // Page refresh hone se roko

        // Basic Validation (Check karo ki user ne kachra to nahi bhara)
        if (!currentPassword || !newPassword || !confirmPassword) {
            return toast.warning("Please fill all fields.");
        }
        
        if (newPassword.length < 6) {
            return toast.warning("New password must be at least 6 characters.");
        }

        if (newPassword !== confirmPassword) {
            return toast.error("New password and confirm password do not match!");
        }

        try {
            setLoading(true);
            // Backend API ko call karna
            const res = await axios.post("https://library-management-system-0haj.onrender.com/api/admin/change-password/", {
                username: username,
                old_password: currentPassword,
                new_password: newPassword
            });

            if (res.data.success) {
                toast.success(res.data.message);
                // Success ke baad fields khali kar do
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
            }
        } catch (error) {
            // Agar backend se error aaya (jaise purana password galat hai)
            if (error.response && error.response.data) {
                toast.error(error.response.data.message);
            } else {
                toast.error("Something went wrong!");
            }
        } finally {
            setLoading(false); // Loading animation band karo
        }
    };

    // UI RENDERING: HTML/Bootstrap structure
    return (
        <div className="bg-light min-vh-100 py-5">
            <div className="container d-flex justify-content-center">
                <div className="col-12 col-md-8 col-lg-6">
                    
                    {/* Header Section */}
                    <div className="text-center mb-4">
                        <div className="d-inline-flex align-items-center justify-content-center bg-primary bg-opacity-10 text-primary rounded-circle p-3 mb-3">
                            {/* Key Icon */}
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path>
                            </svg>
                        </div>
                        <h2 className="fw-bold text-dark fs-4">Admin Change Password</h2>
                        <p className="text-muted small px-3">
                            Update your admin panel password securely. You'll use the new password next time you login.
                        </p>
                    </div>

                    {/* Card Form */}
                    <div className="card border-0 shadow-sm rounded-4">
                        <div className="card-body p-4 p-md-5">
                            <form onSubmit={handleSubmit}>
                                
                                {/* Current Password Field */}
                                <div className="mb-4">
                                    <label className="form-label small fw-semibold text-secondary">Current Password <span className="text-danger">*</span></label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-white text-muted border-end-0">
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                                        </span>
                                        <input 
                                            type={showCurrent ? "text" : "password"} 
                                            className="form-control border-start-0 border-end-0 px-0" 
                                            placeholder="Enter current password"
                                            value={currentPassword}
                                            onChange={(e) => setCurrentPassword(e.target.value)}
                                        />
                                        <button type="button" className="input-group-text bg-white text-muted border-start-0" onClick={() => setShowCurrent(!showCurrent)}>
                                            {/* Eye Toggle Icon Logic */}
                                            {showCurrent ? (
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                                            ) : (
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* New Password Field */}
                                <div className="mb-4">
                                    <label className="form-label small fw-semibold text-secondary">New Password <span className="text-danger">*</span></label>
                                    <div className="input-group mb-1">
                                        <span className="input-group-text bg-white text-muted border-end-0">
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path></svg>
                                        </span>
                                        <input 
                                            type={showNew ? "text" : "password"} 
                                            className="form-control border-start-0 border-end-0 px-0" 
                                            placeholder="Enter new password (min 6 chars)"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                        />
                                        <button type="button" className="input-group-text bg-white text-muted border-start-0" onClick={() => setShowNew(!showNew)}>
                                            {showNew ? (
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                                            ) : (
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                                            )}
                                        </button>
                                    </div>
                                    <div className="form-text small">Use a strong password with letters, numbers and symbols.</div>
                                </div>

                                {/* Confirm New Password Field */}
                                <div className="mb-4">
                                    <label className="form-label small fw-semibold text-secondary">Confirm New Password <span className="text-danger">*</span></label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-white text-muted border-end-0">
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path></svg>
                                        </span>
                                        <input 
                                            type={showConfirm ? "text" : "password"} 
                                            className="form-control border-start-0 border-end-0 px-0" 
                                            placeholder="Re-enter new password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                        />
                                        <button type="button" className="input-group-text bg-white text-muted border-start-0" onClick={() => setShowConfirm(!showConfirm)}>
                                            {showConfirm ? (
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                                            ) : (
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="d-flex justify-content-between align-items-center mt-5">
                                    <Link to="/admin/dashboard" className="text-decoration-none text-dark fw-medium small d-flex align-items-center gap-1">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                                        Back to Dashboard
                                    </Link>
                                    <button 
                                        type="submit" 
                                        className="btn btn-primary fw-medium px-4 py-2"
                                        disabled={loading}
                                    >
                                        {loading ? "Updating..." : "Update Password"}
                                    </button>
                                </div>

                            </form>
                        </div>
                    </div>
                    
                    <p className="text-center text-muted small mt-4">
                        Note: After changing your password, you'll need to use the new password on the next login.
                    </p>

                </div>
            </div>
        </div>
    );
};

export default ChangePassword;