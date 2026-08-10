import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const MyLibrary = () => {
    const navigate = useNavigate();
    
    const [books, setBooks] = useState([]);
    const [filteredBooks, setFilteredBooks] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Check if student is logged in
        const storedUser = localStorage.getItem("studentUser");
        if (!storedUser) {
            navigate("/user-login");
        } else {
            fetchAllBooks();
        }
    }, [navigate]);

    const fetchAllBooks = async () => {
        try {
            setLoading(true);
            // Same API used in Admin Manage Books
            const res = await axios.get("http://127.0.0.1:8000/api/books/");
            setBooks(res.data);
            setFilteredBooks(res.data); // Initially, show all books
        } catch (error) {
            console.error("Error fetching books:", error);
        } finally {
            setLoading(false);
        }
    };

    // Client-side Search Logic
    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);

        if (query === "") {
            setFilteredBooks(books);
        } else {
            const filtered = books.filter((book) => 
                book.title.toLowerCase().includes(query) ||
                book.author_name.toLowerCase().includes(query) ||
                book.isbn.toLowerCase().includes(query)
            );
            setFilteredBooks(filtered);
        }
    };

    return (
        <div className="bg-light min-vh-100 py-5">
            <div className="container px-4 px-lg-5">
                
                {/* Header & Search Section */}
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-5 gap-3">
                    <div>
                        <h2 className="fw-bold text-dark fs-3 mb-1 d-flex align-items-center gap-2">
                            <i className="fa-solid fa-book-bookmark text-primary"></i> 
                            Available Books
                        </h2>
                        <p className="text-muted small mb-0">
                            Explore all books in the library catalogue with quantity & availability.
                        </p>
                    </div>
                    <div className="w-100" style={{maxWidth: '350px'}}>
                        <div className="input-group shadow-sm">
                            <span className="input-group-text bg-white border-end-0 text-muted">
                                <i className="fa-solid fa-magnifying-glass"></i>
                            </span>
                            <input 
                                type="text" 
                                className="form-control border-start-0 ps-0 py-2" 
                                placeholder="Search by title, author or ISBN" 
                                value={searchQuery}
                                onChange={handleSearch}
                            />
                        </div>
                    </div>
                </div>

                {/* Books Grid */}
                {loading ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-primary" role="status"></div>
                        <p className="mt-2 text-muted">Loading books...</p>
                    </div>
                ) : (
                    <div className="row g-4">
                        {filteredBooks.length > 0 ? (
                            filteredBooks.map((book) => (
                                <div className="col-12 col-md-6 col-lg-4" key={book.id}>
                                    <div className="card border-0 shadow-sm rounded-4 h-100 overflow-hidden">
                                        
                                        {/* Book Cover Image */}
                                        <div className="d-flex justify-content-center align-items-center p-4 bg-white border-bottom" style={{height: '250px'}}>
                                            {book.cover_image ? (
                                                <img 
                                                    src={`http://127.0.0.1:8000${book.cover_image}`} 
                                                    alt={book.title} 
                                                    className="img-fluid rounded shadow-sm"
                                                    style={{maxHeight: '100%', objectFit: 'contain'}}
                                                />
                                            ) : (
                                                <div className="bg-light w-100 h-100 d-flex justify-content-center align-items-center rounded text-muted">
                                                    No Cover
                                                </div>
                                            )}
                                        </div>

                                        {/* Book Details */}
                                        <div className="card-body p-4 d-flex flex-column">
                                            <h5 className="fw-bold text-dark mb-3">{book.title}</h5>
                                            
                                            <p className="text-secondary small mb-2 d-flex align-items-center gap-2">
                                                <i className="fa-solid fa-user text-muted"></i> {book.author_name}
                                            </p>
                                            
                                            <p className="mb-2">
                                                <span className="badge bg-primary bg-opacity-10 text-primary px-2 py-1">
                                                    <i className="fa-solid fa-layer-group me-1"></i> {book.category_name}
                                                </span>
                                            </p>
                                            
                                            <p className="text-secondary small mb-4 d-flex align-items-center gap-2">
                                                <i className="fa-solid fa-barcode text-muted"></i> ISBN: {book.isbn}
                                            </p>

                                           {/* Footer: Price & Availability */}
                                            <div className="mt-auto d-flex justify-content-between align-items-center pt-3 border-top">
                                                <div className="fw-bold text-success">
                                                    ₹ {book.price}
                                                </div>
                                                <div>
                                                    {book.quentity > 0 ? (
                                                        <span className="badge bg-success bg-opacity-10 text-success px-3 py-2 border border-success border-opacity-25 rounded-pill d-flex align-items-center gap-1">
                                                            <i className="fa-solid fa-circle-check"></i> Available: {book.quentity}
                                                        </span>
                                                    ) : (
                                                        <span className="badge bg-danger bg-opacity-10 text-danger px-3 py-2 border border-danger border-opacity-25 rounded-pill d-flex align-items-center gap-1">
                                                            <i className="fa-solid fa-circle-xmark"></i> Out of Stock
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-12 text-center py-5 text-muted">
                                <h5>No books found matching "{searchQuery}"</h5>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyLibrary;