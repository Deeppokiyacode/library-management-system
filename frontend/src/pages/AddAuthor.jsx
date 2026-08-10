import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const AddAuthor = () => {
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const [authors, setAuthors] = useState([]);

    // Backend se Authors fetch karne ka function
    const getAuthors = async () => {
        try {
            const res = await axios.get("http://[https://library-management-system-0haj.onrender.com](https://library-management-system-0haj.onrender.com)/api/author/");
            setAuthors(res.data);
        } catch (error) {
            console.log(error);
            toast.error("Unable to load authors");
        }
    };

    useEffect(() => {
        getAuthors();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (name.trim() === "") {
            toast.error("Author name is required");
            return;
        }

        setLoading(true);

        try {
            const res = await axios.post("http://[https://library-management-system-0haj.onrender.com](https://library-management-system-0haj.onrender.com)/api/author/add/", {
                name: name,
            });

            if (res.data.success) {
                toast.success(res.data.message);
                setName("");
                getAuthors(); // List ko refresh karne ke liye
            }
        } catch (error) {
            toast.error("Something went wrong");
            console.log(error);
        }

        setLoading(false);
    };

    return (
        <div className="bg-light min-vh-100 py-5">
            <div className="container">
                
                {/* Header Section */}
                <div className="d-flex align-items-start mb-5">
                    <div className="me-3 mt-1">
                        {/* User Icon for Author */}
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0d6efd" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                    </div>
                    <div>
                        <h2 className="fw-bold text-dark fs-4 mb-1">Add Author</h2>
                        <p className="text-muted small mb-0">
                            Create new book authors and manage their details.
                        </p>
                    </div>
                </div>

                <div className="row">
                    {/* Left Side: Form Container */}
                    <div className="col-lg-5 col-md-12 mb-4">
                        <div className="card border-0 shadow-sm rounded-4">
                            <div className="card-header bg-transparent border-0 fw-bold text-dark pt-4 px-4 pb-2">
                                Author Info
                            </div>
                            
                            <div className="card-body px-4 pb-4">
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-4">
                                        <label className="form-label small fw-semibold text-secondary">
                                            Author Name
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control py-2"
                                            placeholder="e.g. J.K. Rowling, George R.R. Martin"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="btn btn-primary w-100 fw-medium py-2"
                                        disabled={loading}
                                    >
                                        {loading ? "Saving..." : "+ Add Author"}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Table Container */}
                    <div className="col-lg-7 col-md-12">
                        <div className="card border-0 shadow-sm rounded-4">
                            <div className="card-header bg-transparent border-0 fw-bold text-dark pt-4 px-4 pb-2">
                                Existing Authors
                            </div>
                            
                            <div className="card-body px-4 pb-4">
                                <div className="table-responsive">
                                    <table className="table align-middle table-borderless">
                                        <thead>
                                            <tr className="border-bottom">
                                                <th className="text-dark fw-bold small pb-3" width="50">#</th>
                                                <th className="text-dark fw-bold small pb-3">Name</th>
                                                <th className="text-dark fw-bold small pb-3">Created</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {authors.length > 0 ? (
                                                authors.map((item, index) => (
                                                    <tr key={item.id} className="border-bottom">
                                                        <td className="py-3 text-secondary">{index + 1}</td>
                                                        <td className="py-3 fw-medium text-dark">{item.name}</td>
                                                        <td className="py-3 text-secondary small">
                                                            {item.created_at ? new Date(item.created_at).toLocaleDateString() : "N/A"}
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="3" className="text-center py-4 text-muted">
                                                        No Authors Found
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

export default AddAuthor;