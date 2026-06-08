// src/components/LoginModal.jsx
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/api';

const WA_SVG = <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>;

export default function LoginModal({ onClose, onSuccess }) {
  const { login } = useAuth();
  const [tab, setTab]         = useState('login');
  const [showPass, setShowPass] = useState(false);
  const [showReg, setShowReg]   = useState(false);

  // Login state
  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginErr,  setLoginErr]  = useState('');
  const [loginLoad, setLoginLoad] = useState(false);

  // Register state
  const [regNama, setRegNama] = useState('');
  const [regUser, setRegUser] = useState('');
  const [regPass, setRegPass] = useState('');
  const [regErr,  setRegErr]  = useState('');
  const [regLoad, setRegLoad] = useState(false);

  const handleLogin = async () => {
    if (!loginUser || !loginPass) { setLoginErr('Username dan password wajib diisi.'); return; }
    setLoginErr(''); setLoginLoad(true);
    try {
      const res = await api.login({ username: loginUser, password: loginPass });
      if (!res.ok) { setLoginErr(res.msg || 'Login gagal.'); return; }
      login(res.user);
      onSuccess(`Selamat datang, ${res.user.nama}! 👋`);
      onClose();
    } catch {
      setLoginErr('Gagal konek ke server. Pastikan backend sudah dijalankan.');
    } finally { setLoginLoad(false); }
  };

  const handleRegister = async () => {
    if (!regNama)           { setRegErr('Nama lengkap wajib diisi.'); return; }
    if (!regUser)           { setRegErr('Username wajib diisi.'); return; }
    if (regUser.length < 3) { setRegErr('Username minimal 3 karakter.'); return; }
    if (!regPass)           { setRegErr('Password wajib diisi.'); return; }
    if (regPass.length < 6) { setRegErr('Password minimal 6 karakter.'); return; }
    setRegErr(''); setRegLoad(true);
    try {
      const res = await api.register({ nama: regNama, username: regUser, password: regPass });
      if (!res.ok) { setRegErr(res.msg || 'Registrasi gagal.'); return; }
      login(res.user);
      onSuccess(`Akun berhasil dibuat! Selamat datang, ${regNama} 🎉`);
      onClose();
    } catch {
      setRegErr('Gagal konek ke server. Pastikan backend sudah dijalankan.');
    } finally { setRegLoad(false); }
  };

  return (
    <>
      <div className="modal-overlay visible" onClick={onClose} />
      <div className="modal" role="dialog" aria-modal="true">
        <button className="modal-close" onClick={onClose} aria-label="Tutup">&times;</button>
        <div className="modal-tabs">
          <button className={`modal-tab${tab === 'login' ? ' on' : ''}`} onClick={() => setTab('login')}>Masuk</button>
          <button className={`modal-tab${tab === 'register' ? ' on' : ''}`} onClick={() => setTab('register')}>Daftar</button>
        </div>

        {tab === 'login' ? (
          <div>
            <span className="modal-icon">🔐</span>
            <h2>Masuk ke Akun</h2>
            <p className="modal-sub">Login sebagai Admin atau Klien</p>
            <div className="mfg">
              <label>Username</label>
              <input type="text" placeholder="Masukkan username" value={loginUser}
                onChange={e => setLoginUser(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleLogin()} />
            </div>
            <div className="mfg">
              <label>Password</label>
              <div className="pw-wrap">
                <input type={showPass ? 'text' : 'password'} placeholder="Masukkan password"
                  value={loginPass} onChange={e => setLoginPass(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleLogin()} />
                <button type="button" className="pw-eye" onClick={() => setShowPass(!showPass)}>👁</button>
              </div>
            </div>
            <div className="modal-hint">Admin default: <strong>admin</strong> / <strong>admin123</strong></div>
            {loginErr && <div className="modal-err">{loginErr}</div>}
            <button className="btn-main full-w" onClick={handleLogin} disabled={loginLoad}>
              {loginLoad ? 'Masuk...' : 'Masuk →'}
            </button>
          </div>
        ) : (
          <div>
            <span className="modal-icon">✨</span>
            <h2>Daftar Akun Klien</h2>
            <p className="modal-sub">Buat akun untuk menambahkan produk ke favorit</p>
            <div className="mfg">
              <label>Nama Lengkap</label>
              <input type="text" placeholder="Nama Anda" value={regNama} onChange={e => setRegNama(e.target.value)} />
            </div>
            <div className="mfg">
              <label>Username</label>
              <input type="text" placeholder="Pilih username unik" value={regUser} onChange={e => setRegUser(e.target.value)} />
            </div>
            <div className="mfg">
              <label>Password</label>
              <div className="pw-wrap">
                <input type={showReg ? 'text' : 'password'} placeholder="Min. 6 karakter"
                  value={regPass} onChange={e => setRegPass(e.target.value)} />
                <button type="button" className="pw-eye" onClick={() => setShowReg(!showReg)}>👁</button>
              </div>
            </div>
            {regErr && <div className="modal-err">{regErr}</div>}
            <button className="btn-main full-w" onClick={handleRegister} disabled={regLoad}>
              {regLoad ? 'Mendaftar...' : 'Daftar Sekarang →'}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
