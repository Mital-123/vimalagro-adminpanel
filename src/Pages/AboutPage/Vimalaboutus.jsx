import React, { useState, useRef, useEffect } from "react";
import { FaDatabase, FaPlus, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
import axios from "axios";

const API_URL = "https://backendvimalagro.onrender.com/vimalabout";

function Vimalaboutus() {
    const [aboutImage, setAboutImage] = useState(null);
    const [tableData, setTableData] = useState([]);
    const fileInputRef = useRef(null);

    // ✅ Fetch About Us Images (GET)
    useEffect(() => {
        fetchAboutImages();
    }, []);

    const fetchAboutImages = async () => {
        try {
            const res = await axios.get(API_URL);
            const sorted = res.data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            setTableData(sorted);
        } catch (error) {
            console.error("Error fetching About Us images:", error);
        }
    };

    // ✅ File change handler
    const handleFileChange = (e) => {
        setAboutImage(e.target.files[0]);
    };

    // ✅ Add About Us Image (POST)
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!aboutImage) {
            Swal.fire({
                icon: "warning",
                title: "Oops...",
                text: "Please select an image before submitting!",
            });
            return;
        }

        const formData = new FormData();
        formData.append("vimalaboutimage", aboutImage); // ✅ backend expects this key

        try {
            await axios.post(API_URL, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            Swal.fire({
                icon: "success",
                title: "Uploaded!",
                text: "About Us image has been added successfully.",
                timer: 2000,
                showConfirmButton: false,
            });

            setAboutImage(null);
            if (fileInputRef.current) fileInputRef.current.value = "";

            fetchAboutImages(); // refresh list
        } catch (error) {
            console.error("Error uploading About Us image:", error);
            Swal.fire("Error", "Failed to upload About Us image", "error");
        }
    };

    // ✅ Delete About Us Image (DELETE)
    const handleDelete = async (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "This will delete the image!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`${API_URL}/${id}`);
                    fetchAboutImages(); // refresh list

                    Swal.fire({
                        title: "Deleted!",
                        text: "Image has been deleted.",
                        icon: "success",
                        timer: 2000,
                        showConfirmButton: false,
                    });
                } catch (error) {
                    console.error("Error deleting image:", error);
                    Swal.fire("Error", "Failed to delete image", "error");
                }
            }
        });
    };

    return (
        <div className="container mt-3 mt-lg-0 mt-md-0">
            <h3 className="fw-bold text-center mb-3 mb-md-4 main-tittle">Vimal About Us</h3>
            <form onSubmit={handleSubmit}>
                <div className="rounded-3 shadow overflow-hidden">
                    <div
                        className="p-3"
                        style={{ background: "white", borderBottom: "2px solid lightgrey" }}
                    >
                        <h6 className="fw-bold m-0 text-dark">
                            <FaPlus className="me-2" />
                            Add About Us Image
                        </h6>
                    </div>
                    <div className="px-4 pb-4 pt-2 bg-white">
                        <div className="w-100 w-lg-50 w-md-50 mt-2">
                            <label className="d-block fw-bold">About Us Image</label>
                            <input
                                type="file"
                                name="vimalaboutimage"
                                accept="image/*"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                className="mt-1 w-100 form-control border border-secondary"
                            />
                        </div>
                        <div className="mt-3 text-center">
                            <button
                                type="submit"
                                className="px-4 py-1 fw-bold text-uppercase rounded-3 adminbtn shadow"
                            >
                                <span>Submit</span>
                            </button>
                        </div>
                    </div>
                </div>
            </form>

            <div className="rounded-3 shadow overflow-hidden my-4">
                <div
                    className="p-3"
                    style={{ background: "white", borderBottom: "2px solid lightgrey" }}
                >
                    <h6 className="fw-bold m-0 text-dark">
                        <FaDatabase className="me-2" />
                        Added About Us Images
                    </h6>
                </div>
                <div className="bg-white p-4 table-responsive">
                    <table className="table table-bordered border-secondary custom-table table-hover text-center">
                        <thead style={{ fontSize: "15px" }}>
                            <tr>
                                <th className="text-white" style={{ background: "var(--red)" }}>
                                    About Us Image
                                </th>
                                <th className="text-white" style={{ background: "var(--red)" }}>
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody className="pera">
                            {tableData.length > 0 ? (
                                tableData.map((item) => (
                                    <tr key={item._id}>
                                        <td>
                                            <img
                                                src={item.vimalaboutimage}   // ✅ fixed key
                                                alt="About Us"
                                                style={{
                                                    width: "60px",
                                                    height: "60px",
                                                    objectFit: "cover",
                                                }}
                                            />
                                        </td>
                                        <td className="">
                                            <FaTrash
                                                className="text-danger fs-5 d-flex align-items-center justify-content-center"
                                                style={{ cursor: "pointer" }}
                                                onClick={() => handleDelete(item._id)}
                                            />
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="2" className="text-center text-muted">
                                        No About Us Images.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Vimalaboutus;
