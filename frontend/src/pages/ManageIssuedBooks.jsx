import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';

const ManageIssuedBooks = () => {
    const navigate = useNavigate();
    const [issuedBooks, setIssuedBooks] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const adminUser = localStorage.getItem("adminUser");
        if (!adminUser) {
            navigate("/admin-login");
        } else {
            fetchIssuedBooks();
        }
    }, [navigate]);

    const fetchIssuedBooks = async () => {
        try {
            setLoading(true);
            const res = await axios.get("http://127.0.0.1:8000/api/issued-books/");
            setIssuedBooks(res.data);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load issued books data");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-light min-vh-100 py-5">
            <div className="container px-4 px-lg-5">
                
                {/* Header Section */}
                <div className="d-flex justify-content-between align-items-center mb-5">
                    <div className="d-flex align-items-start gap-3">
                        <div className="text-primary mt-1">
                            <i className="fa-solid fa-list-check fs-2"></i>
                        </div>
                        <div>
                            <h2 className="fw-bold text-dark fs-4 mb-1">Manage Issued Books</h2>
                            <p className="text-muted small mb-0">
                                Track all issued books and update return/fine details.
                            </p>
                        </div>
                    </div>
                    <div>
                        <Link to="/admin/issue-book" className="btn btn-outline-primary bg-white shadow-sm fw-medium d-flex align-items-center gap-2">
                            <span className="fs-5 pb-1">+</span> Issue New Book
                        </Link>
                    </div>
                </div>

                {/* Table Section */}
                <div className="card border-0 shadow-sm rounded-4">
                    <div className="card-body p-4">
                        {loading ? (
                            <div className="text-center py-5">
                                <div className="spinner-border text-primary" role="status"></div>
                                <p className="mt-2 text-muted">Loading records...</p>
                            </div>
                        ) : (
                            <div className="table-responsive">
                                <table className="table align-middle table-borderless table-hover">
                                    <thead>
                                        <tr className="border-bottom">
                                            <th className="text-dark fw-bold small pb-3">#</th>
                                            <th className="text-dark fw-bold small pb-3">Student Name</th>
                                            <th className="text-dark fw-bold small pb-3">Book Name</th>
                                            <th className="text-dark fw-bold small pb-3">ISBN</th>
                                            <th className="text-dark fw-bold small pb-3">Issued Date</th>
                                            <th className="text-dark fw-bold small pb-3">Status / Return Date</th>
                                            <th className="text-dark fw-bold small pb-3 text-center">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {issuedBooks.length > 0 ? (
                                            issuedBooks.map((item, index) => (
                                                <tr key={item.id} className={`border-bottom ${item.is_returned ? '' : 'bg-danger bg-opacity-10'}`} style={{ transition: 'background-color 0.3s' }}>
                                                    <td className="py-3 text-secondary fw-medium">{index + 1}</td>
                                                    <td className="py-3 text-dark fw-medium small">{item.student_name}</td>
                                                    <td className="py-3 text-secondary small fw-medium">{item.book_name}</td>
                                                    <td className="py-3 text-secondary small">{item.isbn}</td>
                                                    <td className="py-3 text-secondary small">
                                                        {new Date(item.issued_at).toLocaleDateString()}
                                                    </td>
                                                    
                                                    {/* Conditional Styling for Status */}
                                                    <td className="py-3">
                                                        {item.is_returned ? (
                                                            <div>
                                                                <span className="badge bg-success bg-opacity-10 text-success px-2 py-1 border border-success border-opacity-25 rounded-pill mb-1 d-inline-flex align-items-center gap-1">
                                                                    <i className="fa-solid fa-check"></i> Returned
                                                                </span>
                                                                <div className="text-secondary mt-1" style={{ fontSize: '0.75rem' }}>
                                                                    {new Date(item.retuened_at).toLocaleString()}
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <span className="badge bg-danger bg-opacity-10 text-danger px-2 py-1 border border-danger border-opacity-25 rounded-pill d-inline-flex align-items-center gap-1">
                                                                <i className="fa-solid fa-clock"></i> Not Returned
                                                            </span>
                                                        )}
                                                    </td>
                                                    
                                                    {/* Conditional Action Button */}
                                                    <td className="py-3 text-center">
                                                        <Link 
                                                            to={`/admin/issued-book/${item.id}`} 
                                                            className={`btn btn-sm d-inline-flex align-items-center gap-2 px-3 rounded-pill fw-medium ${
                                                                item.is_returned 
                                                                ? 'btn-outline-secondary bg-light text-secondary border-0' 
                                                                : 'btn-danger shadow-sm'
                                                            }`}
                                                        >
                                                            {item.is_returned ? (
                                                                <><i className="fa-solid fa-eye"></i> Details</>
                                                            ) : (
                                                                <><i className="fa-solid fa-rotate-left"></i> Return</>
                                                            )}
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="7" className="text-center py-5 text-muted">
                                                    No issued books found.
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

export default ManageIssuedBooks;