import React from 'react'
import { FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa6";
function Footer() {
    return (
        <footer>
            <div className="social-icons">
                <a href="#"><FaInstagram className='ins'/></a>
                <a href="#"><FaXTwitter className='tw'/></a>
                <a href="#"><FaLinkedin className='lin' /></a>
            </div>
            <p>&copy; 2024 Hazel Noya Tüm hakları saklıdır.</p>
        </footer>
    )
}

export default Footer