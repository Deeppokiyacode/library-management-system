import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
    const navigate = useNavigate();

    const [studentId, setStudentId] = useState('');
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [mobile, setMobile] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem("studentUser");
        if (!storedUser) {
            navigate("/user-login");
        } else {
            const parsedUser = JSON.parse(storedUser);
            fetchProfileData(parsedUser.student_id);
        }
    }, [navigate]);

    const fetchProfileData = async (id) => {
        try {
            const res = await axios.get(`http://[https://library-management-system-0haj.onrender.com](https://library-management-system-0haj.onrender.com)/api/student/profile/${id}/`);
            if (res.data.success) {
                const data = res.data.student;
                setStudentId(data.student_id);
                setFullName(data.full_name);
                setEmail(data.email);
                setMobile(data.mobile);
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to load profile details.");
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        
        if (!fullName || !mobile) {
            return toast.warning("Name and Mobile Number cannot be empty.");
        }

        try {
            setLoading(true);
            const res = await axios.put(`http://[https://library-management-system-0haj.onrender.com](https://library-management-system-0haj.onrender.com)/api/student/profile/${studentId}/update/`, {
                full_name: fullName,
                mobile: mobile
            });

            if (res.data.success) {
                toast.success(res.data.message);
                
                // Update local storage so Header reflects the new name if needed
                const storedUser = JSON.parse(localStorage.getItem("studentUser"));
                storedUser.full_name = fullName;
                localStorage.setItem("studentUser", JSON.stringify(storedUser));
            }
        } catch (error) {
            console.error(error);
            toast.error("Error updating profile.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-light min-vh-100 py-5">
            <div className="container d-flex justify-content-center">
                <div className="col-12 col-md-8 col-lg-6">
                    
                    {/* Header Section */}
                    <div className="d-flex align-items-center mb-4 gap-3">
                        <div className="bg-success bg-opacity-10 text-success rounded-circle p-3 d-flex align-items-center justify-content-center">
                            <i className="fa-solid fa-user-graduate fs-4"></i>
                        </div>
                        <div>
                            <h2 className="fw-bold text-dark fs-4 mb-1">My Profile</h2>
                            <p className="text-muted small mb-0">
                                View and update your basic profile details.
                            </p>
                        </div>
                    </div>

                    {/* Profile Form Card */}
                    <div className="card border-0 shadow-sm rounded-4">
                        <div className="card-body p-4 p-md-5">
                            <form onSubmit={handleUpdate}>
                                
                                <div className="mb-4">
                                    <label className="form-label small fw-semibold text-secondary">Student ID</label>
                                    <input 
                                        type="text" 
                                        className="form-control bg-light text-muted border-0 py-2" 
                                        value={studentId}
                                        readOnly
                                        disabled
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="form-label small fw-semibold text-secondary">Full Name <span className="text-danger">*</span></label>
                                    <input 
                                        type="text" 
                                        className="form-control py-2" 
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="form-label small fw-semibold text-secondary">Email Address <span className="text-danger">*</span></label>
                                    <input 
                                        type="email" 
                                        className="form-control bg-light text-muted border-0 py-2" 
                                        value={email}
                                        readOnly
                                        disabled
                                    />
                                </div>

                                <div className="mb-5">
                                    <label className="form-label small fw-semibold text-secondary">Mobile Number <span className="text-danger">*</span></label>
                                    <input 
                                        type="number" 
                                        className="form-control py-2" 
                                        value={mobile}
                                        onChange={(e) => setMobile(e.target.value)}
                                    />
                                </div>

                                {/* Action Buttons */}
                                <div className="d-flex justify-content-end align-items-center gap-3">
                                    <button 
                                        type="button" 
                                        className="btn btn-outline-secondary fw-medium px-4 py-2 d-flex align-items-center gap-2"
                                        onClick={() => navigate(-1)}
                                    >
                                        <i className="fa-solid fa-arrow-left"></i> Back
                                    </button>
                                    <button 
                                        type="submit" 
                                        className="btn btn-success fw-medium px-4 py-2 d-flex align-items-center gap-2"
                                        disabled={loading}
                                    >
                                        <i className="fa-solid fa-floppy-disk"></i> {loading ? "Saving..." : "Save Changes"}
                                    </button>
                                </div>

                            </form>
                        </div>
                    </div>
                    
                    <p className="text-muted small mt-3">
                        Tip: Strong profile details help library staff identify you quickly.
                    </p>

                </div>
            </div>
        </div>
    );
};

export default UserProfile;