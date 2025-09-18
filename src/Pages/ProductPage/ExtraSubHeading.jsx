import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaPlus } from "react-icons/fa";

const API_URL = "http://localhost:8000/api/heading";

function ExtraSubHeading() {

    const [products, setProducts] = useState([]);
    const [formData, setFormData] = useState({
        productId: "",
        subproductTitle: "",
    });

    const [errors, setErrors] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [formSubmitting, setFormSubmitting] = useState(false);

    // 🔹 Fetch product list for dropdown
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await axios.get("https://backendvimalagro.onrender.com/api/products"); // your Product API
                setProducts(res.data);
            } catch (err) {
                console.error("Error fetching products", err);
            }
        };
        fetchProducts();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
    };

    const validate = () => {
        let newErrors = {};
        if (!formData.productId) newErrors.productId = "Please select a product.";
        if (!formData.subproductTitle.trim())
            newErrors.subproductTitle = "Subproduct Title is required.";
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitted(true);

        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setFormSubmitting(true);
        try {
            await axios.post(API_URL, formData);
            alert("✅ SubProduct Heading saved successfully!");
            setFormData({ productId: "", subproductTitle: "" });
            setSubmitted(false);
        } catch (err) {
            console.error("Error saving subproduct heading", err);

            if (err.response && err.response.status === 400) {
                // Backend duplicate error
                if (
                    err.response.data.error?.includes("already exists") ||
                    err.response.data.error?.includes("duplicate key")
                ) {
                    alert("⚠️ This subproduct title already exists for the selected product.");
                } else {
                    alert("❌ " + err.response.data.error);
                }
            } else {
                alert("❌ Failed to save subproduct heading.");
            }
        } finally {
            setFormSubmitting(false);
        }
    };

    return (
        <div className="container mt-3 mt-lg-0 mt-md-0">
            <form onSubmit={handleSubmit} noValidate>
                <div className="rounded-3 shadow overflow-hidden">
                    <div className="p-3"
                        style={{ background: "white", borderBottom: "2px solid lightgrey" }}>
                        <h6 className="fw-bold m-0 text-dark">
                            <FaPlus className="me-2" /> SubProduct Details
                        </h6>
                    </div>
                    <div className="px-4 pb-4 pt-2 bg-white">
                        <div className="d-lg-flex d-md-flex gap-3">
                            <div className="w-100 w-lg-50 w-md-50 mt-2">
                                <label className="d-block fw-bold">Select Product</label>
                                <select
                                    name="productId"
                                    className="mt-1 w-100 form-control border border-secondary"
                                    value={formData.productId}
                                    onChange={handleChange}
                                >
                                    <option value="">Select Product</option>
                                    {products.map((p) => (
                                        <option key={p._id} value={p._id}>
                                            {p.productName}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="w-100 w-lg-50 w-md-50 mt-2">
                                <label className="d-block fw-bold">SubProduct Tittle</label>
                                <input
                                    type="text"
                                    name="subproductTitle"
                                    placeholder="Enter SubProduct Tittle"
                                    value={formData.subproductTitle}
                                    onChange={handleChange}
                                    className="mt-1 w-100 form-control border border-secondary"
                                />
                            </div>
                        </div>
                        <div className="mt-3 text-center">
                            <button
                                type="submit"
                                className="px-4 py-1 fw-bold text-uppercase rounded-3 adminbtn shadow"
                                disabled={formSubmitting}
                            >
                                <span>{formSubmitting ? "Update" : "Submit"}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </form>

            {/* Loader Overlay */}
            {formSubmitting && (
                <div className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-white bg-opacity-75">
                    <div className="spinner-border text-danger" role="status"></div>
                </div>
            )}
        </div>
    );
}

export default ExtraSubHeading;
