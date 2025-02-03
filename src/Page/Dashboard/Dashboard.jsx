import React, { useState, useEffect} from 'react';
import axios from 'axios';
import './dashboard.css';
import { toast } from "react-toastify";
const Admin = () => {
    const [activeTab, setActiveTab] = useState('comments'); // Varsayılan olarak Yorumlar açık
    useEffect(() => {
        showToast("Giriş Yapıldı", "success");
    }, [])
    const showToast = (text, model) => {
        if (model === "success") {
            toast.success(text, {
                position: "top-center",  // Mesajın ekranda görünme pozisyonu
                autoClose: 3000,        // Otomatik kapanma süresi (milisaniye)
                hideProgressBar: false, // İlerleme çubuğunu gizlemek için true yapın
                closeOnClick: true,     // Mesaja tıklandığında kapanır
                pauseOnHover: true,     // Fare üzerine gelirse duraklatılır
                draggable: true,        // Sürüklenebilir
                theme: "light",         // "light", "dark", veya "colored" teması
            })
        } else if (

            model === "error") {
            toast.error(text, {
                position: "top-center",  // Mesajın ekranda görünme pozisyonu
                autoClose: 3000,        // Otomatik kapanma süresi (milisaniye)
                hideProgressBar: false, // İlerleme çubuğunu gizlemek için true yapın
                closeOnClick: true,     // Mesaja tıklandığında kapanır
                pauseOnHover: true,     // Fare üzerine gelirse duraklatılır
                draggable: true,        // Sürüklenebilir
                theme: "light",         // "light", "dark", veya "colored" teması
            })
        } else if (

            model === "warning") {
            toast.warning(text, {
                position: "top-center",  // Mesajın ekranda görünme pozisyonu
                autoClose: 3000,        // Otomatik kapanma süresi (milisaniye)
                hideProgressBar: false, // İlerleme çubuğunu gizlemek için true yapın
                closeOnClick: true,     // Mesaja tıklandığında kapanır
                pauseOnHover: true,     // Fare üzerine gelirse duraklatılır
                draggable: true,        // Sürüklenebilir
                theme: "light",         // "light", "dark", veya "colored" teması
            })
        } else { }
    };



    // Çıkış işlemi
    const handleLogout = () => {
        showToast("Çıkış Yapıldı Zaman Aşımı", "error");
        localStorage.removeItem('token');
        setInterval(() => {
            window.location.reload();
        }, 2000)
    };

    // Token süresi dolduğunda çıkış yap
    useEffect(() => {
        const interceptor = axios.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response && error.response.status === 401) {
                    handleLogout(); // Token süresi dolduğunda çıkış yap
                    return Promise.reject({ message: 'Token süresi dolmuş', status: 401 });
                }
                return Promise.reject(error);
            }
        );
        return () => {
            axios.interceptors.response.eject(interceptor);
        };
    });





    // // Kitapları Yönet Bileşeni
    // const ManageBooks = () => {
    //     return (
    //         <div>
    //             <h1>Kitapları Yönet</h1>
    //             <button className="add-book-btn">Yeni Kitap Ekle</button>
    //             <div className="book-list">
    //                 <div className="book-item">
    //                     <h3>Kitap 1</h3>
    //                     <button className="edit-btn">Düzenle</button>
    //                     <button className="delete-btn">Sil</button>
    //                 </div>
    //             </div>
    //         </div>
    //     );
    // };

    // Yorumları Yönet Bileşeni
    const ManageComments = () => {
        const [Comments, setComments] = useState([]);
        const [Data, setData] = useState([]);


        const handleYesNoToast = () => {
            toast.warning(
                <div>
                    <p style={{ textAlign: "center" }}>Gerçekten Silmek İstiyor Musun</p>
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "1rem" }}>
                        <button style={{ backgroundColor: "red" }} className="delete-btn" onClick={handleYes}>Evet</button>
                        <button style={{ backgroundColor: "green" }} className="delete-btn" onClick={handleNo}>Hayır</button>
                    </div>
                </div>,
                {
                    position: "top-center",  // Mesajın ekranda görünme pozisyonu
                    autoClose: 5000,        // Otomatik kapanma süresi (milisaniye)
                    hideProgressBar: false, // İlerleme çubuğunu gizlemek için true yapın
                    closeOnClick: true,     // Mesaja tıklandığında kapanır
                    pauseOnHover: true,     // Fare üzerine gelirse duraklatılır
                    draggable: true,        // Sürüklenebilir
                    theme: "light",         // "light", "dark", veya "colored" teması
                }
            );
        };

        const handleYes = () => {
            toast.dismiss();
            commentsAllDelete()
        };

        const handleNo = () => {
            toast.dismiss();
        };

        useEffect(() => {
            // Yorum getirme işlemi
            getComments();
        }, []);

        // Yorumları getirme
        const getComments = async () => {
            try {
                // Yorum getirme API endpoint'ini çağır
                axios.get('http://localhost:5001/comments')
                    .then((response) => {
                        setComments(response.data[0]?.Yorumdetay);
                        setData(response.data)
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            } catch (error) {
                console.error('Yorum getirilirken hata oluştu:', error);
            }
        }

        // Yorum onaylama
        const updateComment = async (createdAt, approved) => {
            const data = {
                bookId: "1",
                createdAt: createdAt,
                approved: approved
            };
            try {
                const response = await axios.put('http://localhost:5001/comments/updateApproved', data);
                console.log('Yanıt:', response.data);
                getComments();
            } catch (error) {
                console.error('Hata:', error.response ? error.response.data : error.message);
            }
        };

        function commentsDelete(createdAt) {
            axios.delete(`http://localhost:5001/deletecomments/${createdAt}`)
                .then(response => console.log())
                .catch(error => console.error(error));
        }

        // function commentsUpdate(createdAt) {
        //     axios.put(`http://localhost:5001/updatecomments/${createdAt}`, {
        //         newComment: "Güncellenmiş yorum",
        //         newApproved: true,
        //     })
        //         .then(response => console.log())
        //         .catch(error => console.error(error));
        // }

        function commentsAllDelete() {
            const bookId = Data[0]?._id; // Silmek istediğiniz belgenin _id'si
            axios.delete(`http://localhost:5001/deletebook/${bookId}`)
                .then(response => console.log())
                .catch(error => console.error(error));
        }

        return (
            <div>
                <h1>Yorumları Yönet</h1>
                <button style={{ backgroundColor: "red"}} className="delete-btn" onClick={() => { handleYesNoToast() }}>Tüm Yorumları Sil</button>
                <ul className='listeleme'>
                    <li>
                        <h2>Onaylanmamış</h2>
                        {Comments?.map((data, index) => (
                            data.comments[0]?.approved === false ? (<><div key={index} className="comment-list">
                                <div className="comment-item"><h3>Bölüm: {data?.Bolum}, Satir: {data?.Satir}</h3>
                                    <p>{data.comments[0]?.comment}</p>
                                    <p><strong>Yorum Yapan:</strong> {data.comments[0]?.user}</p>
                                    <p>
                                        <strong>Onay Durumu:</strong> Onay Bekliyor
                                    </p>
                                    <button className="delete-btn" onClick={() => { updateComment(data.comments[0]?.created_at, true) }}>Onayla</button>
                                    <button style={{ backgroundColor: "red" }} className="delete-btn" onClick={() => { commentsDelete(data.comments[0]?.created_at) }}>Yorumu Sil</button>
                                </div></div>
                            </>) : (
                                <></>
                            )
                        ))}
                    </li>
                    <li>
                        <hr />
                        <h2>Onaylanmış</h2>
                        {Comments?.map((data, index) => (
                            data.comments[0]?.approved === true ? (<><div key={index} className="comment-list">
                                <div className="comment-item"><h3>Bölüm: {data?.Bolum}, Satir: {data?.Satir}</h3>
                                    <p>{data.comments[0]?.comment}</p>
                                    <p><strong>Yorum Yapan:</strong> {data?.comments[0].user}</p>
                                    <p>
                                        <strong>Onay Durumu:</strong> Onaylı
                                    </p>
                                    <button className="delete-btn" onClick={() => { updateComment(data?.comments[0]?.created_at, false) }}>Onayı Çek</button>
                                    <button style={{ backgroundColor: "red" }} className="delete-btn" onClick={() => { commentsDelete(data.comments[0]?.created_at) }}>Yorumu Sil</button>
                                </div></div>
                            </>) : (
                                <></>
                            )
                        ))}
                    </li>
                </ul>
            </div>
        );
    };

    // Duyuruları Yönet Bileşeni
    const ManageAnnouncements = () => {
        const [announcements, setAnnouncements] = useState([]);
        const [title, setTitle] = useState('');
        const [description, setDescription] = useState('');

        // Duyuruları getirme
        const getAnnouncements = async () => {
            try {
                const response = await axios.get('http://localhost:5001/admin/announcements');
                setAnnouncements(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        // Duyuru ekleme
        const addAnnouncement = async (event) => {
            event.preventDefault();
            try {
                axios.post('http://localhost:5001/admin/announcements', {
                    title,
                    description,
                });
                getAnnouncements();
                setTitle('');
                setDescription('');
            } catch (error) {
                showToast("Boş değer var", "error");
                console.error(error);
            }
        };

        // Duyuru silme
        const deleteAnnouncement = async (id) => {
            try {
                await axios.delete(`http://localhost:5001/admin/announcements/${id}`);
                setAnnouncements(announcements.filter((announcement) => announcement._id !== id));
            } catch (error) {
                console.error(error);
            }
        };

        useEffect(() => {
            getAnnouncements();
            annocementfetchApprovedStatus();
        }, []);

        const [approved, setApproved] = useState();
        const annocementfetchApprovedStatus = async () => {
            try {
                const response = await axios.get(`http://localhost:5001/get-approved/678ebdeddfb927ed6a38aa95`);
                setApproved(response.data.approved);
            } catch (error) {
                console.log(`Error: ${error.response?.data?.message || error.message}`);
            }
        };
        //duyuru genel açma kapama
        useEffect(() => {
            const updateApproved = async () => {
                try {
                    const response = await axios.put(`http://localhost:5001/update-approved/678ebdeddfb927ed6a38aa95`, {
                        approved,
                    });
                    showToast(`Duyurular: ${JSON.stringify(response.data.approved ? "açık" : "kapalı")}`, "success");
                } catch (error) {
                    console.log(`Error: ${error.response?.data?.message || error.message}`);
                }
            };
            updateApproved();
        }, [approved]);
        

        return (
            <div>
                <h1>Duyuruları Yönet</h1>
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "2rem", scale: "1.5" }}>
                    <h5>Duyurular</h5>
                    <input
                        type="checkbox"
                        checked={approved}
                        onChange={(e) => { setApproved(e.target.checked) }}
                    />
                </div>
                <form className='DuyuruForm' onSubmit={addAnnouncement}>
                    <input className='add-announcement-btn'
                        type="text"
                        value={title}
                        onChange={(event) => setTitle(event.target.value)}
                        placeholder="Duyuru başlığı"
                    />
                    <textarea className='add-announcement-btn'
                        value={description}
                        onChange={(event) => setDescription(event.target.value)}
                        placeholder="Duyuru açıklaması"
                    />
                    <button className='add-announcement-btn' type="submit">Yeni Duyuru Ekle</button>
                </form>
                <div className="announcement-list">
                    {announcements.map((announcement) => (
                        <div key={announcement._id} className="announcement-item">
                            <h3>{announcement.title}</h3>
                            <p>{announcement.description}</p>
                            <button style={{ backgroundColor: "red" }} className="delete-btn" onClick={() => deleteAnnouncement(announcement._id)}>
                                Sil
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        );
    };
    return (
        <div>
            <div className="admin-panel">
                <aside className="sidebar">
                    <h2>Admin Paneli</h2>
                    <ul>
                        {/* <li>
                        <button
                            className={activeTab === 'books' ? 'active' : ''}
                            onClick={() => setActiveTab('books')}
                        >
                            Kitapları Yönet
                        </button>
                    </li> */}
                        <li>
                            <button
                                className={activeTab === 'comments' ? 'active' : ''}
                                onClick={() => setActiveTab('comments')}
                            >
                                Yorumları Yönet
                            </button>
                        </li>
                        <li>
                            <button
                                className={activeTab === 'announcements' ? 'active' : ''}
                                onClick={() => setActiveTab('announcements')}
                            >
                                Duyuruları Yönet
                            </button>
                        </li>
                    </ul>
                </aside>
                <main className="main-content">
                    <div className="content-wrapper den">
                        {activeTab === 'comments' && <ManageComments />}
                        {activeTab === 'announcements' && <ManageAnnouncements />}
                    </div>
                </main>
            </div>
        </div>
    );
};
export default Admin;