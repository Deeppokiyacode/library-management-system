import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useParams, Link, useNavigate } from 'react-router-dom';

const IssuedBookDetails = () => {
    const { id } = useParams(); // URL se ID nikalna
    const navigate = useNavigate();
    
    const [details, setDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [fineAmount, setFineAmount] = useState(0);
    const [returning, setReturning] = useState(false);

    useEffect(() => {
        const adminUser = localStorage.getItem("adminUser");
        if (!adminUser) {
            navigate("/admin-login");
        } else {
            fetchDetails();
        }
    }, [id, navigate]);

    const fetchDetails = async () => {
        try {
            const res = await axios.get(`https://library-management-system-0haj.onrender.com/api/issued-book/${id}/`);
            if (res.data.success) {
                setDetails(res.data.data);
                setFineAmount(res.data.data.fine || 0); // Agar pehle se fine hai to set karo
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch details.");
            navigate("/admin/manage-issued-books"); // Error aaye to wapas bhej do
        } finally {
            setLoading(false);
        }
    };

    const handleReturn = async (e) => {
        e.preventDefault();
        
        if (!window.confirm("Are you sure you want to mark this book as returned?")) return;

        try {
            setReturning(true);
            const res = await axios.post(`https://library-management-system-0haj.onrender.com/api/issued-book/${id}/return/`, {
                fine: fineAmount
            });

            if (res.data.success) {
                toast.success(res.data.message);
                fetchDetails(); // Data wapas fetch karo taaki UI update ho jaye
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to return book.");
        } finally {
            setReturning(false);
        }
    };

    if (loading) {
        return (
            <div className="bg-light min-vh-100 d-flex justify-content-center align-items-center">
                <div className="spinner-border text-primary" role="status"></div>
            </div>
        );
    }

    if (!details) return null;

    return (
        <div className="bg-light min-vh-100 py-5">
            <div className="container px-4 px-lg-5">
                
                {/* Header with Back Button */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h2 className="fw-bold text-dark fs-4 mb-0">Issued Book Details</h2>
                    </div>
                    <div>
                        <Link to="/admin/manage-issued-books" className="btn btn-outline-secondary bg-white shadow-sm fw-medium btn-sm d-flex align-items-center gap-2">
                            <i className="fa-solid fa-arrow-left"></i> Back to List
                        </Link>
                    </div>
                </div>

                <div className="row g-4">
                    {/* Left Column: Student Details */}
                    <div className="col-lg-6">
                        <div className="card border-0 shadow-sm rounded-4 h-100">
                            <div className="card-body p-4 p-md-5">
                                <h5 className="fw-bold mb-4 text-dark border-bottom pb-3">Student Details</h5>
                                
                                <div className="mb-3">
                                    <span className="text-secondary fw-semibold">Student ID : </span> 
                                    <span className="text-dark fw-medium">{details.student_id}</span>
                                </div>
                                <div className="mb-3">
                                    <span className="text-secondary fw-semibold">Student Name : </span> 
                                    <span className="text-dark fw-medium">{details.student_name}</span>
                                </div>
                                <div className="mb-3">
                                    <span className="text-secondary fw-semibold">Fine : </span> 
                                    <span className="text-dark fw-medium">
                                        {details.is_returned 
                                            ? `₹ ${details.fine}` 
                                            : "No fine recorded yet"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Book Details */}
                    <div className="col-lg-6">
                        <div className="card border-0 shadow-sm rounded-4 h-100">
                            <div className="card-body p-4 p-md-5">
                                <h5 className="fw-bold mb-4 text-dark border-bottom pb-3">Book Details</h5>
                                
                                <div className="d-flex gap-4 mb-4">
                                    {details.cover_image ? (
                                        <img src={`https://library-management-system-0haj.onrender.com${details.cover_image}`} alt="cover" className="rounded shadow-sm" style={{width: '80px', height: '110px', objectFit: 'cover'}} />
                                    ) : (
                                        <div className="bg-secondary rounded d-flex justify-content-center align-items-center text-white" style={{width: '80px', height: '110px'}}>
                                            <i className="fa-solid fa-book fs-3"></i>
                                        </div>
                                    )}
                                </div>

                                <div className="mb-2">
                                    <span className="text-secondary fw-semibold">Book Name : </span> 
                                    <span className="text-dark fw-medium">{details.book_name}</span>
                                </div>
                                <div className="mb-2">
                                    <span className="text-secondary fw-semibold">ISBN : </span> 
                                    <span className="text-dark fw-medium">{details.isbn}</span>
                                </div>
                                <div className="mb-2">
                                    <span className="text-secondary fw-semibold">Issued Date : </span> 
                                    <span className="text-dark fw-medium">{new Date(details.issued_at).toLocaleString()}</span>
                                </div>
                                <div className="mb-2">
                                    <span className="text-secondary fw-semibold">Returned Date : </span> 
                                    <span className="text-dark fw-medium">
                                        {details.is_returned ? new Date(details.returned_at).toLocaleString() : "Not Returned Yet"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Column: Return / Fine Form (Only if NOT returned) */}
                    {!details.is_returned && (
                        <div className="col-12 mt-4">
                            <div className="card border-0 shadow-sm rounded-4">
                                <div className="card-body p-4 p-md-5">
                                    <h5 className="fw-bold mb-4 text-dark border-bottom pb-3">Return / Fine</h5>
                                    
                                    <form onSubmit={handleReturn} className="row align-items-end g-3">
                                        <div className="col-md-6">
                                            <label className="form-label small fw-semibold text-secondary">Fine (₹)</label>
                                            <input 
                                                type="number" 
                                                min="0"
                                                className="form-control py-2" 
                                                placeholder="Enter fine amount, e.g. 0 or 10" 
                                                value={fineAmount}
                                                onChange={(e) => setFineAmount(e.target.value)}
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <button 
                                                type="submit" 
                                                className="btn btn-primary fw-medium px-4 py-2 d-flex align-items-center gap-2"
                                                disabled={returning}
                                            >
                                                <i className="fa-solid fa-rotate-left"></i> {returning ? "Processing..." : "Return Book"}
                                            </button>
                                        </div>
                                    </form>

                                </div>
                            </div>
                        </div>
                    )}
                    
                    {/* Status Message if already returned */}
                    {details.is_returned && (
                        <div className="col-12 mt-4">
                            <div className="alert alert-success d-flex align-items-center rounded-4 shadow-sm" role="alert">
                                <i className="fa-solid fa-circle-check fs-4 me-3"></i>
                                <div>
                                    This book has been successfully returned and recorded in the system.
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default IssuedBookDetails;