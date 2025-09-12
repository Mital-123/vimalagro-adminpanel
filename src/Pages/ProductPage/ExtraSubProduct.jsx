import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";

const API_URL = "https://backendvimalagro.onrender.com/api/extrasubproducts";

function ExtraSubProduct() {
    const [subProducts, setSubProducts] = useState([]);
    const [products, setProducts] = useState([]);

    const [formData, setFormData] = useState({
        productId: "",
        subproductName: "",
        description: "",
        weight: "",
        subproductImg: null,
    });

    const [editingId, setEditingId] = useState(null);

    // validation
    const [errors, setErrors] = useState({});
    const [submitted, setSubmitted] = useState(false);

    // loader
    const [formSubmitting, setFormSubmitting] = useState(false);

    useEffect(() => {
        const fetchProducts = async () => {
            const res = await axios.get("https://backendvimalagro.onrender.com/api/products");
            setProducts(res.data);
        };
        fetchProducts();
    }, []);

    const fetchData = async () => {
        try {
            const res = await axios.get(API_URL);
            setSubProducts(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // ✅ validation
    const validate = () => {
        const err = {};
        if (!formData.productId) err.productId = "Product is required";
        if (!formData.subproductName.trim()) err.subproductName = "Subproduct Name is required";
        if (!formData.description.trim()) err.description = "Description is required";
        if (!formData.weight) err.weight = "Weight is required";
        if (!formData.subproductImg && !editingId) err.subproductImg = "Image is required";
        return err;
    };

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (files) {
            setFormData({ ...formData, [name]: files[0] });
            if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
        } else {
            setFormData({ ...formData, [name]: value });
            if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitted(true);

        const err = validate();
        setErrors(err);
        if (Object.keys(err).length > 0) return;

        setFormSubmitting(true);

        try {
            const fd = new FormData();
            fd.append("productId", formData.productId);

            const extras = [
                {
                    subproductName: formData.subproductName,
                    description: formData.description,
                    weight: formData.weight,
                },
            ];
            fd.append("extrasubproducts", JSON.stringify(extras));

            if (formData.subproductImg) {
                fd.append("subproductImg_0", formData.subproductImg);
            }

            if (editingId) {
                await axios.put(`${API_URL}/${editingId}`, fd);
                alert("✅ Subproduct updated!");
                setEditingId(null);
            } else {
                await axios.post(`${API_URL}/add`, fd);
                alert("✅ Subproduct added!");
            }

            setFormData({
                productId: "",
                subproductName: "",
                description: "",
                weight: "",
                subproductImg: null,
            });
            setErrors({});
            setSubmitted(false);
            fetchData();
        } catch (err) {
            console.error(err);
            alert("❌ Failed to save");
        } finally {
            setFormSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this item?")) return;
        try {
            await axios.delete(`${API_URL}/${id}`);
            fetchData();
        } catch (err) {
            console.error(err);
        }
    };

    const handleEdit = (extra) => {
        setEditingId(extra._id);
        const firstSub = extra.extrasubproducts?.[0] || {};
        setFormData({
            productId: extra.productId?._id || "",
            subproductName: firstSub.subproductName || "",
            description: firstSub.description || "",
            weight: firstSub.weight || "",
            subproductImg: null,
        });
        setErrors({});
        setSubmitted(false);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <div className="px-2">
            <h2>{editingId ? "Edit SubProduct" : "Add New SubProduct"}</h2>
            <form onSubmit={handleSubmit} noValidate>
                <div className="rounded-3 shadow overflow-hidden mb-4">
                    <div className="p-3 bg-white border-bottom">
                        <h6 className="fw-bold m-0 text-dark">
                            <FaPlus className="me-2" /> SubProduct Details
                        </h6>
                    </div>
                    <div className="px-4 pb-4 pt-2 bg-white">
                        <div className="row">
                            <div className="col-6">
                                <label className="fw-bold">Select Product</label>
                                <select name="productId" className={`form-control ${submitted && errors.productId ? "border-danger" : "border-secondary"}`} value={formData.productId} onChange={handleChange}                                >
                                    <option value="">Select Product</option>
                                    {products.map((p) => (
                                        <option key={p._id} value={p._id}>
                                            {p.productName}
                                        </option>
                                    ))}
                                </select>
                                {submitted && errors.productId && (
                                    <small className="text-danger">{errors.productId}</small>
                                )}
                            </div>
                            <div className="col-6">
                                <label className="fw-bold">Subproduct Name</label>
                                <input type="text" name="subproductName" value={formData.subproductName} onChange={handleChange} className={`form-control ${submitted && errors.subproductName ? "border-danger" : "border-secondary"}`} />
                                {submitted && errors.subproductName && (
                                    <small className="text-danger">{errors.subproductName}</small>
                                )}
                            </div>
                            <div className="col-12 mt-3">
                                <label className="fw-bold">Description</label>
                                <textarea name="description" value={formData.description} onChange={handleChange} className={`form-control ${submitted && errors.description ? "border-danger" : "border-secondary"}`} />
                                {submitted && errors.description && (
                                    <small className="text-danger">{errors.description}</small>
                                )}
                            </div>
                            <div className="col-6 mt-3">
                                <label className="fw-bold">Weight</label>
                                <input type="text" name="weight" value={formData.weight} onChange={handleChange} className={`form-control ${submitted && errors.weight ? "border-danger" : "border-secondary"}`} />
                                {submitted && errors.weight && (
                                    <small className="text-danger">{errors.weight}</small>
                                )}
                            </div>
                            <div className="col-6 mt-3">
                                <label className="fw-bold">Subproduct Image</label>
                                <input type="file" name="subproductImg" className={`form-control ${submitted && errors.subproductImg ? "border-danger" : "border-secondary"}`} onChange={handleChange} />
                                {submitted && errors.subproductImg && (
                                    <small className="text-danger">{errors.subproductImg}</small>
                                )}
                                {formData.subproductImg && (
                                    <img src={URL.createObjectURL(formData.subproductImg)} alt="preview" width="80" className="mt-2" />
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="text-center">
                    <button type="submit" className="btn btn-primary" disabled={formSubmitting}>
                        {formSubmitting ? "Saving..." : editingId ? "Save Changes" : "Save SubProduct"}                    </button>
                    {editingId && (
                        <button className="btn btn-secondary ms-2" type="button"
                            onClick={() => {
                                setEditingId(null);
                                setFormData({
                                    productId: "",
                                    subproductName: "",
                                    description: "",
                                    weight: "",
                                    subproductImg: null,
                                });
                                setErrors({});
                                setSubmitted(false);
                            }}
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </form>

            {/* Loader Overlay */}
            {formSubmitting && (
                <div className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-white bg-opacity-75">
                    <div className="spinner-border text-danger" role="status"></div>
                </div>
            )}

            {/* Subproducts Table */}
            <h3 className="mt-5">📦 All SubProducts</h3>
            <table className="table table-hover">
                <thead>
                    <tr>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Weight</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {subProducts.map((extra) =>
                        extra.extrasubproducts.map((sp, i) => (
                            <tr key={i}>
                                <td>{sp.subproductImg && <img src={sp.subproductImg} alt="" width="50" />}</td>
                                <td>{sp.subproductName}</td>
                                <td>{sp.description}</td>
                                <td>{sp.weight}</td>
                                <td>
                                    <FaEdit className="text-warning fs-5" onClick={() => handleEdit(extra)} style={{ cursor: "pointer" }} />
                                    <FaTrash className="text-danger fs-5 ms-2" onClick={() => handleDelete(extra._id)} style={{ cursor: "pointer" }} />
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default ExtraSubProduct;
