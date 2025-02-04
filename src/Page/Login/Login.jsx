import React, { useState, useEffect } from 'react';
import axios from '../../utils/axios';
import { useNavigate } from 'react-router-dom'; // Yönlendirme için
import './login.css';
import { toast } from "react-toastify";
const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate(); // Yönlendirme için
    
    const showToast = (text) => {
        toast.loading(text, {
            position: "top-center",  // Mesajın ekranda görünme pozisyonu
            autoClose: 1500,        // Otomatik kapanma süresi (milisaniye)
            hideProgressBar: false, // İlerleme çubuğunu gizlemek için true yapın
            closeOnClick: true,     // Mesaja tıklandığında kapanır
            pauseOnHover: true,     // Fare üzerine gelirse duraklatılır
            draggable: true,        // Sürüklenebilir
            theme: "light",         // "light", "dark", veya "colored" teması
        })
    }
    
    // Token kontrolü ve yönlendirme
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            navigate('/dashboard'); // Admin sayfasına yönlendir
        }
    }, [navigate]);

    // Giriş işlemi
    const handleLogin = async (e) => {
        e.preventDefault();

        const url = '/login';

        try {
            const response = await axios.post(url, { username, password }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const { token } = response.data;
            localStorage.setItem('token', token); // Token'ı localStorage'a kaydet
            showToast("Kontrol Sağlanıyor");
            setInterval(() => {
                navigate('/dashboard'); // Admin sayfasına yönlendir
                window.location.reload();
            }, 1500)
        } catch (err) {
            toast.error("Kullanıcı adı Yada Şifre Yanlış", {
                position: "top-center",  // Mesajın ekranda görünme pozisyonu
                autoClose: 3000,        // Otomatik kapanma süresi (milisaniye)
                hideProgressBar: false, // İlerleme çubuğunu gizlemek için true yapın
                closeOnClick: true,     // Mesaja tıklandığında kapanır
                pauseOnHover: true,     // Fare üzerine gelirse duraklatılır
                draggable: true,        // Sürüklenebilir
                theme: "light",         // "light", "dark", veya "colored" teması
            })
            console.error('Giriş hatası:', err);
        }
    };


    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleLogin}>
                <div>
                    <label>Kullanıcı Adı</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Şifre</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Giriş Yap</button>
            </form>
        </div>
    );
};

export default Login;