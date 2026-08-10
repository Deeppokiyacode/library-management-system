import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const UserChangePassword = () => {
    const navigate = useNavigate();

    // States
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    
    // User details store karne ke liye state
    const [studentData, setStudentData] = useState({ student_id: '', full_name: '' });

    useEffect(() => {
        // Page load hote hi local storage se student ka data nikalna
        const storedUser = localStorage.getItem("studentUser");
        if (!storedUser) {
            navigate("/user-login");
        } else {
            setStudentData(JSON.parse(storedUser));
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validations
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
            const res = await axios.post("https://library-management-system-0haj.onrender.com/api/student/change-password/", {
                student_id: studentData.student_id,
                old_password: currentPassword,
                new_password: newPassword
            });

            if (res.data.success) {
                toast.success(res.data.message);
                // Fields ko reset kar dena
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
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
        <div className="bg-light min-vh-100 py-5">
            <div className="container">
                
                {/* Header Section with Welcome Text */}
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-5 gap-3">
                    <div className="d-flex align-items-center gap-3">
                        <div className="text-primary">
                            <i className="fa-solid fa-key fs-1"></i>
                        </div>
                        <div>
                            <h2 className="fw-bold text-dark fs-3 mb-1">Change Password</h2>
                            <p className="text-muted small mb-0">
                                Change your account password.
                            </p>
                        </div>
                    </div>
                    <div>
                        <span className="text-muted small">Welcome <strong>{studentData.full_name}</strong></span>
                    </div>
                </div>

                {/* Form Section */}
                <div className="row justify-content-center mt-4">
                    <div className="col-12 col-md-8 col-lg-6">
                        <div className="card border-0 shadow-sm rounded-4">
                            <div className="card-body p-4 p-md-5">
                                <form onSubmit={handleSubmit}>
                                    
                                    <div className="mb-4">
                                        <label className="form-label small fw-semibold text-secondary">Current Password</label>
                                        <input 
                                            type="password" 
                                            className="form-control py-2" 
                                            value={currentPassword}
                                            onChange={(e) => setCurrentPassword(e.target.value)}
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label className="form-label small fw-semibold text-secondary">New Password</label>
                                        <input 
                                            type="password" 
                                            className="form-control py-2" 
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label className="form-label small fw-semibold text-secondary">Confirm New Password</label>
                                        <input 
                                            type="password" 
                                            className="form-control py-2" 
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                        />
                                    </div>

                                    <button 
                                        type="submit" 
                                        className="btn btn-primary w-100 fw-medium py-2 mt-2 d-flex justify-content-center align-items-center gap-2"
                                        disabled={loading}
                                    >
                                        <i className="fa-solid fa-key"></i> {loading ? "Updating..." : "Update Password"}
                                    </button>

                                </form>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default UserChangePassword;