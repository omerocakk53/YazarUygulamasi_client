import React from 'react';
import './Home.css';
import kitapKapak from '../../kasirkaya_kanan_saka.jpg';
const Home = () => {
    return (
        <div className="home-container">
            {/* Hakkımda Bölümü */}
            <section id="hakkımda" className="section hakkımda-section">
                <div className="content-wrapper">
                    <h1>Hakkımda</h1>
                    <p>
                        Merhaba! Ben bir yazarım ve kitaplarımı sizinle paylaşmaktan büyük mutluluk duyuyorum.
                        Burada benimle ilgili daha fazla bilgi bulabilir ve kitaplarıma göz atabilirsiniz.
                    </p>
                </div>
            </section>

            {/* Kitaplarım Bölümü */}
            <section id="kitaplarım" className="section kitaplarım-section">
                <div className="content-wrapper">
                    <h1>Kitaplarım</h1>
                    <div className="book-list">
                        <a href="/kitap1">
                            <div className="book-item">
                                <div style={{ marginTop: "0" }} className="kitap">
                                    <div>
                                        <div className='img'>
                                            <img src={kitapKapak} alt="Kasırgaya Kanan Saka" />
                                        </div>
                                    </div>
                                </div>
                                <p>“Derler ki; çalınan hayatını daima hatırla, intikamın alevlerini soyunla harla. Bu ağılı taht bir hatıra; kalbi katran, ruhu Yakut Kral’a.”</p>
                                <h2>Okumak için tıklayın</h2>
                            </div>
                        </a>
                    </div>
                </div>
            </section>

            {/* İletişim Bölümü */}
            <section id="iletişim" className="section iletişim-section">
                <div className="content-wrapper">
                    <h1>İletişim</h1>
                    <form className="contact-form">
                        <input type="text" placeholder="Adınız" required />
                        <input type="email" placeholder="E-posta Adresiniz" required />
                        <textarea placeholder="Mesajınız" rows="5" required></textarea>
                        <button type="submit">Gönder</button>
                    </form>
                </div>
            </section>
        </div>
    );
};

export default Home;