import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const API_URL = "https://library-management-system-0haj.onrender.com/api/categories/";

const ManageCategory = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const [formData, setFormData] = useState({
        id: null,
        name: "",
        is_active: true,
    });

    //----------------------------------------
    // Load Categories
    //----------------------------------------
    const fetchCategories = async () => {
        setLoading(true);
        try {
            const res = await axios.get(API_URL);
            setCategories(res.data);
        } catch (error) {
            console.log(error);
            toast.error("Unable to load categories");
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    //----------------------------------------
    // Handlers
    //----------------------------------------
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleStatus = (status) => {
        setFormData({ ...formData, is_active: status });
    };

    const resetForm = () => {
        setFormData({ id: null, name: "", is_active: true });
        setIsEditing(false);
    };

    const editCategory = (category) => {
        setFormData({
            id: category.id,
            name: category.name,
            is_active: category.is_active,
        });
        setIsEditing(true);
    };

    //----------------------------------------
    // Save / Update Category
    //----------------------------------------
    const saveCategory = async (e) => {
        e.preventDefault();

        if (formData.name.trim() === "") {
            toast.error("Category name is required");
            return;
        }

        setSaving(true);
        try {
            if (isEditing) {
                // Update specific endpoint
                await axios.put(`${API_URL}${formData.id}/`, {
                    name: formData.name,
                    is_active: formData.is_active,
                });
                toast.success("Category Updated successfully");
            } else {
                // Add new category endpoint
                await axios.post(`${API_URL}add/`, {
                    name: formData.name,
                    is_active: formData.is_active,
                });
                toast.success("Category Added successfully");
            }
            resetForm();
            fetchCategories();
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong while saving");
        }
        setSaving(false);
    };

    //----------------------------------------
    // Delete Category
    //----------------------------------------
    const deleteCategory = async (id) => {
        if (!window.confirm("Are you sure you want to delete this category?")) return;

        try {
            // Delete specific endpoint
            await axios.delete(`${API_URL}${id}/delete/`);
            toast.success("Category Deleted successfully");
            fetchCategories();
        } catch (error) {
            console.log(error);
            toast.error("Unable to delete category");
        }
    };

    // Filter categories based on search
    const filteredCategories = categories.filter((cat) =>
        cat.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="bg-light min-vh-100 py-5">
            <div className="container">
                
                {/* Header Section */}
                <div className="d-flex justify-content-between align-items-start mb-5">
                    <div className="d-flex align-items-start">
                        <div className="me-3 mt-1">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0d6efd" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                                <polyline points="2 12 12 17 22 12"></polyline>
                                <polyline points="2 17 12 22 22 17"></polyline>
                            </svg>
                        </div>
                        <div>
                            <h2 className="fw-bold text-dark fs-4 mb-1">Manage Categories</h2>
                            <p className="text-muted small mb-0">
                                View, edit and delete categories from the library.
                            </p>
                        </div>
                    </div>

                    {!isEditing && (
                        <button className="btn btn-outline-primary fw-medium px-3 py-2 bg-white" onClick={() => navigate('/admin/category-add')}>
                            + Add New
                        </button>
                    )}
                </div>

                <div className="row">
                    {/* Left Card: Edit/Add Form */}
              
                    <div className="col-lg-4 mb-4">
                        {isEditing ? (
                            <div className="card border-0 shadow-sm rounded-4">
                                <div className="card-header bg-transparent border-0 fw-bold text-dark pt-4 px-4 pb-2">
                                    Edit Category
                                </div>
                                
                                <div className="card-body px-4 pb-4">
                                    <form onSubmit={saveCategory}>
                                        <div className="mb-3">
                                            <label className="form-label small fw-semibold text-secondary">
                                                Category Name
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control py-2"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                placeholder="Enter category name"
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
                                                    id="statusActive"
                                                    checked={formData.is_active}
                                                    onChange={() => handleStatus(true)}
                                                />
                                                <label className="form-check-label small" htmlFor="statusActive">
                                                    Active
                                                </label>
                                            </div>
                                            <div className="form-check form-check-inline">
                                                <input
                                                    className="form-check-input"
                                                    type="radio"
                                                    id="statusInactive"
                                                    checked={!formData.is_active}
                                                    onChange={() => handleStatus(false)}
                                                />
                                                <label className="form-check-label small" htmlFor="statusInactive">
                                                    Inactive
                                                </label>
                                            </div>
                                        </div>

                                        <div className="d-flex">
                                            <button className="btn btn-primary fw-medium py-2 px-4 d-flex align-items-center" disabled={saving}>
                                                {saving ? (
                                                    "Saving..."
                                                ) : (
                                                    <>
                                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="me-2">
                                                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                                            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                                                        </svg>
                                                        Update
                                                    </>
                                                )}
                                            </button>

                                            <button type="button" className="btn text-secondary fw-medium py-2 px-3 ms-2" onClick={resetForm}>
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        ) : (
                            <div className="card border-0 shadow-sm rounded-4 d-flex align-items-center justify-content-center text-center px-4" style={{ minHeight: "380px" }}>
                                <div className="text-muted">
                                    <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mb-3 opacity-50">
                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                    </svg>
                                    <h5 className="fw-semibold text-dark">No Category Selected</h5>
                                    <p className="small mb-0 mt-2">
                                        Please select a category from the list to view or edit its details here.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Card: Listing */}
                    <div className="col-lg-8">
                        <div className="card border-0 shadow-sm rounded-4">
                            <div className="card-header bg-transparent border-0 d-flex justify-content-between align-items-center pt-4 px-4 pb-2">
                                <span className="fw-bold text-dark">Categories Listing</span>
                                <input 
                                    type="text" 
                                    className="form-control form-control-sm w-auto" 
                                    placeholder="Search..." 
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            
                            <div className="card-body px-4 pb-4">
                                <div className="table-responsive">
                                    <table className="table align-middle table-borderless table-hover mb-0">
                                        <thead>
                                            <tr className="border-bottom">
                                                <th className="text-dark fw-bold small pb-3" width="50">#</th>
                                                <th className="text-dark fw-bold small pb-3">Name</th>
                                                <th className="text-dark fw-bold small pb-3">Status</th>
                                                <th className="text-dark fw-bold small pb-3">Created</th>
                                                <th className="text-dark fw-bold small pb-3">Updated</th>
                                                <th className="text-dark fw-bold small pb-3 text-center" width="160">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {loading ? (
                                                <tr>
                                                    <td colSpan="6" className="text-center py-5">
                                                        <div className="spinner-border text-primary" role="status">
                                                            <span className="visually-hidden">Loading...</span>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ) : filteredCategories.length === 0 ? (
                                                <tr>
                                                    <td colSpan="6" className="text-center py-5 text-muted">
                                                        No Categories Found
                                                    </td>
                                                </tr>
                                            ) : (
                                                filteredCategories.map((item, index) => (
                                                    <tr key={item.id} className="border-bottom">
                                                        <td className="py-3 text-secondary">{index + 1}</td>
                                                        <td className="py-3 fw-medium text-dark">{item.name}</td>
                                                        <td className="py-3">
                                                            {item.is_active ? (
                                                                <span className="badge rounded-pill text-bg-success bg-opacity-75 px-3 py-2 fw-semibold">
                                                                    Active
                                                                </span>
                                                            ) : (
                                                                <span className="badge rounded-pill text-bg-danger bg-opacity-75 px-3 py-2 fw-semibold">
                                                                    Inactive
                                                                </span>
                                                            )}
                                                        </td>
                                                        <td className="py-3 text-secondary small">
                                                            {item.created_at ? new Date(item.created_at).toLocaleDateString() : "9/12/2025"}
                                                        </td>
                                                        <td className="py-3 text-secondary small">
                                                            {item.updated_at ? new Date(item.updated_at).toLocaleDateString() : "9/12/2025"}
                                                        </td>
                                                        <td className="py-3 text-center">
                                                            <button 
                                                                className="btn btn-sm btn-outline-primary d-inline-flex align-items-center me-2 bg-white"
                                                                onClick={() => editCategory(item)}
                                                            >
                                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="me-1">
                                                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                                                </svg>
                                                                Edit
                                                            </button>
                                                            <button 
                                                                className="btn btn-sm btn-outline-danger d-inline-flex align-items-center bg-white"
                                                                onClick={() => deleteCategory(item.id)}
                                                            >
                                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="me-1">
                                                                    <polyline points="3 6 5 6 21 6"></polyline>
                                                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                                                </svg>
                                                                Delete
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
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

export default ManageCategory;