import React, { useState, useEffect, useRef } from "react";
import { FaDatabase, FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";

function Testimonial() {

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        CustomerImage: null,
    });

    const [tableData, setTableData] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        const storedData = JSON.parse(localStorage.getItem("testimonialData")) || [];
        setTableData(storedData);
    }, []);

    const handleChange = (e) => {
        const { name, value, files } = e.target;

        if (name === "CustomerImage") {
            setFormData({ ...formData, [name]: files[0] });
        } else if (name === "description") {
            // check word count (max 25 words)
            const words = value.trim().split(/\s+/);
            if (words.length <= 25) {
                setFormData({ ...formData, description: value });
            }
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.name || !formData.description || (!formData.CustomerImage && !isEditing)) {
            Swal.fire({
                icon: "warning",
                title: "All Fields Required!",
                text: "Please fill all fields before submitting.",
            });
            return;
        }

        if (isEditing) {
            // EDIT FUNCTIONALITY
            let updatedData = [...tableData];

            if (formData.CustomerImage) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    updatedData = updatedData.map((item) =>
                        item.id === editId
                            ? { ...item, name: formData.name, description: formData.description, image: reader.result }
                            : item
                    );
                    setTableData(updatedData);
                    localStorage.setItem("testimonialData", JSON.stringify(updatedData));

                    Swal.fire({
                        icon: "success",
                        title: "Updated!",
                        text: "Testimonial updated successfully.",
                        timer: 2000,
                        showConfirmButton: false,
                    });
                };
                reader.readAsDataURL(formData.CustomerImage);
            } else {
                updatedData = updatedData.map((item) =>
                    item.id === editId ? { ...item, name: formData.name, description: formData.description } : item
                );
                setTableData(updatedData);
                localStorage.setItem("testimonialData", JSON.stringify(updatedData));

                Swal.fire({
                    icon: "success",
                    title: "Updated!",
                    text: "Testimonial updated successfully.",
                    timer: 2000,
                    showConfirmButton: false,
                });
            }

            setIsEditing(false);
            setEditId(null);
        } else {
            // ADD FUNCTIONALITY
            const reader = new FileReader();
            reader.onloadend = () => {
                const newData = {
                    id: Date.now(),
                    name: formData.name,
                    description: formData.description,
                    image: reader.result, // base64 image
                };

                const updatedData = [...tableData, newData];
                setTableData(updatedData);
                localStorage.setItem("testimonialData", JSON.stringify(updatedData));

                Swal.fire({
                    icon: "success",
                    title: "Added!",
                    text: "Testimonial added successfully.",
                    timer: 2000,
                    showConfirmButton: false,
                });
            };
            reader.readAsDataURL(formData.CustomerImage);
        }

        // reset form
        setFormData({ name: "", description: "", CustomerImage: null });
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    // delete testimonial
    const handleDelete = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
        }).then((result) => {
            if (result.isConfirmed) {
                const updatedData = tableData.filter((item) => item.id !== id);
                setTableData(updatedData);
                localStorage.setItem("testimonialData", JSON.stringify(updatedData));

                Swal.fire({
                    icon: "success",
                    title: "Deleted!",
                    text: "Testimonial has been deleted.",
                    timer: 2000,
                    showConfirmButton: false,
                });
            }
        });
    };

    // edit testimonial
    const handleEdit = (item) => {
        setFormData({
            name: item.name,
            description: item.description,
            CustomerImage: null,
        });
        setIsEditing(true);
        setEditId(item.id);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    return (
        <div className="container mt-3 mt-lg-0 mt-md-0">
            <h3 className="fw-bold text-center mb-3 mb-md-4 main-tittle">Testimonial</h3>
            <form onSubmit={handleSubmit}>
                <div className="rounded-3 shadow overflow-hidden">
                    <div className="p-3" style={{ background: "white", borderBottom: "2px solid lightgrey" }}>
                        <h6 className="fw-bold m-0 text-dark">
                            <FaPlus className="me-2" />
                            {isEditing ? "Edit Testimonial" : "Add Testimonial Details"}
                        </h6>
                    </div>
                    <div className="px-4 pb-4 pt-2 bg-white">
                        <div className="d-lg-flex d-md-flex gap-3">
                            <div className="w-100 w-lg-50 w-md-50 mt-2">
                                <label className="d-block fw-bold">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="mt-1 w-100 form-control border border-secondary"
                                    placeholder="Enter Name"
                                />
                            </div>
                            <div className="w-100 w-lg-50 w-md-50 mt-2">
                                <label className="d-block fw-bold">Image</label>
                                <input
                                    type="file"
                                    name="CustomerImage"
                                    ref={fileInputRef}
                                    onChange={handleChange}
                                    className="mt-1 w-100 form-control border border-secondary"
                                />
                            </div>
                        </div>
                        <div className="w-100 w-lg-50 w-md-50 mt-2">
                            <label className="d-block fw-bold">Review</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                className="mt-1 w-100 form-control border border-secondary"
                                placeholder="Enter Review (Max 25 words)"
                            ></textarea>
                        </div>
                        <div className="mt-3 text-center">
                            <button type="submit" className="px-4 py-1 fw-bold text-uppercase rounded-3 adminbtn shadow">
                                <span>{isEditing ? "Update" : "Submit"}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </form>

            <div className="rounded-3 shadow overflow-hidden my-4">
                <div className="p-3" style={{ background: "white", borderBottom: "2px solid lightgrey" }}>
                    <h6 className="fw-bold m-0 text-dark">
                        <FaDatabase className="me-2" />
                        Testimonial Data
                    </h6>
                </div>
                <div className="bg-white p-4 table-responsive">
                    <table className="table table-bordered border-secondary custom-table table-hover text-center">
                        <thead style={{ fontSize: "15px" }}>
                            <tr>
                                <th className="text-white" style={{ width: "10%", background: "var(--red)" }}>Sr. No.</th>
                                <th className="text-white" style={{ width: "10%", background: "var(--red)" }}>Image</th>
                                <th className="text-white" style={{ width: "20%", background: "var(--red)" }}>Name</th>
                                <th className="text-white" style={{ width: "50%", background: "var(--red)" }}>Description</th>
                                <th className="text-white" style={{ width: "10%", background: "var(--red)" }}>Action</th>
                            </tr>
                        </thead>
                        <tbody className="pera">
                            {tableData.length > 0 ? (
                                tableData.map((item, index) => (
                                    <tr key={item.id}>
                                        <td style={{ width: "10%" }}>{index + 1}</td>
                                        <td style={{ width: "10%" }}>
                                            <img src={item.image} alt={item.name} style={{ width: "40px", height: "40px", objectFit: "cover" }} />
                                        </td>
                                        <td style={{ width: "20%" }}>{item.name}</td>
                                        <td style={{ width: "50%" }}>{item.description}</td>
                                        <td style={{ width: "10%" }}>
                                            <FaEdit onClick={() => handleEdit(item)} className="text-warning fs-5" style={{ cursor: "pointer" }} />
                                            <FaTrash onClick={() => handleDelete(item.id)} className="text-danger fs-5 ms-0 ms-md-2" style={{ cursor: "pointer" }} />
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center text-muted">No Testimonial Data Found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Testimonial