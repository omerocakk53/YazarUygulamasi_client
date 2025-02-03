import React, { useEffect, useState } from 'react';
import './Kitap.css';
import kks from '../../kitap.pdf';
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';
import { FaCommentDots } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import axios from 'axios';
import { GrAnnounce } from "react-icons/gr";
import { toast } from "react-toastify";
import kitapKapak from '../../kasirkaya_kanan_saka.jpg';
// PDF.js worker dosyasını ayarla
GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js`;

function Kitap1() {
    const [pages, setPages] = useState([]);
    const [count, setcount] = useState(0);
    const [Bolumtext, setBolumtext] = useState([]);
    const [BolumAcikmi, setBolumAcikmi] = useState(false);
    const [announcements, setAnnouncements] = useState([]);
    const [yorumPanelAcik, setYorumPanelAcik] = useState(false);
    const [yorumIcerik, setYorumIcerik] = useState("");
    const [aktifBolum, setAktifBolum] = useState(null);
    const [aktifGrup, setAktifGrup] = useState(null);
    const [yorumYapanIsim, setYorumYapanIsim] = useState("");
    const [Comments, setComments] = useState([]);

    const showToast = (text, model) => {
        if (model == "success") {
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

            model == "error") {
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

            model == "warning") {
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

    useEffect(() => {
        // Yorum getirme işlemi
        try {
            // Yorum getirme API endpoint'ini çağır
            axios.get('http://localhost:5001/comments')
                .then((response) => {
                    setComments(response.data[0].Yorumdetay);
                })
                .catch((error) => {
                    console.error(error);
                });
        } catch (error) {
            console.error('Yorum getirilirken hata oluştu:', error);
        }
    }, []);

    // Duyuruları getirme
    const getAnnouncements = async () => {
        try {
            const response = await axios.get('http://localhost:5001/admin/announcements');
            setAnnouncements(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        const loadPdf = async () => {
            try {
                const pdf = await getDocument(kks).promise;
                const numPages = pdf.numPages;
                const pagesArray = [];
                const processedPages = new Set(); // Track processed pages

                for (let pageNumber = 1; pageNumber <= numPages; pageNumber++) {
                    if (!processedPages.has(pageNumber)) { // Check if page is already processed
                        const page = await pdf.getPage(pageNumber);
                        const content = await page.getTextContent();
                        const textItems = content.items.map((item) => item.str).join('');
                        pagesArray.push({
                            pageNumber,
                            text: textItems,
                        });
                        processedPages.add(pageNumber); // Mark page as processed
                    }
                }

                setPages(pagesArray);
            } catch (error) {
                console.error('PDF yüklenirken bir hata oluştu', error);
            }
        };
        loadPdf();
    }, [kks]);

    useEffect(() => {
        getAnnouncements();
        annocementfetchApprovedStatus();
    }, []);

    // Bölümleri temizleyen ana yapı
    const processAllChapters = (chapter) => {
        // Bölüm metni UTF-8 dönüşümü yapılıp temizleniyor
        const utf8Text = new TextDecoder('utf-8').decode(new TextEncoder().encode(chapter));
        return utf8Text;
    };

    // Yorum panelini aç
    const yorumPaneliAc = (satirindex, bolumNumarasi) => {
        setAktifBolum(bolumNumarasi);
        setAktifGrup(satirindex);
        setYorumPanelAcik(true);
    };

    const yorumPaneliKapat = () => {
        setYorumPanelAcik(false);
        setYorumIcerik(""); // Yorum içeriğini temizle
        setYorumYapanIsim(""); // İsim alanını temizle
    };


    // Yorum gönderme işlemi
    const yorumGonder = async () => {
        if (yorumIcerik.trim() && yorumYapanIsim.trim()) {
            const yorumData = {
                bookId: '1', // Kitap ID'sini girin
                chapter: aktifBolum, // Bölüm numarasını girin
                line: aktifGrup, // Satır numarasını girin
                comment: yorumIcerik, // Yorum metnini girin
                user: yorumYapanIsim, // Kullanıcı adını girin
            };
            yorumPaneliKapat(); // Yorum panelini kapat
            try {
                // Yorum gönderme API endpoint'ini çağır
                axios.post('http://localhost:5001/comments', yorumData)
                    .then((response) => {
                        console.log(response.data);
                        showToast("Yorum Gönderildi", "success");
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            } catch (error) {
                console.error('Yorum gönderilirken hata oluştu:', error);
                showToast("Yorum Gönderilemedi", "error");
            }
        } else {
            showToast("Lütfen adınızı ve yorum içeriğini girin.", "warning");
        }
    };


    useEffect(() => {
        setBolumtext([processAllChapters(pages[count]?.text), count + 1]);
    }, [count])

    useEffect(() => {
        setcount(Bolumtext[1] - 1); //Bölümler kapatılıp açılınca değeri sıfırlama yoksa ilerlerken karışıklık oluyor
    }, [BolumAcikmi])

    //duyuru gizlenmiş diye kontrol
    const [approved, setApproved] = useState(null);

    const annocementfetchApprovedStatus = async () => {
        try {
            const response = await axios.get(`http://localhost:5001/get-approved/678ebdeddfb927ed6a38aa95`);
            setApproved(response.data.approved);
        } catch (error) {
            console.log(`Error: ${error.response?.data?.message || error.message}`);
        }
    };

    return (
        <>
            <div className='homeanadiv'>
                <div className="kitap">
                    <div>
                        <div className='img'>
                            <img src={kitapKapak} alt="Kasırgaya Kanan Saka" />
                        </div>
                    </div>
                    <p>“Derler ki; çalınan hayatını daima hatırla, intikamın alevlerini soyunla harla. Bu ağılı taht bir hatıra; kalbi katran, ruhu Yakut Kral’a.” </p>
                </div>
                {approved ? (<><h1>Duyurular</h1><div className="duyurular">
                    {announcements.map((announcement) => (
                        <div key={announcement._id} className="announcement-item">
                            <div className="icon"><GrAnnounce size={24} /></div>
                            <h3>Duyuru !! {announcement.title}</h3>
                            <p>{announcement.description}</p>
                        </div>
                    ))}
                </div></>) : (<></>)}
                <h1>Bölümler</h1>
                <div className="bolumler">
                    {pages.map((page) => (
                        <div key={page.pageNumber} className='bolum'>
                            <div><h4>{page.pageNumber == 1 ? "Başlık" : page.pageNumber == 2 ? "Giriş" : "" + page.pageNumber - 2 + ". Bölüm"}</h4> </div>
                            <div className='etkilesim'>
                                <div style={{ display: "flex", alignItems: "center" }} className="yorum">
                                    <FaCommentDots /><h6 style={{ marginTop: "-5px", color: "rgba(255, 0, 68, 0.897)", fontSize: "15px", fontWeight: "bolder" }} >{Comments.filter((data) => data.comments[0]?.approved && data?.Bolum == page.pageNumber).length}</h6>
                                </div>
                                {/* <div className="bakansayisi">
                                    <FaEye />56000
                                </div> */}
                            </div>
                            <div className='button'>
                                <button onClick={() => {
                                    setBolumtext([processAllChapters(page.text), page.pageNumber]);
                                    setBolumAcikmi(true);
                                }}>
                                    Oku
                                </button>

                            </div>
                        </div>
                    ))}
                </div>
                <div className="OkumaSayfasi" style={{ display: BolumAcikmi ? "block" : "none" }}>
                    <div className='hizalamadiv'>
                        <div className='div'>
                            <div className='baslikfixed'>
                                <div className='hizzalama'>
                                    <div className='bolumbaslik'>
                                        <h1>{Bolumtext[1] == 1 ? "Başlık" : Bolumtext[1] == 2 ? "Giriş" : Bolumtext[1] - 2 + ". Bölüm"}</h1>
                                        <IoMdClose className='IoMdClose' size={30} onClick={() => { setBolumAcikmi(false) }} />
                                    </div>
                                    <hr style={{ border: "none", width: "98%", height: "1px", backgroundColor: "black" }} />
                                </div>
                            </div>
                            <div className='icerik'>
                                <ul>
                                    {

                                        Bolumtext && Bolumtext[0] ? Bolumtext[0].split('.').reduce((acc, sentence, index) => {
                                            if (sentence.trim()) {
                                                const satirindex = Math.floor(index / 3); // Her 3 satır için bir grup oluştur
                                                if (!acc[satirindex]) {
                                                    acc[satirindex] = [];
                                                }
                                                acc[satirindex].push(sentence.trim() + '.'); // Satırı gruba ekle
                                            }
                                            return acc;
                                        }, []).map((group, satirindex) => (
                                            <li key={satirindex} style={{ display: "grid" }}>
                                                <p>{group.map((sentence, sentenceIndex) => (
                                                    <>
                                                        &nbsp;{sentence}
                                                    </>
                                                ))}</p>
                                                {/* Her 3 satırın sonuna yorum butonu ekle */}
                                                <div style={{ marginTop: "20px", marginBottom: "20px", display: "flex", alignItems: "center" }}>
                                                    <FaCommentDots
                                                        onClick={() => yorumPaneliAc(satirindex, Bolumtext[1])} // Yorum panelini aç
                                                        className='yorumİmage'
                                                        size={20}
                                                        style={{ cursor: "pointer" }}
                                                    /> <h6 style={{ marginTop: "-18px", color: "rgba(255, 0, 68, 0.897)", fontSize: "15px", fontWeight: "bolder" }} >{Comments.filter((data) => data.comments[0]?.approved && data?.Satir === satirindex && data?.Bolum == Bolumtext[1]).length}</h6>
                                                </div>

                                                <div className="yorumlar">
                                                    {Comments.map((data, index) => (
                                                        Bolumtext[1] == data?.Bolum && satirindex == data?.Satir && data.comments[0]?.approved ? (<><div className={index + ".yorum"} key={index}>
                                                            <h2>{data.comments[0]?.user} Demiş ki</h2>
                                                            <p>{data.comments[0]?.comment}</p>
                                                        </div><hr /></>) : (
                                                            <></>
                                                        )
                                                    ))}
                                                </div>

                                            </li>

                                        ))
                                            : <li>Veri bulunamadı.</li>
                                    }


                                </ul>
                                <div className='bölümetkilesim'>
                                    {count === 0 ? <h4 ></h4> : <button onClick={() => { setcount(count - 1); }}>Önceki Bölüm</button>}
                                    {count === 49 ? <h4 ></h4> : <button onClick={() => { setcount(count + 1); }}>Sonraki Bölüm</button>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {
                    yorumPanelAcik && (
                        <div className="yorum-panel">
                            <div className="yorum-panel-icerik">
                                <h3>Yorum Yap</h3>
                                <input className='input'
                                    type="text"
                                    value={yorumYapanIsim}
                                    onChange={(e) => setYorumYapanIsim(e.target.value)}
                                    placeholder="Adınızı girin..."
                                />
                                <textarea
                                    value={yorumIcerik}
                                    onChange={(e) => setYorumIcerik(e.target.value)}
                                    placeholder="Yorumunuzu buraya yazın..."
                                />
                                <div className="yorum-panel-butonlar">
                                    <button onClick={yorumGonder}>Gönder</button>
                                    <button onClick={yorumPaneliKapat}>İptal</button>
                                </div>
                            </div>
                        </div>
                    )
                }
            </div>
        </>
    )
}

export default Kitap1;