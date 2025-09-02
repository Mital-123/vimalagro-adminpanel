import React, { useState } from 'react'
import { Nav, Offcanvas } from 'react-bootstrap';
import { TiThMenu } from 'react-icons/ti';
import { Link } from 'react-router-dom';
import ButtonComponent from '../ButtonCom';
import { MdOutlineDoubleArrow } from 'react-icons/md';

function Sidebar() {

    const [showSidebar, setShowSidebar] = useState(false);

    const handleLinkClick = () => {
        setShowSidebar(false);
    };

    const logout = () => {
        localStorage.removeItem("login");
        window.location.reload();
    };

    return (
        <>
            <div className="sidebar fixed-sidebar d-flex flex-column p-4 d-none d-md-block">
                <div className='d-flex align-items-center justify-content-center'>
                    <div className="sidebar_logo p-2 shadow">
                        <img
                            src={require("../assets/Images/vimal logo.png")}
                            alt=""
                            className="img-fluid w-100 h-100 object-fit-contain"
                        />
                    </div>
                    <div className='text-white fw-bold fs-3 ms-3'>Admin <div>Panel</div></div>
                </div>
                <Nav className="flex-column p-2 pt-0">
                    <Nav.Item className="mt-4 mb-2">
                        <Link
                            to="/about"
                            className="text-decoration-none nav-item text-white"
                            onClick={handleLinkClick}
                        >
                            <MdOutlineDoubleArrow className="me-1" />
                            <span className="sidebar_menu fw-medium">About Us</span>
                        </Link>
                    </Nav.Item>
                    <Nav.Item className="mb-2">
                        <Link
                            to="/counter"
                            className="text-decoration-none nav-item text-white"
                            onClick={handleLinkClick}
                        >
                            <MdOutlineDoubleArrow className="me-1" />
                            <span className="sidebar_menu fw-medium">Counter</span>
                        </Link>
                    </Nav.Item>
                    <Nav.Item className='mb-2'>
                        <Link
                            to="/testimonial"
                            className="text-decoration-none nav-item text-white"
                            onClick={handleLinkClick}
                        >
                            <MdOutlineDoubleArrow className="me-1" />
                            <span className="sidebar_menu fw-medium">Testimonial</span>
                        </Link>
                    </Nav.Item>
                    <Nav.Item className='mb-2'>
                        <Link
                            to="/certificate"
                            className="text-decoration-none nav-item text-white"
                            onClick={handleLinkClick}
                        >
                            <MdOutlineDoubleArrow className="me-1" />
                            <span className="sidebar_menu fw-medium">Certificate</span>
                        </Link>
                    </Nav.Item>
                    <Nav.Item className='mb-2'>
                        <Link
                            to="/faq"
                            className="text-decoration-none nav-item text-white"
                            onClick={handleLinkClick}
                        >
                            <MdOutlineDoubleArrow className="me-1" />
                            <span className="sidebar_menu fw-medium">Faq</span>
                        </Link>
                    </Nav.Item>
                    <Nav.Item className='mb-2'>
                        <Link
                            to="/productAdminToggle"
                            className="text-decoration-none nav-item text-white"
                            onClick={handleLinkClick}
                        >
                            <MdOutlineDoubleArrow className="me-1" />
                            <span className="sidebar_menu fw-medium">Add Product</span>
                        </Link>
                    </Nav.Item>
                    <Nav.Item className='mb-2'>
                        <Link
                            to="/ProductData"
                            className="text-decoration-none nav-item text-white"
                            onClick={handleLinkClick}
                        >
                            <MdOutlineDoubleArrow className="me-1" />
                            <span className="sidebar_menu fw-medium">Product Data</span>
                        </Link>
                    </Nav.Item>
                </Nav>
                <div className="logout-btn">
                    <ButtonComponent btn="Log Out" onClick={logout} />
                </div>
            </div>

            <Offcanvas
                show={showSidebar}
                onHide={() => setShowSidebar(false)}
                className="sidebar fixed-sidebar"
            >
                <Offcanvas.Header closeButton className="mt-3 mx-2"></Offcanvas.Header>
                <Offcanvas.Body className="mx-2">
                    <div className='d-flex align-items-center'>
                        <div className="sidebar_logo p-2 shadow">
                            <img
                                src={require("../assets/Images/vimal logo.png")}
                                alt=""
                                className="img-fluid w-100 h-100 object-fit-contain"
                            />
                        </div>
                        <div className='text-white fw-bold fs-3 ms-3'>Admin <div>Panel</div></div>
                    </div>
                    <Nav className="flex-column p-2">
                        <Nav.Item className="mt-4 mb-2">
                            <Link
                                to="/about"
                                className="text-decoration-none nav-item text-white"
                                onClick={handleLinkClick}
                            >
                                <MdOutlineDoubleArrow className="me-1" />
                                <span className="sidebar_menu fw-medium">About Us</span>
                            </Link>
                        </Nav.Item>
                        <Nav.Item className="mb-2">
                            <Link
                                to="/counter"
                                className="text-decoration-none nav-item text-white"
                                onClick={handleLinkClick}
                            >
                                <MdOutlineDoubleArrow className="me-1" />
                                <span className="sidebar_menu fw-medium">Counter</span>
                            </Link>
                        </Nav.Item>
                        <Nav.Item className='mb-2'>
                            <Link
                                to="/testimonial"
                                className="text-decoration-none nav-item text-white"
                                onClick={handleLinkClick}
                            >
                                <MdOutlineDoubleArrow className="me-1" />
                                <span className="sidebar_menu fw-medium">Testimonial</span>
                            </Link>
                        </Nav.Item>
                        <Nav.Item className='mb-2'>
                            <Link
                                to="/certificate"
                                className="text-decoration-none nav-item text-white"
                                onClick={handleLinkClick}
                            >
                                <MdOutlineDoubleArrow className="me-1" />
                                <span className="sidebar_menu fw-medium">Certificate</span>
                            </Link>
                        </Nav.Item>
                        <Nav.Item className='mb-2'>
                            <Link
                                to="/faq"
                                className="text-decoration-none nav-item text-white"
                                onClick={handleLinkClick}
                            >
                                <MdOutlineDoubleArrow className="me-1" />
                                <span className="sidebar_menu fw-medium">Faq</span>
                            </Link>
                        </Nav.Item>
                        <Nav.Item className='mb-2'>
                            <Link
                                to="/productAdminToggle"
                                className="text-decoration-none nav-item text-white"
                                onClick={handleLinkClick}
                            >
                                <MdOutlineDoubleArrow className="me-1" />
                                <span className="sidebar_menu fw-medium">Add Product</span>
                            </Link>
                        </Nav.Item>
                        <Nav.Item className='mb-2'>
                            <Link
                                to="/ProductData"
                                className="text-decoration-none nav-item text-white"
                                onClick={handleLinkClick}
                            >
                                <MdOutlineDoubleArrow className="me-1" />
                                <span className="sidebar_menu fw-medium">Product Data</span>
                            </Link>
                        </Nav.Item>
                    </Nav>
                </Offcanvas.Body>
            </Offcanvas>

            <div className="d-md-none position-fixed top-0 start-50 translate-middle-x p-2 z-index-999 w-100 bg-dark d-flex justify-content-between align-items-center">
                <TiThMenu
                    className="text-white fs-1 p-1 rounded-2"
                    style={{ width: "40px", height: "40px", background: "var(--red)" }}
                    onClick={() => setShowSidebar(true)}
                />
                <ButtonComponent btn="Log Out" onClick={logout} />
            </div>
        </>
    )
}

export default Sidebar