import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';

const IssueBook = () => {
    const navigate = useNavigate();

    // Input States
    const [studentIdInput, setStudentIdInput] = useState('');
    const [bookIsbnInput, setBookIsbnInput] = useState('');
    const [remark, setRemark] = useState('');

    // Found Data States
    const [foundStudent, setFoundStudent] = useState(null);
    const [foundBook, setFoundBook] = useState(null);

    // Loading States
    const [loadingStudent, setLoadingStudent] = useState(false);
    const [loadingBook, setLoadingBook] = useState(false);
    const [issuing, setIssuing] = useState(false);

    useEffect(() => {
        const adminUser = localStorage.getItem("adminUser");
        if (!adminUser) navigate("/admin-login");
    }, [navigate]);

    // Mask Mobile Number Logic (1234******)
    const maskMobile = (mobileStr) => {
        if (!mobileStr) return "";
        const str = String(mobileStr);
        return str.length > 4 ? str.substring(0, 4) + "******" : str;
    };

    // Find Student
    const handleFindStudent = async () => {
        if (!studentIdInput) return toast.warning("Enter Student ID first.");
        try {
            setLoadingStudent(true);
            const res = await axios.get(`http://[https://library-management-system-0haj.onrender.com](https://library-management-system-0haj.onrender.com)/api/issue-book/search-student/${studentIdInput}/`);
            if (res.data.success) {
                setFoundStudent(res.data.student);
                toast.success("Student found!");
            }
        } catch (error) {
            setFoundStudent(null);
            toast.error(error.response?.data?.message || "Student not found.");
        } finally {
            setLoadingStudent(false);
        }
    };

    // Find Book
    const handleFindBook = async () => {
        if (!bookIsbnInput) return toast.warning("Enter ISBN first.");
        try {
            setLoadingBook(true);
            const res = await axios.get(`http://[https://library-management-system-0haj.onrender.com](https://library-management-system-0haj.onrender.com)/api/issue-book/search-book/${bookIsbnInput}/`);
            if (res.data.success) {
                setFoundBook(res.data.book);
                toast.success("Book found!");
            }
        } catch (error) {
            setFoundBook(null);
            toast.error(error.response?.data?.message || "Book not found.");
        } finally {
            setLoadingBook(false);
        }
    };

    // Submit Issue Book
    const handleIssueBook = async (e) => {
        e.preventDefault();
        if (!foundStudent || !foundBook) {
            return toast.warning("Please find and verify both Student and Book first.");
        }
        if (!remark) {
            return toast.warning("Please add a remark.");
        }

        try {
            setIssuing(true);
            const res = await axios.post("http://[https://library-management-system-0haj.onrender.com](https://library-management-system-0haj.onrender.com)/api/issue-book/submit/", {
                student_id: foundStudent.id, // Primary Key bhej rahe hain
                book_id: foundBook.id,       // Primary Key bhej rahe hain
                remark: remark
            });

            if (res.data.success) {
                toast.success(res.data.message);
                
                // Form Reset karna
                setStudentIdInput('');
                setBookIsbnInput('');
                setRemark('');
                setFoundStudent(null);
                setFoundBook(null);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to issue book.");
        } finally {
            setIssuing(false);
        }
    };

    return (
        <div className="bg-light min-vh-100 py-5">
            <div className="container px-4 px-lg-5">
                
                {/* Header Section */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div className="d-flex align-items-center gap-2">
                        <i className="fa-solid fa-arrow-right-from-bracket text-primary fs-3"></i>
                        <div>
                            <h2 className="fw-bold text-dark fs-4 mb-0">Issue a New Book</h2>
                            <p className="text-muted small mb-0">Search student and book, then issue the book with a remark.</p>
                        </div>
                    </div>
                    <div>
                        {/* Ye Manage Issued Books ka link hai */}
                        <Link to="/admin/manage-issued-books" className="btn btn-outline-primary bg-white shadow-sm fw-medium btn-sm d-flex align-items-center gap-2">
                            <i className="fa-solid fa-list-ul"></i> Manage Issued Books
                        </Link>
                    </div>
                </div>

                <div className="row g-4">
                    {/* Left Column: Form Section */}
                    <div className="col-lg-7">
                        <div className="card border-0 shadow-sm rounded-4 h-100 p-4 p-md-5">
                            <form onSubmit={handleIssueBook}>
                                
                                {/* Student Search */}
                                <div className="mb-4">
                                    <label className="form-label small fw-semibold text-secondary">Student ID <span className="text-danger">*</span></label>
                                    <div className="input-group">
                                        <input 
                                            type="text" 
                                            className="form-control py-2" 
                                            placeholder="Enter Student ID"
                                            value={studentIdInput}
                                            onChange={(e) => setStudentIdInput(e.target.value)}
                                        />
                                        <button 
                                            type="button" 
                                            className="btn btn-outline-secondary px-4" 
                                            onClick={handleFindStudent}
                                            disabled={loadingStudent}
                                        >
                                            <i className="fa-solid fa-magnifying-glass me-1"></i> Find
                                        </button>
                                    </div>
                                    {/* Found Status Text */}
                                    {foundStudent && (
                                        <div className="text-success small fw-medium mt-2">
                                            {foundStudent.full_name} ({foundStudent.email}) - {maskMobile(foundStudent.mobile)}
                                        </div>
                                    )}
                                </div>

                                {/* Book Search */}
                                <div className="mb-4">
                                    <label className="form-label small fw-semibold text-secondary">ISBN Number <span className="text-danger">*</span></label>
                                    <div className="input-group">
                                        <input 
                                            type="text" 
                                            className="form-control py-2" 
                                            placeholder="Enter Book ISBN"
                                            value={bookIsbnInput}
                                            onChange={(e) => setBookIsbnInput(e.target.value)}
                                        />
                                        <button 
                                            type="button" 
                                            className="btn btn-outline-secondary px-4"
                                            onClick={handleFindBook}
                                            disabled={loadingBook}
                                        >
                                            <i className="fa-solid fa-book-open me-1"></i> Find
                                        </button>
                                    </div>
                                    {/* Found Status Text */}
                                    {foundBook && (
                                        <div className="text-success small fw-medium mt-2">
                                            {foundBook.title} (ISBN: {foundBook.isbn}) - Qty: {foundBook.quentity}
                                        </div>
                                    )}
                                </div>

                                {/* Remark */}
                                <div className="mb-4">
                                    <label className="form-label small fw-semibold text-secondary">Remark <span className="text-danger">*</span></label>
                                    <textarea 
                                        className="form-control" 
                                        rows="3" 
                                        placeholder="e.g. Issued for 7 days, handle with care."
                                        value={remark}
                                        onChange={(e) => setRemark(e.target.value)}
                                    ></textarea>
                                </div>

                                <button 
                                    type="submit" 
                                    className="btn btn-primary fw-medium px-4 py-2 d-flex align-items-center gap-2"
                                    disabled={!foundStudent || !foundBook || issuing}
                                >
                                    <i className="fa-solid fa-arrow-right-from-bracket"></i> {issuing ? "Issuing..." : "Issue Book"}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Right Column: Preview Cards */}
                    <div className="col-lg-5">
                        
                        {/* Student Preview Card */}
                        {foundStudent && (
                            <div className="card border-0 shadow-sm rounded-4 mb-4">
                                <div className="card-body p-4 d-flex gap-3 align-items-center">
                                    <div className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex justify-content-center align-items-center" style={{width: '50px', height: '50px'}}>
                                        <i className="fa-solid fa-user"></i>
                                    </div>
                                    <div>
                                        <p className="text-muted small mb-0">Student</p>
                                        <h6 className="fw-bold mb-0 text-dark">{foundStudent.full_name}</h6>
                                        <span className="text-secondary small">{foundStudent.student_id} • {foundStudent.email}</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Book Preview Card */}
                        {foundBook && (
                            <div className="card border-0 shadow-sm rounded-4">
                                <div className="card-body p-4 d-flex gap-3 align-items-center">
                                    {foundBook.cover_image ? (
                                        <img src={`http://[https://library-management-system-0haj.onrender.com](https://library-management-system-0haj.onrender.com)${foundBook.cover_image}`} alt="cover" className="rounded shadow-sm" style={{width: '50px', height: '65px', objectFit: 'cover'}} />
                                    ) : (
                                        <div className="bg-secondary rounded d-flex justify-content-center align-items-center text-white" style={{width: '50px', height: '65px'}}>
                                            <i className="fa-solid fa-book"></i>
                                        </div>
                                    )}
                                    <div>
                                        <p className="text-muted small mb-0">Book</p>
                                        <h6 className="fw-bold mb-0 text-dark">{foundBook.title}</h6>
                                        <span className="text-secondary small">ISBN: {foundBook.isbn} • Qty: {foundBook.quentity}</span>
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>
                </div>

            </div>
        </div>
    );
};

export default IssueBook;