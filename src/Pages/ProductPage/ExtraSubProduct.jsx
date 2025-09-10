import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";

const API_URL = "https://backendvimalagro.onrender.com/api/extrasubproducts"; // update if deployed

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

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (files) {
            setFormData({ ...formData, [name]: files[0] });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const fd = new FormData();
            fd.append("productId", formData.productId); // ✅ send productId

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
                setEditingId(null);
            } else {
                await axios.post(`${API_URL}/add`, fd);
            }

            setFormData({
                productId: "",   // ✅ reset productId
                subproductName: "",
                description: "",
                weight: "",
                subproductImg: null,
            });

            fetchData();
        } catch (err) {
            console.error(err);
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
            productId: extra.productId?._id || "", // ✅ populate productId
            subproductName: firstSub.subproductName || "",
            description: firstSub.description || "",
            weight: firstSub.weight || "",
            subproductImg: null,
        });
    };

    return (
        <div className="container py-4">
            <h2 className="mb-4">{editingId ? "Edit SubProduct" : "Add SubProduct"}</h2>

            <form onSubmit={handleSubmit} className="mb-4">
                <div className="mb-3">
                    <select
                        name="productId"
                        className="form-control"
                        value={formData.productId}
                        onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                        required
                    >
                        <option value="">Select Product</option>
                        {products.map((p) => (
                            <option key={p._id} value={p._id}>
                                {p.productName}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-3">
                    <input
                        type="text"
                        name="subproductName"
                        className="form-control"
                        placeholder="Subproduct Name"
                        value={formData.subproductName}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <textarea
                        name="description"
                        className="form-control"
                        placeholder="Description"
                        value={formData.description}
                        onChange={handleChange}
                    ></textarea>
                </div>
                <div className="mb-3">
                    <input
                        type="text"
                        name="weight"
                        className="form-control"
                        placeholder="Weight"
                        value={formData.weight}
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-3">
                    <input
                        type="file"
                        name="subproductImg"
                        className="form-control"
                        onChange={handleChange}
                    />
                </div>
                <button className="btn btn-primary" type="submit">
                    {editingId ? "Update" : "Add"}
                </button>
                {editingId && (
                    <button
                        className="btn btn-secondary ms-2"
                        type="button"
                        onClick={() => setEditingId(null)}
                    >
                        Cancel
                    </button>
                )}
            </form>

            <h3>SubProducts List</h3>
            <div className="row">
                <table className="table table-bordered table-striped mb-4 text-center">
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
                        {subProducts.map((extra,) =>
                            extra.extrasubproducts.map((sp, i) => (
                                <tr key={i}>
                                    <td>{sp.subproductImg && <img src={sp.subproductImg} alt="" width="50" />}</td>
                                    <td>{sp.subproductName}</td>
                                    <td>{sp.description}</td>
                                    <td>{sp.weight}</td>
                                    <td>
                                        <FaEdit
                                            className="text-warning fs-5"
                                            onClick={() => handleEdit(extra)}
                                        />

                                        <FaTrash
                                            className="text-danger fs-5 ms-0 ms-md-2"
                                            onClick={() => handleDelete(extra._id)}
                                        />
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>

            </div>
        </div>
    );
}

export default ExtraSubProduct;
