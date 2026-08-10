import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

const ManageBook = () => {
    const navigate = useNavigate();

    // Data States
    const [books, setBooks] = useState([]);
    const [categories, setCategories] = useState([]);
    const [authors, setAuthors] = useState([]);
    const [loading, setLoading] = useState(false);

    // Edit Form States
    const [editBookId, setEditBookId] = useState(null);
    const [title, setTitle] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [authorId, setAuthorId] = useState("");
    const [isbn, setIsbn] = useState("");
    const [price, setPrice] = useState("");
    const [quantity, setQuantity] = useState("");
    const [coverFile, setCoverFile] = useState(null);
    const [currentCoverUrl, setCurrentCoverUrl] = useState("");

    useEffect(() => {
        const adminUser = localStorage.getItem("adminUser");
        if (!adminUser) {
            navigate("/admin-login");
        } else {
            fetchInitialData();
        }
    }, [navigate]);

    const fetchInitialData = async () => {
        try {
            const [booksRes, catRes, authRes] = await Promise.all([
                axios.get("https://library-management-system-0haj.onrender.com/api/books/"),
                axios.get("https://library-management-system-0haj.onrender.com/api/categories/"),
                axios.get("https://library-management-system-0haj.onrender.com/api/author/"),
            ]);
            setBooks(booksRes.data);
            
            // Populate active dropdowns
            setCategories(catRes.data.filter(cat => cat.is_active));
            setAuthors(authRes.data);
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch data");
        }
    };

    // Populate Edit Form when Edit Button is clicked
    const handleEditClick = (book) => {
        setEditBookId(book.id);
        setTitle(book.title);
        setCategoryId(book.category);
        setAuthorId(book.author);
        setIsbn(book.isbn);
        setPrice(book.price);
        setQuantity(book.quentity); // Note: using 'quentity' from your django model
        setCurrentCoverUrl(book.cover_image);
        setCoverFile(null); // Reset file input
        document.getElementById("editCoverInput").value = "";
    };

    const handleFileChange = (e) => {
        setCoverFile(e.target.files[0]);
    };

    // Submit Edit Update
    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        if (!editBookId) return toast.warning("Please select a book to edit first.");

        const formData = new FormData();
        formData.append("title", title);
        formData.append("category", categoryId);
        formData.append("author", authorId);
        formData.append("isbn", isbn);
        formData.append("price", price);
        formData.append("quentity", quantity); 

        if (coverFile) {
            formData.append("cover_image", coverFile);
        }

        try {
            setLoading(true);
            const res = await axios.put(`https://library-management-system-0haj.onrender.com/api/books/${editBookId}/update/`, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            
            if (res.data.success) {
                toast.success(res.data.message);
                fetchInitialData(); // Refresh table
                
                // Reset edit form
                setEditBookId(null);
                setTitle("");
                setCategoryId("");
                setAuthorId("");
                setIsbn("");
                setPrice("");
                setQuantity("");
                setCurrentCoverUrl("");
                setCoverFile(null);
            }
        } catch (error) {
            console.error(error);
            toast.error("Error updating book.");
        } finally {
            setLoading(false);
        }
    };

    // Handle Delete
    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this book?")) {
            try {
                const res = await axios.delete(`https://library-management-system-0haj.onrender.com/api/books/${id}/delete/`);
                if (res.data.success) {
                    toast.success(res.data.message);
                    fetchInitialData();
                    if (editBookId === id) setEditBookId(null); // Clear form if deleted item was being edited
                }
            } catch (error) {
                toast.error("Failed to delete book.");
            }
        }
    };

    return (
        <div className="bg-light min-vh-100 py-5">
            <div className="container-fluid px-4 px-lg-5">
                
                {/* Header Section */}
                <div className="d-flex justify-content-between align-items-center mb-5">
                    <div>
                        <h2 className="fw-bold text-dark fs-4 mb-1">Manage Books</h2>
                        <p className="text-muted small mb-0">
                            View, edit and delete all books in the library.
                        </p>
                    </div>
                    <div>
                        <Link to="/admin/book-add" className="btn btn-outline-primary bg-white shadow-sm fw-medium d-flex align-items-center gap-2">
                            <span className="fs-5 pb-1">+</span> Add Book
                        </Link>
                    </div>
                </div>

                <div className="row gx-lg-4">
                    
                    {/* Left Column: Edit Form */}
                    <div className="col-lg-3 col-md-12 mb-4">
                        <div className="card border-0 shadow-sm rounded-4 h-100">
                            <div className="card-header bg-transparent border-0 fw-bold text-dark pt-4 px-4 pb-2">
                                Edit Book
                            </div>
                            <div className="card-body px-4 pb-4">
                                <form onSubmit={handleUpdateSubmit}>
                                    
                                    <div className="mb-3">
                                        <label className="form-label small text-secondary">Book Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            disabled={!editBookId}
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label small text-secondary">Category</label>
                                        <select
                                            className="form-select text-secondary"
                                            value={categoryId}
                                            onChange={(e) => setCategoryId(e.target.value)}
                                            disabled={!editBookId}
                                        >
                                            <option value="">Select Category</option>
                                            {categories.map((cat) => (
                                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label small text-secondary">Author</label>
                                        <select
                                            className="form-select text-secondary"
                                            value={authorId}
                                            onChange={(e) => setAuthorId(e.target.value)}
                                            disabled={!editBookId}
                                        >
                                            <option value="">Select Author</option>
                                            {authors.map((auth) => (
                                                <option key={auth.id} value={auth.id}>{auth.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label small text-secondary">Price</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            className="form-control"
                                            value={price}
                                            onChange={(e) => setPrice(e.target.value)}
                                            disabled={!editBookId}
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label small text-secondary">Quantity</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            value={quantity}
                                            onChange={(e) => setQuantity(e.target.value)}
                                            disabled={!editBookId}
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label className="form-label small text-secondary">Book Cover</label>
                                        {currentCoverUrl && (
                                            <div className="mb-2">
                                                <img src={`https://library-management-system-0haj.onrender.com${currentCoverUrl}`} alt="Current Cover" className="img-thumbnail" style={{ height: "60px", width:"50px", objectFit:"cover" }} />
                                            </div>
                                        )}
                                        <input 
                                            type="file" 
                                            className="form-control form-control-sm" 
                                            id="editCoverInput"
                                            onChange={handleFileChange} 
                                            accept="image/*"
                                            disabled={!editBookId}
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="btn btn-primary w-100 fw-medium"
                                        disabled={!editBookId || loading}
                                    >
                                        {loading ? "Updating..." : "Update Book"}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Data Table */}
                    <div className="col-lg-9 col-md-12">
                        <div className="card border-0 shadow-sm rounded-4">
                            <div className="card-header bg-transparent border-0 fw-bold text-dark pt-4 px-4 pb-2">
                                Books Listing
                            </div>
                            <div className="card-body px-4 pb-4">
                                <div className="table-responsive">
                                    <table className="table align-middle table-borderless table-hover text-center">
                                        <thead>
                                            <tr className="border-bottom">
                                                <th className="text-dark fw-bold small pb-3">#</th>
                                                <th className="text-dark fw-bold small pb-3 text-start">Book</th>
                                                <th className="text-dark fw-bold small pb-3 text-start">Category</th>
                                                <th className="text-dark fw-bold small pb-3 text-start">Author</th>
                                                <th className="text-dark fw-bold small pb-3">ISBN</th>
                                                <th className="text-dark fw-bold small pb-3">Price</th>
                                                <th className="text-dark fw-bold small pb-3">Qty</th>
                                                <th className="text-dark fw-bold small pb-3">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {books.length > 0 ? (
                                                books.map((item, index) => (
                                                    <tr key={item.id} className="border-bottom">
                                                        <td className="py-3 text-secondary">{index + 1}</td>
                                                        
                                                        <td className="py-3 text-start">
                                                            <div className="d-flex flex-column align-items-start">
                                                                {item.cover_image ? (
                                                                     <img src={`https://library-management-system-0haj.onrender.com${item.cover_image}`} alt="cover" className="rounded mb-1 shadow-sm" style={{width: "45px", height: "55px", objectFit: "cover"}} />
                                                                ) : (
                                                                    <div className="bg-secondary rounded mb-1 d-flex justify-content-center align-items-center text-white small" style={{width: "45px", height: "55px"}}>No Img</div>
                                                                )}
                                                                <span className="fw-medium text-dark small mt-1 d-inline-block text-truncate" style={{maxWidth: "150px"}} title={item.title}>
                                                                    {item.title}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        
                                                        <td className="py-3 text-secondary small text-start">{item.category_name}</td>
                                                        <td className="py-3 text-secondary small text-start">{item.author_name}</td>
                                                        <td className="py-3 text-secondary small">{item.isbn}</td>
                                                        <td className="py-3 text-dark fw-medium small">{item.price}</td>
                                                        <td className="py-3 text-secondary small">{item.quentity}</td>
                                                        
                                                        <td className="py-3">
                                                            <div className="d-flex gap-2 justify-content-center">
                                                                <button 
                                                                    onClick={() => handleEditClick(item)}
                                                                    className="btn btn-sm btn-outline-primary d-flex align-items-center gap-1 bg-white px-2"
                                                                >
                                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                                                    Edit
                                                                </button>
                                                                <button 
                                                                    onClick={() => handleDelete(item.id)}
                                                                    className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1 bg-white px-2"
                                                                >
                                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                                                    Delete
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="8" className="text-center py-5 text-muted">
                                                        No Books Found
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ManageBook;