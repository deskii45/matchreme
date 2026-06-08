// src/App.jsx
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Catalog from './components/Catalog';
import About from './components/About';
import Contact from './components/Contact';
import Footer from './components/Footer';
import LoginModal from './components/LoginModal';
import FavoritesPanel from './components/FavoritesPanel';
import Toast from './components/Toast';
import { useAuth } from './context/AuthContext';
import { api } from './api/api';

function App() {
  const { user } = useAuth();
  const [loginOpen, setLoginOpen] = useState(false);
  const [favOpen, setFavOpen] = useState(false);
  const [favCount, setFavCount] = useState(0);
  const [toast, setToast] = useState({ message: '', type: '' });

  const handleToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const clearToast = () => {
    setToast({ message: '', type: '' });
  };

  useEffect(() => {
    async function loadFavCount() {
      if (user && user.role === 'client') {
        try {
          const res = await api.getFavIds(user.id);
          if (res.ok) {
            setFavCount(res.data.length);
          }
        } catch {
          setFavCount(0);
        }
      } else {
        setFavCount(0);
      }
    }
    loadFavCount();
  }, [user]);

  // Handle active link scrolling logic
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('section[id]');
      const navLinks = document.querySelectorAll('.nav-links a');
      let current = '';
      sections.forEach((sec) => {
        if (window.scrollY >= sec.offsetTop - 90) {
          current = sec.id;
        }
      });
      navLinks.forEach((link) => {
        link.classList.remove('act');
        if (link.getAttribute('href') === '#' + current) {
          link.classList.add('act');
        }
      });
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <Navbar
        onLoginClick={() => setLoginOpen(true)}
        onFavClick={() => setFavOpen(true)}
        favCount={favCount}
        onToast={handleToast}
      />
      <Hero />
      <Catalog onToast={handleToast} onFavUpdate={setFavCount} />
      <About />
      <Contact onToast={handleToast} />
      <Footer />

      {loginOpen && (
        <LoginModal
          onClose={() => setLoginOpen(false)}
          onSuccess={(msg) => handleToast(msg, 'success')}
        />
      )}

      <FavoritesPanel
        open={favOpen}
        onClose={() => setFavOpen(false)}
        onCountUpdate={setFavCount}
        onToast={handleToast}
      />

      {toast.message && (
        <Toast
          message={toast.message}
          type={toast.type}
          onHide={clearToast}
        />
      )}
    </>
  );
}

export default App;
