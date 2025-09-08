import React, { useState } from 'react';
import { Nav, Offcanvas } from 'react-bootstrap';
import { TiThMenu } from 'react-icons/ti';
import { Link } from 'react-router-dom';
import ButtonComponent from '../ButtonCom';
import { MdOutlineDoubleArrow } from 'react-icons/md';
import { IoIosArrowDropdownCircle } from 'react-icons/io';

function Sidebar() {

    const [showSidebar, setShowSidebar] = useState(false);
    const [showHomeMenu, setShowHomeMenu] = useState(false);
    const [showAboutMenu, setShowAboutMenu] = useState(false);
    const [showProductMenu, setShowProductMenu] = useState(false);

    const handleHomeClick = () => {
        setShowHomeMenu(prev => !prev);
        if (!showHomeMenu) {
            setShowAboutMenu(false);
            setShowProductMenu(false);
        }
    };

    const handleAboutClick = () => {
        setShowAboutMenu(prev => !prev);
        if (!showAboutMenu) {
            setShowHomeMenu(false);
            setShowProductMenu(false);
        }
    };

    const handleProductClick = () => {
        setShowProductMenu(prev => !prev);
        if (!showProductMenu) {
            setShowHomeMenu(false);
            setShowAboutMenu(false);
        }
    };

    const handleLinkClick = () => {
        setShowSidebar(false);
        setShowHomeMenu(false);
        setShowAboutMenu(false);
        setShowProductMenu(false);
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
                <div className='p-2 ps-2'>
                    {/* Home Menu */}
                    <div className="text-white">
                        <div className="mt-2 mb-1 d-flex align-items-center fw-medium" style={{ cursor: 'pointer' }} onClick={handleHomeClick}>
                            Home
                            <span className="ms-auto"><IoIosArrowDropdownCircle /></span>
                        </div>
                        {showHomeMenu && (
                            <Nav className="flex-column bg-white ps-2 rounded-3">
                                <Nav.Item className="mb-2 mt-2">
                                    <Link to="/about" className="text-decoration-none nav-item" style={{ color: "var(--red)" }} onClick={handleLinkClick}>
                                        <MdOutlineDoubleArrow className="me-1" />
                                        <span className="sidebar_menu fw-medium">About Us</span>
                                    </Link>
                                </Nav.Item>
                                <Nav.Item className="mb-2">
                                    <Link to="/counter" className="text-decoration-none nav-item" style={{ color: "var(--red)" }} onClick={handleLinkClick}>
                                        <MdOutlineDoubleArrow className="me-1" />
                                        <span className="sidebar_menu fw-medium">Counter</span>
                                    </Link>
                                </Nav.Item>
                                <Nav.Item className="mb-2">
                                    <Link to="/testimonial" className="text-decoration-none nav-item" style={{ color: "var(--red)" }} onClick={handleLinkClick}>
                                        <MdOutlineDoubleArrow className="me-1" />
                                        <span className="sidebar_menu fw-medium">Testimonial</span>
                                    </Link>
                                </Nav.Item>
                                <Nav.Item className="mb-2">
                                    <Link to="/certificate" className="text-decoration-none nav-item" style={{ color: "var(--red)" }} onClick={handleLinkClick}>
                                        <MdOutlineDoubleArrow className="me-1" />
                                        <span className="sidebar_menu fw-medium">Certificate</span>
                                    </Link>
                                </Nav.Item>
                            </Nav>
                        )}
                    </div>

                    {/* About Menu */}
                    <div className="text-white">
                        <div className="mt-2 mb-1 d-flex align-items-center fw-medium" style={{ cursor: 'pointer' }} onClick={handleAboutClick}>
                            About
                            <span className="ms-auto"><IoIosArrowDropdownCircle /></span>
                        </div>
                        {showAboutMenu && (
                            <Nav className="flex-column bg-white ps-2 rounded-3">
                                <Nav.Item className='mb-2 mt-2'>
                                    <Link to="/vimalaboutus" className="text-decoration-none nav-item" style={{ color: "var(--red)" }} onClick={handleLinkClick}>
                                        <MdOutlineDoubleArrow className="me-1" />
                                        <span className="sidebar_menu fw-medium">vimal About Us</span>
                                    </Link>
                                </Nav.Item>
                                <Nav.Item className='mb-2'>
                                    <Link to="/leaderlogo" className="text-decoration-none nav-item" style={{ color: "var(--red)" }} onClick={handleLinkClick}>
                                        <MdOutlineDoubleArrow className="me-1" />
                                        <span className="sidebar_menu fw-medium">Leader logo</span>
                                    </Link>
                                </Nav.Item>
                                <Nav.Item className='mb-2'>
                                    <Link to="/ourstory" className="text-decoration-none nav-item" style={{ color: "var(--red)" }} onClick={handleLinkClick}>
                                        <MdOutlineDoubleArrow className="me-1" />
                                        <span className="sidebar_menu fw-medium">Our Story</span>
                                    </Link>
                                </Nav.Item>
                                <Nav.Item className="mb-2">
                                    <Link to="/faq" className="text-decoration-none nav-item" style={{ color: "var(--red)" }} onClick={handleLinkClick}>
                                        <MdOutlineDoubleArrow className="me-1" />
                                        <span className="sidebar_menu fw-medium">Faq</span>
                                    </Link>
                                </Nav.Item>
                            </Nav>
                        )}
                    </div>

                    {/* Product Menu */}
                    <div className="text-white">
                        <div className="mt-2 mb-1 d-flex align-items-center fw-medium" style={{ cursor: 'pointer' }} onClick={handleProductClick}>
                            Product
                            <span className="ms-auto"><IoIosArrowDropdownCircle /></span>
                        </div>
                        {showProductMenu && (
                            <Nav className="flex-column bg-white ps-2 rounded-3">
                                <Nav.Item className='mb-2 mt-2'>
                                    <Link to="/productAdminToggle" className="text-decoration-none nav-item" style={{ color: "var(--red)" }} onClick={handleLinkClick}>
                                        <MdOutlineDoubleArrow className="me-1" />
                                        <span className="sidebar_menu fw-medium">Add Product</span>
                                    </Link>
                                </Nav.Item>
                                <Nav.Item className='mb-2'>
                                    <Link to="/ProductData" className="text-decoration-none nav-item" style={{ color: "var(--red)" }} onClick={handleLinkClick}>
                                        <MdOutlineDoubleArrow className="me-1" />
                                        <span className="sidebar_menu fw-medium">Product Data</span>
                                    </Link>
                                </Nav.Item>
                            </Nav>
                        )}
                    </div>
                </div>
                <div className="logout-btn mt-auto">
                    <ButtonComponent btn="Log Out" onClick={logout} />
                </div>
            </div>

            {/* Sidebar for smaller screens */}
            <Offcanvas show={showSidebar} onHide={() => setShowSidebar(false)} className="sidebar fixed-sidebar">
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
                    <div className='p-2 ps-2'>
                        {/* Home Menu */}
                        <div className="text-white">
                            <div className="mt-2 mb-1 d-flex align-items-center fw-medium" style={{ cursor: 'pointer' }} onClick={handleHomeClick}>
                                Home
                                <span className="ms-auto"><IoIosArrowDropdownCircle /></span>
                            </div>
                            {showHomeMenu && (
                                <Nav className="flex-column bg-white ps-2 rounded-3">
                                    <Nav.Item className="mb-2 mt-2">
                                        <Link to="/about" className="text-decoration-none nav-item" style={{ color: "var(--red)" }} onClick={handleLinkClick}>
                                            <MdOutlineDoubleArrow className="me-1" />
                                            <span className="sidebar_menu fw-medium">About Us</span>
                                        </Link>
                                    </Nav.Item>
                                    <Nav.Item className="mb-2">
                                        <Link to="/counter" className="text-decoration-none nav-item" style={{ color: "var(--red)" }} onClick={handleLinkClick}>
                                            <MdOutlineDoubleArrow className="me-1" />
                                            <span className="sidebar_menu fw-medium">Counter</span>
                                        </Link>
                                    </Nav.Item>
                                    <Nav.Item className="mb-2">
                                        <Link to="/testimonial" className="text-decoration-none nav-item" style={{ color: "var(--red)" }} onClick={handleLinkClick}>
                                            <MdOutlineDoubleArrow className="me-1" />
                                            <span className="sidebar_menu fw-medium">Testimonial</span>
                                        </Link>
                                    </Nav.Item>
                                    <Nav.Item className="mb-2">
                                        <Link to="/certificate" className="text-decoration-none nav-item" style={{ color: "var(--red)" }} onClick={handleLinkClick}>
                                            <MdOutlineDoubleArrow className="me-1" />
                                            <span className="sidebar_menu fw-medium">Certificate</span>
                                        </Link>
                                    </Nav.Item>
                                </Nav>
                            )}
                        </div>

                        {/* About Menu */}
                        <div className="text-white">
                            <div className="mt-2 mb-1 d-flex align-items-center fw-medium" style={{ cursor: 'pointer' }} onClick={handleAboutClick}>
                                About
                                <span className="ms-auto"><IoIosArrowDropdownCircle /></span>
                            </div>
                            {showAboutMenu && (
                                <Nav className="flex-column bg-white ps-2 rounded-3">
                                    <Nav.Item className='mb-2 mt-2'>
                                        <Link to="/vimalaboutus" className="text-decoration-none nav-item" style={{ color: "var(--red)" }} onClick={handleLinkClick}>
                                            <MdOutlineDoubleArrow className="me-1" />
                                            <span className="sidebar_menu fw-medium">vimal About Us</span>
                                        </Link>
                                    </Nav.Item>
                                    <Nav.Item className='mb-2'>
                                        <Link to="/leaderlogo" className="text-decoration-none nav-item" style={{ color: "var(--red)" }} onClick={handleLinkClick}>
                                            <MdOutlineDoubleArrow className="me-1" />
                                            <span className="sidebar_menu fw-medium">Leader logo</span>
                                        </Link>
                                    </Nav.Item>
                                    <Nav.Item className='mb-2'>
                                        <Link to="/ourstory" className="text-decoration-none nav-item" style={{ color: "var(--red)" }} onClick={handleLinkClick}>
                                            <MdOutlineDoubleArrow className="me-1" />
                                            <span className="sidebar_menu fw-medium">Our Story</span>
                                        </Link>
                                    </Nav.Item>
                                    <Nav.Item className="mb-2">
                                        <Link to="/faq" className="text-decoration-none nav-item" style={{ color: "var(--red)" }} onClick={handleLinkClick}>
                                            <MdOutlineDoubleArrow className="me-1" />
                                            <span className="sidebar_menu fw-medium">Faq</span>
                                        </Link>
                                    </Nav.Item>
                                </Nav>
                            )}
                        </div>

                        {/* Product Menu */}
                        <div className="text-white">
                            <div className="mt-2 mb-1 d-flex align-items-center fw-medium" style={{ cursor: 'pointer' }} onClick={handleProductClick}>
                                Product
                                <span className="ms-auto"><IoIosArrowDropdownCircle /></span>
                            </div>
                            {showProductMenu && (
                                <Nav className="flex-column bg-white ps-2 rounded-3">
                                    <Nav.Item className='mb-2 mt-2'>
                                        <Link to="/productAdminToggle" className="text-decoration-none nav-item" style={{ color: "var(--red)" }} onClick={handleLinkClick}>
                                            <MdOutlineDoubleArrow className="me-1" />
                                            <span className="sidebar_menu fw-medium">Add Product</span>
                                        </Link>
                                    </Nav.Item>
                                    <Nav.Item className='mb-2'>
                                        <Link to="/ProductData" className="text-decoration-none nav-item" style={{ color: "var(--red)" }} onClick={handleLinkClick}>
                                            <MdOutlineDoubleArrow className="me-1" />
                                            <span className="sidebar_menu fw-medium">Product Data</span>
                                        </Link>
                                    </Nav.Item>
                                </Nav>
                            )}
                        </div>
                    </div>
                </Offcanvas.Body>
            </Offcanvas>

            {/* Bottom bar for mobile */}
            <div className="d-md-none position-fixed top-0 start-50 translate-middle-x p-2 z-index-999 w-100 bg-dark d-flex justify-content-between align-items-center">
                <TiThMenu
                    className="text-white fs-1 p-1 rounded-2"
                    style={{ width: "40px", height: "40px", background: "var(--red)" }}
                    onClick={() => setShowSidebar(true)}
                />
                <ButtonComponent btn="Log Out" onClick={logout} />
            </div>
        </>
    );
}

export default Sidebar