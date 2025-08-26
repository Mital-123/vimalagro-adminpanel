import React, { useState, useRef, useEffect } from "react";
import { FaDatabase, FaPlus, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";

function Certificates() {

    const [certificateImage, setCertificateImage] = useState(null);
    const [tableData, setTableData] = useState([]);
    const fileInputRef = useRef(null);

    useEffect(() => {
        const savedData = localStorage.getItem("certificates");
        if (savedData) {
            setTableData(JSON.parse(savedData));
        }
    }, []);

    useEffect(() => {
        if (tableData.length > 0) {
            localStorage.setItem("certificates", JSON.stringify(tableData));
        } else {
            localStorage.removeItem("certificates");
        }
    }, [tableData]);

    const handleFileChange = (e) => {
        setCertificateImage(e.target.files[0]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!certificateImage) {
            Swal.fire({
                icon: "warning",
                title: "Oops...",
                text: "Please select a certificate image before submitting!",
            });
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            const newCertificate = {
                id: Date.now(),
                image: reader.result, // 👉 base64 string
            };

            setTableData((prev) => [...prev, newCertificate]);

            Swal.fire({
                icon: "success",
                title: "Uploaded!",
                text: "Certificate image has been added successfully.",
                timer: 2000,
                showConfirmButton: false,
            });

            // reset input
            setCertificateImage(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        };

        reader.readAsDataURL(certificateImage);
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "This will delete the certificate!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
        }).then((result) => {
            if (result.isConfirmed) {
                const updatedData = tableData.filter((item) => item.id !== id);
                setTableData(updatedData);

                Swal.fire("Deleted!", "Certificate has been deleted.", "success");
            }
        });
    };

    return (
        <div className="container mt-3 mt-lg-0 mt-md-0">
            <h3 className="fw-bold text-center mb-3 mb-md-4 main-tittle">Certificate</h3>
            <form onSubmit={handleSubmit}>
                <div className="rounded-3 shadow overflow-hidden">
                    <div
                        className="p-3"
                        style={{ background: "white", borderBottom: "2px solid lightgrey" }}
                    >
                        <h6 className="fw-bold m-0 text-dark">
                            <FaPlus className="me-2" />
                            Add Certificate
                        </h6>
                    </div>
                    <div className="px-4 pb-4 pt-2 bg-white">
                        <div className="w-100 w-lg-50 w-md-50 mt-2">
                            <label className="d-block fw-bold">Certificate Image</label>
                            <input
                                type="file"
                                name="CertificateImage"
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
                        Added Certificates
                    </h6>
                </div>
                <div className="bg-white p-4 table-responsive">
                    <table className="table table-bordered border-secondary custom-table table-hover text-center">
                        <thead style={{ fontSize: "15px" }}>
                            <tr>
                                <th className="text-white" style={{ background: "var(--red)" }}>
                                    Certificate Image
                                </th>
                                <th className="text-white" style={{ background: "var(--red)" }}>
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody className="pera">
                            {tableData.length > 0 ? (
                                tableData.map((item) => (
                                    <tr key={item.id}>
                                        <td>
                                            <img
                                                src={item.image}
                                                alt="certificate"
                                                style={{
                                                    width: "60px",
                                                    height: "60px",
                                                    objectFit: "cover",
                                                }}
                                            />
                                        </td>
                                        <td>
                                            <FaTrash
                                                className="text-danger fs-5"
                                                style={{ cursor: "pointer" }}
                                                onClick={() => handleDelete(item.id)}
                                            />
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="2" className="text-center text-muted">
                                        No Certificates.
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

export default Certificates