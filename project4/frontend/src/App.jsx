import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import {useState} from "react";


import homePhoto from "./assets/home.jpg";

import Author from "./components/author/author.jsx";
import Patent from "./components/patent/patent.jsx";
import Certification from "./components/certification/certification.jsx";
import MyNavbar from "./components/MyNavbar";
import About from "./components/About.jsx";

const App = () => {
    // Navbar'dan gelen 'authors', 'patents' veya 'certifications' değerini tutar
    const [param, setParam] = useState('home')

    const handler = (arg) => setParam(arg);

    return (
        <div>
            {/* Navigasyon çubuğuna handler fonksiyonunu gönderiyoruz */}
            <MyNavbar onHandle={handler}/>

            {/* Requirement 2 için container'ı değiştirdik:
              'home' sayfasındayken 'container-fluid p-0' kullanarak fotoğrafın tam ekran olmasını sağladık.
              Diğer tablolar için normal 'container mt-4' yapısını koruduk.
            */}
            <div className={param === 'home' ? "container-fluid p-0 mt-5" : "container mt-4"}>
                {
                    {
                        'home': (
                            <div className="text-center">
                                {/* Requirement 1: Welcome yazısı ve alt metni en üste aldık */}
                                <div className="mt-4 mb-4">
                                    <h1>Welcome to PMS</h1>
                                    <p className="text-muted">Patent Management System</p>
                                </div>

                                {/* Requirement 2: Fotoğrafın tam ekran kaplaması için genişliği %100 yaptık.
                                  Requirement 3: Siyah ince çizgiler/gölgeler için borderRadius, border ve boxShadow'ı kaldırdık/sıfırladık.
                                */}
                                <img
                                    src={homePhoto}
                                    alt="Ana Sayfa"
                                    style={{
                                        width: '100%',     // Ekranı yatayda tam kaplar
                                        height: '70vh',    // Ekran yüksekliğinin %70'ini kaplar (çok büyük olması için)
                                        objectFit: 'cover', // Fotoğrafın bozulmadan kırpılmasını sağlar
                                        border: 'none',    // Requirement 3: Kenarlıkları kaldırır
                                        boxShadow: 'none', // Requirement 3: Gölgeleri kaldırır
                                        margin: '0',       // Boşlukları sıfırlar
                                        padding: '0'
                                    }}
                                />
                            </div>
                        ),
                        'authors': <Author/>,
                        'patents': <Patent/>,
                        'certifications': <Certification/>,
                        'about': <About/>
                    }[param]
                }
            </div>
        </div>
    );
};

export default App;