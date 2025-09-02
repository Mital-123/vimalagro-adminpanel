import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { FaEdit, FaEye, FaTrash } from 'react-icons/fa'

function MainProductData() {

    const [tableData, setTableData] = useState([]);

    useEffect(() => {
        axios
            .get("https://backendvimalagro.onrender.com/api/products")
            .then((res) => {
                setTableData(res.data || []);
            })
            .catch((err) => {
                console.error("Error fetching products:", err);
            });
    }, []);

    return (
        <>
            <div className="container mt-3 mt-lg-0 mt-md-0">
                <h3 className="fw-bold text-center mb-3 mb-md-4 main-tittle">Product Data</h3>
                <div className='table-responsive'>
                    <table className="table table-bordered border-secondary custom-table table-hover text-center">
                        <thead className='pera'>
                            <tr>
                                <th
                                    className="text-white"
                                    style={{ width: "5%", background: "var(--red)" }}
                                >
                                    Sr. No.
                                </th>
                                <th
                                    className="text-white"
                                    style={{ width: "25%", background: "var(--red)" }}
                                >
                                    Product Image
                                </th>
                                <th
                                    className="text-white"
                                    style={{ width: "20%", background: "var(--red)" }}
                                >
                                    Product Name
                                </th>
                                <th
                                    className="text-white"
                                    style={{ width: "15%", background: "var(--red)" }}
                                >
                                    Product Size
                                </th>
                                <th
                                    className="text-white"
                                    style={{ width: "5%", background: "var(--red)" }}
                                >
                                    Product Banner
                                </th>
                                <th
                                    className="text-white"
                                    style={{ width: "5%", background: "var(--red)" }}
                                >
                                    Banner 2
                                </th>
                                <th
                                    className="text-white"
                                    style={{ width: "15%", background: "var(--red)" }}
                                >
                                    How To Make Banner
                                </th>
                                <th
                                    className="text-white"
                                    style={{ width: "10%", background: "var(--red)" }}
                                >
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody className="pera">
                            {tableData.length > 0 ? (
                                tableData.map((item, index) => (
                                    <tr key={item._id}>
                                        <td style={{ width: "5%" }}>{index + 1}</td>
                                        <td style={{ width: "25%" }}>
                                            {item.productImages?.length > 0 &&
                                                item.productImages.map((img, i) => (
                                                    <img
                                                        key={i}
                                                        src={img}
                                                        alt={`product-${i}`}
                                                        style={{
                                                            width: "60px",
                                                            height: "60px",
                                                            objectFit: "contain",
                                                            marginRight: "6px"
                                                        }}
                                                    />
                                                ))}
                                        </td>
                                        <td style={{ width: "20%" }}>{item.productName}</td>
                                        <td style={{ width: "15%" }}>
                                            {item.productSizes?.length > 0 ? item.productSizes.join(", ") : ""}
                                        </td>
                                        <td style={{ width: "5%" }}>
                                            {item.productBanner && (
                                                <img
                                                    src={item.productBanner}
                                                    alt="banner"
                                                    style={{ width: "60px", height: "60px", objectFit: "contain" }}
                                                />
                                            )}
                                        </td>
                                        <td style={{ width: "5%" }}>
                                            {item.banner2 && (
                                                <img
                                                    src={item.banner2}
                                                    alt="banner2"
                                                    style={{ width: "60px", height: "60px", objectFit: "contain" }}
                                                />
                                            )}
                                        </td>
                                        <td style={{ width: "15%" }}>
                                            {item.howToMakeBanner && (
                                                <img
                                                    src={item.howToMakeBanner}
                                                    alt="howToMake"
                                                    style={{ width: "60px", height: "60px", objectFit: "contain" }}
                                                />
                                            )}
                                        </td>
                                        <td style={{ width: "10%" }}>
                                            <div>
                                                <FaEye
                                                    className="text-info fs-5"
                                                    style={{ cursor: "pointer" }}
                                                />
                                            </div>
                                            <div className='mt-1 mb-2'>
                                                <FaEdit
                                                    className="text-warning fs-5"
                                                    style={{ cursor: "pointer" }}
                                                />
                                            </div>
                                            <div>
                                                <FaTrash
                                                    className="text-danger fs-5"
                                                    style={{ cursor: "pointer" }}
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8" className="text-center text-muted">
                                        No Product Data Found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}

export default MainProductData