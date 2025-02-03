import React, { useState } from 'react';
import { Link as ScrollLink } from 'react-scroll'; // Sayfa içi kaydırma için
import { Link as RouterLink } from 'react-router-dom'; // Yönlendirme için

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <>
            {/* Overlay (Menü Açıldığında Arka Plan) */}
            <div className={`overlay ${isMenuOpen ? 'active' : ''}`} onClick={toggleMenu}></div>

            <nav className="navbar">
                <div className="navbar-container">
                    <div className="navbar-brand">
                        <RouterLink to="/" className="nav-link">Ana Sayfa</RouterLink>
                    </div>
                    <div className={`nav-list ${isMenuOpen ? 'open' : ''}`}>
                        {window.location.pathname === '/' ? (<><li className="nav-item">
                            <ScrollLink
                                to="hakkımda"
                                smooth={true}
                                duration={200}
                                className="nav-link"
                                onClick={() => setIsMenuOpen(false)} // Menüyü kapat
                            >
                                Hakkımda
                            </ScrollLink>
                        </li>
                            <li className="nav-item">
                                <ScrollLink
                                    to="kitaplarım"
                                    smooth={true}
                                    duration={200}
                                    className="nav-link"
                                    onClick={() => setIsMenuOpen(false)} // Menüyü kapat
                                >
                                    Kitaplarım
                                </ScrollLink>
                            </li>
                            <li className="nav-item">
                                <ScrollLink
                                    to="iletişim"
                                    smooth={true}
                                    duration={200}
                                    className="nav-link"
                                    onClick={() => setIsMenuOpen(false)} // Menüyü kapat
                                >
                                    İletişim
                                </ScrollLink>
                            </li></>) : null}
                        {/* <li className="nav-item">
                            <RouterLink to="/dashboard" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                                Admin Girişi
                            </RouterLink>
                        </li> */}
                    </div>
                    <div className="menu-toggle" onClick={toggleMenu}>
                        <span className="menu-icon">&#9776;</span>
                    </div>
                </div>
            </nav>
        </>
    );
};

export default Navbar;