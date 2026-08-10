import React, { useState, useEffect } from 'react';
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";

const AddBook = () => {
    const navigate = useNavigate();

    // Form State
    const [title, setTitle] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [authorId, setAuthorId] = useState("");
    const [isbn, setIsbn] = useState("");
    const [price, setPrice] = useState("");
    const [quantity, setQuantity] = useState("");
    const [coverFile, setCoverFile] = useState(null);

    // Dropdown Data State
    const [categories, setCategories] = useState([]);
    const [authors, setAuthors] = useState([]);
    const [loadingDropdown, setLoadingDropdown] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const adminUser = localStorage.getItem("adminUser");
        if (!adminUser) {
            navigate("/admin-login");
        } else {
            fetchDropdownData();
        }
    }, [navigate]);

    const fetchDropdownData = async () => {
        try {
            setLoadingDropdown(true);

            const [catRes, authRes] = await Promise.all([
                axios.get("https://library-management-system-0haj.onrender.com/api/categories/"),
                axios.get("https://library-management-system-0haj.onrender.com/api/author/")
            ]);

            // Filter active categories. Author model doesn't have is_active, so we map it directly.
            const activeCategories = catRes.data.filter((cat) => cat.is_active);

            setCategories(activeCategories);
            setAuthors(authRes.data);

        } catch (err) {
            console.error(err);
            toast.error("Failed to fetch categories or authors");
        } finally {
            setLoadingDropdown(false);
        }
    };

    const handleFileChange = (e) => {
        setCoverFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title || !categoryId || !authorId || !isbn || !price || !quantity) {
            return toast.warning("Please fill all required fields.");
        }

        const formData = new FormData();
        formData.append("title", title);
        formData.append("category", categoryId);
        formData.append("author", authorId);
        formData.append("isbn", isbn);
        formData.append("price", price);

        // Spelling matches your Django Book model 'quentity'
        formData.append("quentity", quantity);

        if (coverFile) {
            formData.append("cover_image", coverFile);
        }

        try {
            setLoading(true);
            const response = await axios.post("https://library-management-system-0haj.onrender.com/api/books/add/", formData, {
                
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });

            toast.success("Book Added Successfully!");

            // Reset Form Fields
            setTitle("");
            setCategoryId("");
            setAuthorId("");
            setIsbn("");
            setPrice("");
            setQuantity("");
            setCoverFile(null);
            
            // File input manually reset
            document.getElementById("bookCoverInput").value = "";

        } catch (error) {
            console.error(error);
            toast.error("Failed to add book. Check ISBN uniqueness.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-light min-vh-100 py-5">
            <div className="container">
                
                {/* Header Section */}
                <div className="d-flex justify-content-between align-items-start mb-5">
                    <div className="d-flex align-items-start">
                        <div className="me-3 mt-1">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-primary" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                            </svg>
                        </div>
                        <div>
                            <h2 className="fw-bold text-dark fs-4 mb-1">Add Book</h2>
                            <p className="text-muted small mb-0">
                                Add a new book with category, author, ISBN, price and stock.
                            </p>
                        </div>
                    </div>
                    <div>
                        <Link to="/admin/book-manage" className="btn btn-outline-primary bg-white shadow-sm fw-medium d-flex align-items-center gap-2">
                           <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg> 
                           Manage Books
                        </Link>
                    </div>
                </div>

                {/* Form Card */}
                <div className="card border-0 shadow-sm rounded-4">
                    <div className="card-body p-4 p-lg-5">
                        <form onSubmit={handleSubmit}>
                            <div className="row gx-lg-5">
                                
                                {/* Book Name */}
                                <div className="col-md-6 mb-4">
                                    <label className="form-label small fw-semibold text-secondary">
                                        Book Name <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control py-2"
                                        placeholder="e.g. Python for Beginners"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                    />
                                </div>

                                {/* Category */}
                                <div className="col-md-6 mb-4">
                                    <label className="form-label small fw-semibold text-secondary">
                                        Category <span className="text-danger">*</span>
                                    </label>
                                    <select
                                        className="form-select py-2 text-secondary"
                                        value={categoryId}
                                        onChange={(e) => setCategoryId(e.target.value)}
                                    >
                                        <option value="">Select Category</option>
                                        {categories.map((cat) => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Author */}
                                <div className="col-md-6 mb-4">
                                    <label className="form-label small fw-semibold text-secondary">
                                        Author <span className="text-danger">*</span>
                                    </label>
                                    <select
                                        className="form-select py-2 text-secondary"
                                        value={authorId}
                                        onChange={(e) => setAuthorId(e.target.value)}
                                    >
                                        <option value="">Select Author</option>
                                        {authors.map((auth) => (
                                            <option key={auth.id} value={auth.id}>{auth.name}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* ISBN Number */}
                                <div className="col-md-6 mb-4">
                                    <label className="form-label small fw-semibold text-secondary">
                                        ISBN Number <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control py-2"
                                        placeholder="Unique ISBN"
                                        value={isbn}
                                        onChange={(e) => setIsbn(e.target.value)}
                                    />
                                    <div className="form-text small mt-1">ISBN must be unique for each book.</div>
                                </div>

                                {/* Price */}
                                <div className="col-md-6 mb-4">
                                    <label className="form-label small fw-semibold text-secondary">
                                        Price <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        className="form-control py-2"
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                    />
                                </div>

                                {/* Quantity */}
                                <div className="col-md-6 mb-4">
                                    <label className="form-label small fw-semibold text-secondary">
                                        Quantity <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        className="form-control py-2"
                                        value={quantity}
                                        onChange={(e) => setQuantity(e.target.value)}
                                    />
                                </div>

                                {/* Book Cover File Input */}
                                <div className="col-md-6 mb-4">
                                    <label className="form-label small fw-semibold text-secondary">
                                        Book Cover <span className="text-danger">*</span>
                                    </label>
                                    <input 
                                        type="file" 
                                        className="form-control py-2" 
                                        id="bookCoverInput"
                                        onChange={handleFileChange} 
                                        accept="image/*"
                                    />
                                </div>

                            </div>

                            <div className="mt-2">
                                <button
                                    type="submit"
                                    className="btn btn-primary fw-medium py-2 px-4 d-inline-flex align-items-center gap-2"
                                    disabled={loading}
                                >
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                    {loading ? "Submitting..." : "Submit"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddBook;