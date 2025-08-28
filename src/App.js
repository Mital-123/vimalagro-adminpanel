import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './Component/Login';
import { useEffect, useState } from 'react';
import Sidebar from './Component/Sidebar';
import Counter from './Pages/HomePage/Counter';
import Testimonial from './Pages/HomePage/Testimonial';
import Certificates from './Pages/HomePage/Certificates';
import Faq from './Pages/AboutPage/Faq';
import ProductAdminToggle from './Pages/ProductPage/ProductAdminToggle';

function App() {

  const [login, setlogin] = useState(false);

  useEffect(() => {
    setlogin((localStorage.getItem("login")))
  }, [login])

  return (
    <>
      <BrowserRouter>
        <div className="main_form d-flex">
          {
            login ?
              <>
                <Sidebar />
                <div className="main-content p-2 p-lg-4 mt-5 mt-lg-0 mt-md-0 flex-grow-1">
                  <Routes>
                    <Route path='/' element={<Counter setlogin={setlogin} />} />
                    <Route path='/counter' element={<Counter setlogin={setlogin} />} />
                    <Route path='/testimonial' element={<Testimonial />} />
                    <Route path='/certificate' element={<Certificates />} />
                    <Route path='/faq' element={<Faq />} />
                    <Route path='/productAdminToggle' element={<ProductAdminToggle />} />
                  </Routes>
                </div>
              </>
              :
              <>
                <div className="main_login flex-grow-1">
                  <Routes>
                    <Route path='/' element={<Login setlogin={setlogin} />} />
                    <Route path='*' element={<Login setlogin={setlogin} />} />
                  </Routes>
                </div>
              </>
          }
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;