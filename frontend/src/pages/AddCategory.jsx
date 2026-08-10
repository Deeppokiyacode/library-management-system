import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const AddCategory = () => {
    const [name, setName] = useState("");
    const [status, setStatus] = useState(true);
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);

    const getCategories = async () => {
        try {
            const res = await axios.get("http://127.0.0.1:8000/api/categories/");
            setCategories(res.data);
        } catch (error) {
            console.log(error);
            toast.error("Unable to load categories");
        }
    };

    useEffect(() => {
        getCategories();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (name.trim() === "") {
            toast.error("Category name is required");
            return;
        }

        setLoading(true);

        try {
            const res = await axios.post("http://127.0.0.1:8000/api/categories/add/", {
                name: name,
                is_active: status,
            });

            if (res.data.success) {
                toast.success(res.data.message);
                setName("");
                setStatus(true);
                getCategories();
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
                
                {/* Header Section (Fixed Alignment & Spacing) */}
                <div className="d-flex align-items-start mb-5">
                    <div className="me-3 mt-1">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-primary" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                            <polyline points="2 12 12 17 22 12"></polyline>
                            <polyline points="2 17 12 22 22 17"></polyline>
                        </svg>
                    </div>
                    <div>
                        <h2 className="fw-bold text-dark fs-4 mb-1">Add Category</h2>
                        <p className="text-muted small mb-0">
                            Create new book categories and manage their active status.
                        </p>
                    </div>
                </div>

                <div className="row">
                    {/* Left Side: Form Container */}
                    <div className="col-lg-5 col-md-12 mb-4">
                        <div className="card border-0 shadow-sm rounded-4">
                            <div className="card-header bg-transparent border-0 fw-bold text-dark pt-4 px-4 pb-2">
                                Category Info
                            </div>
                            
                            <div className="card-body px-4 pb-4">
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label className="form-label small fw-semibold text-secondary">
                                            Category Name
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control py-2"
                                            placeholder="e.g. Programming, Science, Novel"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label className="form-label d-block small fw-semibold text-secondary mb-2">
                                            Status
                                        </label>
                                        <div className="form-check form-check-inline">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                name="statusOptions"
                                                id="activeRadio"
                                                checked={status === true}
                                                onChange={() => setStatus(true)}
                                            />
                                            <label className="form-check-label small" htmlFor="activeRadio">
                                                Active
                                            </label>
                                        </div>
                                        <div className="form-check form-check-inline">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                name="statusOptions"
                                                id="inactiveRadio"
                                                checked={status === false}
                                                onChange={() => setStatus(false)}
                                            />
                                            <label className="form-check-label small" htmlFor="inactiveRadio">
                                                Inactive
                                            </label>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        className="btn btn-primary w-100 fw-medium py-2 mt-2"
                                        disabled={loading}
                                    >
                                        {loading ? "Saving..." : "+ Create Category"}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Table Container */}
                    <div className="col-lg-7 col-md-12">
                        <div className="card border-0 shadow-sm rounded-4">
                            <div className="card-header bg-transparent border-0 fw-bold text-dark pt-4 px-4 pb-2">
                                Existing Categories
                            </div>
                            
                            <div className="card-body px-4 pb-4">
                                <div className="table-responsive">
                                    <table className="table align-middle table-borderless">
                                        <thead>
                                            <tr className="border-bottom">
                                                <th className="text-dark fw-bold small pb-3" width="50">#</th>
                                                <th className="text-dark fw-bold small pb-3">Name</th>
                                                <th className="text-dark fw-bold small pb-3">Status</th>
                                                <th className="text-dark fw-bold small pb-3">Created</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {categories.length > 0 ? (
                                                categories.map((item, index) => (
                                                    <tr key={item.id} className="border-bottom">
                                                        <td className="py-3 text-secondary">{index + 1}</td>
                                                        <td className="py-3 fw-medium text-dark">{item.name}</td>
                                                        <td className="py-3">
                                                            {item.is_active ? (
                                                                <span className="badge rounded-pill text-bg-success bg-opacity-75 px-3 py-2">
                                                                    Active
                                                                </span>
                                                            ) : (
                                                                <span className="badge rounded-pill text-bg-danger bg-opacity-75 px-3 py-2">
                                                                    Inactive
                                                                </span>
                                                            )}
                                                        </td>
                                                        <td className="py-3 text-secondary small">
                                                            {item.created_at ? new Date(item.created_at).toLocaleDateString() : "2/8/2026"}
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="4" className="text-center py-4 text-muted">
                                                        No Categories Found
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

export default AddCategory;