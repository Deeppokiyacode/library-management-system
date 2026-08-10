import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const StudentIssuedBooks = () => {
    const navigate = useNavigate();
    
    const [issuedBooks, setIssuedBooks] = useState([]);
    const [loading, setLoading] = useState(true);

    // Derived States (Frontend Calculation)
    const totalIssued = issuedBooks.length;
    const notReturnedYet = issuedBooks.filter(book => !book.is_returned).length;
    const totalFine = issuedBooks.reduce((sum, book) => sum + (book.fine || 0), 0);

    useEffect(() => {
        const storedUser = localStorage.getItem("studentUser");
        if (!storedUser) {
            navigate("/user-login");
        } else {
            const parsedUser = JSON.parse(storedUser);
            fetchMyBooks(parsedUser.student_id);
        }
    }, [navigate]);

    const fetchMyBooks = async (studentId) => {
        try {
            const res = await axios.get(`https://library-management-system-0haj.onrender.com/api/user/my-issued-books/${studentId}/`);
            if (res.data.success) {
                setIssuedBooks(res.data.data);
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to load your issued books.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-light min-vh-100 py-5">
            <div className="container px-4 px-lg-5">
                
                {/* Header Section */}
                <div className="d-flex align-items-center gap-3 mb-5">
                    <div className="text-dark mt-1">
                        <i className="fa-solid fa-book-journal-whills fs-2"></i>
                    </div>
                    <div>
                        <h2 className="fw-bold text-dark fs-4 mb-1">My Issued Books</h2>
                        <p className="text-muted small mb-0">
                            Track all books you have issued from the library along with return status and fines.
                        </p>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="row g-4 mb-5">
                    <div className="col-lg-4 col-md-6">
                        <div className="card border-0 shadow-sm rounded-4 h-100 p-4 d-flex flex-row justify-content-between align-items-center">
                            <div>
                                <h6 className="text-muted fw-bold mb-2 text-uppercase" style={{fontSize: '0.75rem', letterSpacing: '1px'}}>Total Issued</h6>
                                <h2 className="fw-bold text-dark mb-0">{totalIssued}</h2>
                            </div>
                            <div className="bg-primary bg-opacity-10 text-primary rounded-3 d-flex align-items-center justify-content-center" style={{width: '50px', height: '50px'}}>
                                <i className="fa-solid fa-book-open fs-5"></i>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-4 col-md-6">
                        <div className="card border-0 shadow-sm rounded-4 h-100 p-4 d-flex flex-row justify-content-between align-items-center">
                            <div>
                                <h6 className="text-warning fw-bold mb-2 text-uppercase" style={{fontSize: '0.75rem', letterSpacing: '1px'}}>Not Returned Yet</h6>
                                <h2 className="fw-bold text-warning mb-0">{notReturnedYet}</h2>
                            </div>
                            <div className="bg-warning bg-opacity-10 text-warning rounded-3 d-flex align-items-center justify-content-center" style={{width: '50px', height: '50px'}}>
                                <i className="fa-solid fa-clock-rotate-left fs-5"></i>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-4 col-md-6">
                        <div className="card border-0 shadow-sm rounded-4 h-100 p-4 d-flex flex-row justify-content-between align-items-center">
                            <div>
                                <h6 className="text-danger fw-bold mb-2 text-uppercase" style={{fontSize: '0.75rem', letterSpacing: '1px'}}>Total Fine (₹)</h6>
                                <h2 className="fw-bold text-danger mb-0">₹ {totalFine}</h2>
                            </div>
                            <div className="bg-danger bg-opacity-10 text-danger rounded-3 d-flex align-items-center justify-content-center" style={{width: '50px', height: '50px'}}>
                                <i className="fa-solid fa-indian-rupee-sign fs-5"></i>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Table Section */}
                <div className="card border-0 shadow-sm rounded-4">
                    <div className="card-body p-4">
                        {loading ? (
                            <div className="text-center py-5">
                                <div className="spinner-border text-primary" role="status"></div>
                                <p className="mt-2 text-muted">Loading your books...</p>
                            </div>
                        ) : (
                            <div className="table-responsive">
                                <table className="table align-middle table-borderless table-striped">
                                    <thead>
                                        <tr className="border-bottom text-nowrap">
                                            <th className="text-dark fw-bold small pb-3">#</th>
                                            <th className="text-dark fw-bold small pb-3">Book Name</th>
                                            <th className="text-dark fw-bold small pb-3">ISBN</th>
                                            <th className="text-dark fw-bold small pb-3">Issued Date</th>
                                            <th className="text-dark fw-bold small pb-3">Return Date</th>
                                            <th className="text-dark fw-bold small pb-3">Fine (₹)</th>
                                            <th className="text-dark fw-bold small pb-3">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {issuedBooks.length > 0 ? (
                                            issuedBooks.map((item, index) => (
                                                <tr key={item.id} className="border-bottom">
                                                    <td className="py-3 text-secondary">{index + 1}</td>
                                                    <td className="py-3 text-dark fw-medium small">{item.book_name}</td>
                                                    <td className="py-3 text-secondary small">{item.isbn}</td>
                                                    <td className="py-3 text-secondary small">
                                                        {new Date(item.issued_at).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true })}
                                                    </td>
                                                    <td className="py-3 text-secondary small">
                                                        {item.is_returned ? (
                                                            new Date(item.retuened_at).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true })
                                                        ) : (
                                                            <span className="text-danger small fw-medium">Not returned yet</span>
                                                        )}
                                                    </td>
                                                    <td className="py-3 text-dark small fw-medium">
                                                        ₹ {item.fine || 0}
                                                    </td>
                                                    <td className="py-3">
                                                        {item.is_returned ? (
                                                            <span className="badge bg-success bg-opacity-10 text-success px-3 py-1 rounded-pill">
                                                                <i className="fa-solid fa-check me-1"></i> Returned
                                                            </span>
                                                        ) : (
                                                            <span className="badge bg-warning bg-opacity-10 text-warning px-3 py-1 rounded-pill">
                                                                <i className="fa-regular fa-clock me-1"></i> Pending
                                                            </span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="7" className="text-center py-5 text-muted">
                                                    You haven't issued any books yet.
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

export default StudentIssuedBooks;