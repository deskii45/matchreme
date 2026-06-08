document.addEventListener('DOMContentLoaded', function () {

  /* ═══════════════════════════════════════════════════
   * KONFIGURASI API
   * ═══════════════════════════════════════════════════ */
  const API = 'http://localhost:3000/api';

  /* ═══════════════════════════════════════════════════
   * AUTH MODULE — session via sessionStorage
   * ═══════════════════════════════════════════════════ */
  const Auth = (function () {
    const KEY = 'msforce_session';
    function login(user)  { sessionStorage.setItem(KEY, JSON.stringify(user)); }
    function logout()     { sessionStorage.removeItem(KEY); }
    function getUser()    { var r = sessionStorage.getItem(KEY); return r ? JSON.parse(r) : null; }
    function isAdmin()    { var u = getUser(); return u && u.role === 'admin'; }
    function isClient()   { var u = getUser(); return u && u.role === 'client'; }
    return { login, logout, getUser, isAdmin, isClient };
  })();

  /* ═══════════════════════════════════════════════════
   * UTILITY
   * ═══════════════════════════════════════════════════ */
  function showToast(msg, type) {
    var toast = document.getElementById('toast');
    var icon  = type === 'err' ? '❌' : type === 'fav' ? '❤️' : '✅';
    toast.innerHTML = '<span>' + icon + '</span> ' + msg;
    toast.className = 'toast show' + (type ? ' toast-' + type : '');
    clearTimeout(toast._t);
    toast._t = setTimeout(function () { toast.className = 'toast'; }, 3500);
  }

  function openOverlay()  { document.getElementById('modalOverlay').classList.add('visible'); }
  function closeOverlay() { document.getElementById('modalOverlay').classList.remove('visible'); }
  function openModal(id)  { openOverlay(); document.getElementById(id).classList.add('open'); }
  function closeModal(id) { document.getElementById(id).classList.remove('open'); closeOverlay(); }

  function showErr(elId, msg) {
    var el = document.getElementById(elId);
    el.textContent = msg; el.classList.add('show');
  }
  function hideErr(elId) {
    var el = document.getElementById(elId);
    el.textContent = ''; el.classList.remove('show');
  }

  /* ═══════════════════════════════════════════════════
   * API HELPER — fetch wrapper
   * ═══════════════════════════════════════════════════ */
  async function apiGet(path) {
    var res  = await fetch(API + path);
    return res.json();
  }

  async function apiPost(path, body) {
    var res = await fetch(API + path, {
      method : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body   : JSON.stringify(body)
    });
    return res.json();
  }

  async function apiPut(path, body) {
    var res = await fetch(API + path, {
      method : 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body   : JSON.stringify(body)
    });
    return res.json();
  }

  async function apiDelete(path) {
    var res = await fetch(API + path, { method: 'DELETE' });
    return res.json();
  }

  /* ═══════════════════════════════════════════════════
   * UI UPDATE — update navbar sesuai role
   * ═══════════════════════════════════════════════════ */
  function updateUI() {
    var user       = Auth.getUser();
    var guestNav   = document.getElementById('guestNav');
    var userNav    = document.getElementById('userNav');
    var navName    = document.getElementById('navUserName');
    var navBadge   = document.getElementById('navRoleBadge');
    var navFavBtn  = document.getElementById('navFavBtn');
    var btnAddProd = document.getElementById('btnAddProd');

    document.body.classList.remove('role-admin', 'role-client');

    if (user) {
      guestNav.classList.add('hidden');
      userNav.classList.remove('hidden');
      navName.textContent  = user.nama;
      navBadge.textContent = user.role === 'admin' ? 'Admin' : 'Klien';
      navBadge.className   = 'nav-user-badge ' + user.role;

      if (user.role === 'admin') {
        document.body.classList.add('role-admin');
        btnAddProd.classList.remove('hidden');
        navFavBtn.classList.add('hidden');
      } else {
        document.body.classList.add('role-client');
        btnAddProd.classList.add('hidden');
        navFavBtn.classList.remove('hidden');
        updateFavCount();
      }
    } else {
      guestNav.classList.remove('hidden');
      userNav.classList.add('hidden');
      btnAddProd.classList.add('hidden');
    }

    renderCatalog(currentFilter);
  }

  async function updateFavCount() {
    var user = Auth.getUser();
    if (!user) return;
    try {
      var res = await apiGet('/favorites/' + user.id + '/ids');
      document.getElementById('favCount').textContent = res.ok ? res.data.length : 0;
    } catch (e) {
      document.getElementById('favCount').textContent = 0;
    }
  }

  /* ═══════════════════════════════════════════════════
   * CATALOG RENDER (dari MySQL via API)
   * ═══════════════════════════════════════════════════ */
  var currentFilter = 'all';
  var favIds        = []; // cache favorit user saat ini

  var WA_ICON = '<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>';

  async function renderCatalog(filter) {
    currentFilter = filter || 'all';
    var grid = document.getElementById('prodGrid');
    grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:60px;color:var(--tx3);">⏳ Memuat katalog...</div>';

    try {
      var res = await apiGet('/catalog');
      if (!res.ok) throw new Error(res.msg);

      var user    = Auth.getUser();
      var catalog = res.data;

      // Ambil favorit IDs jika klien
      if (user && user.role === 'client') {
        try {
          var favRes = await apiGet('/favorites/' + user.id + '/ids');
          favIds = favRes.ok ? favRes.data : [];
        } catch (e) { favIds = []; }
      } else {
        favIds = [];
      }

      // Filter kategori
      var filtered = currentFilter === 'all'
        ? catalog
        : catalog.filter(function (p) { return p.cat === currentFilter; });

      if (filtered.length === 0) {
        grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:60px 20px;color:var(--tx3);"><div style="font-size:48px;margin-bottom:16px;">📦</div><p>Belum ada produk di kategori ini.</p>' +
          (Auth.isAdmin() ? '<p style="margin-top:8px;">Gunakan tombol <strong>+ Tambah Produk</strong> untuk menambahkan.</p>' : '') + '</div>';
        return;
      }

      grid.innerHTML = filtered.map(function (prod) {
        var catLabel = prod.cat.charAt(0).toUpperCase() + prod.cat.slice(1);
        var isFav    = favIds.indexOf(prod.id) !== -1;
        return (
          '<div class="prod-card" data-c="' + prod.cat + '" data-id="' + prod.id + '">' +
            '<div class="prod-img">' +
              '<img src="' + prod.img + '" alt="' + prod.alt + '" loading="lazy" onerror="this.parentElement.style.background=\'#eee\'"/>' +
              '<span class="cat-badge">' + catLabel + '</span>' +
              '<button class="prod-fav-btn" data-pid="' + prod.id + '" title="' + (isFav ? 'Hapus dari Favorit' : 'Tambah ke Favorit') + '">' + (isFav ? '❤️' : '🤍') + '</button>' +
              '<div class="prod-admin-btns">' +
                '<button class="prod-edit-btn" data-pid="' + prod.id + '">✏ Edit</button>' +
                '<button class="prod-del-btn"  data-pid="' + prod.id + '">🗑 Hapus</button>' +
              '</div>' +
            '</div>' +
            '<div class="prod-body">' +
              '<div class="prod-cat">' + catLabel + '</div>' +
              '<div class="prod-name">' + prod.name + '</div>' +
              '<div class="prod-price-custom">' + (prod.harga || 'Harga menyesuaikan desain') + '</div>' +
              '<a href="https://wa.me/6281313811372?text=' + (prod.wa || '') + '" target="_blank" class="prod-tanya">' + WA_ICON + ' Tanya Harga →</a>' +
            '</div>' +
          '</div>'
        );
      }).join('');

      // Event: tombol favorit
      grid.querySelectorAll('.prod-fav-btn').forEach(function (btn) {
        btn.addEventListener('click', async function (e) {
          e.stopPropagation();
          var user = Auth.getUser();
          if (!user) { showToast('Login dulu untuk menambahkan favorit!', 'err'); return; }
          var pid = parseInt(btn.getAttribute('data-pid'));
          try {
            var res = await apiPost('/favorites/toggle', { user_id: user.id, product_id: pid });
            if (!res.ok) { showToast(res.msg || 'Gagal.', 'err'); return; }
            var added = res.added;
            btn.textContent = added ? '❤️' : '🤍';
            btn.title = added ? 'Hapus dari Favorit' : 'Tambah ke Favorit';
            btn.classList.toggle('active', added);
            if (added) { favIds.push(pid); } else { favIds = favIds.filter(function(id){ return id !== pid; }); }
            updateFavCount();
            showToast(added ? 'Ditambahkan ke Favorit ❤' : 'Dihapus dari Favorit', added ? 'fav' : '');
          } catch (e) { showToast('Gagal konek ke server.', 'err'); }
        });
      });

      // Event: tombol edit (admin)
      grid.querySelectorAll('.prod-edit-btn').forEach(function (btn) {
        btn.addEventListener('click', async function (e) {
          e.stopPropagation();
          await openEditProduct(parseInt(btn.getAttribute('data-pid')));
        });
      });

      // Event: tombol hapus (admin)
      grid.querySelectorAll('.prod-del-btn').forEach(function (btn) {
        btn.addEventListener('click', async function (e) {
          e.stopPropagation();
          var pid = parseInt(btn.getAttribute('data-pid'));
          if (!confirm('Hapus produk ini dari katalog?')) return;
          try {
            var res = await apiDelete('/catalog/' + pid);
            if (res.ok) {
              showToast('Produk berhasil dihapus.', 'err');
              renderCatalog(currentFilter);
            } else {
              showToast(res.msg || 'Gagal menghapus.', 'err');
            }
          } catch (e) { showToast('Gagal konek ke server.', 'err'); }
        });
      });

    } catch (err) {
      grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:60px;color:#e53e3e;">❌ Gagal memuat katalog.<br><small>Pastikan server backend sudah dijalankan.</small><br><small style="color:var(--tx3);">node server.js di folder backend/</small></div>';
    }
  }

  /* ═══════════════════════════════════════════════════
   * PANEL FAVORIT
   * ═══════════════════════════════════════════════════ */
  async function renderFavPanel() {
    var user = Auth.getUser();
    if (!user) return;
    var body = document.getElementById('favBody');
    body.innerHTML = '<div style="text-align:center;padding:40px;color:var(--tx3);">⏳ Memuat...</div>';

    try {
      var res = await apiGet('/favorites/' + user.id);
      if (!res.ok) throw new Error(res.msg);
      var prods = res.data;

      if (prods.length === 0) {
        body.innerHTML = '<div class="fav-empty"><span class="fav-empty-icon">🤍</span><p>Belum ada produk favorit.<br>Tekan tombol ❤ di kartu produk.</p></div>';
        return;
      }

      body.innerHTML = prods.map(function (prod) {
        var catLabel = prod.cat.charAt(0).toUpperCase() + prod.cat.slice(1);
        return (
          '<div class="fav-item">' +
            '<img class="fav-item-img" src="' + prod.img + '" alt="' + prod.alt + '" onerror="this.style.background=\'#eee\'"/>' +
            '<div class="fav-item-info">' +
              '<div class="fav-item-cat">' + catLabel + '</div>' +
              '<div class="fav-item-name">' + prod.name + '</div>' +
            '</div>' +
            '<button class="fav-item-remove" data-fid="' + prod.id + '" title="Hapus dari favorit">✕</button>' +
          '</div>'
        );
      }).join('');

      body.querySelectorAll('.fav-item-remove').forEach(function (btn) {
        btn.addEventListener('click', async function () {
          var pid = parseInt(btn.getAttribute('data-fid'));
          await apiDelete('/favorites/' + user.id + '/' + pid);
          updateFavCount();
          renderFavPanel();
          renderCatalog(currentFilter);
        });
      });

    } catch (e) {
      body.innerHTML = '<div class="fav-empty"><span class="fav-empty-icon">❌</span><p>Gagal memuat favorit.</p></div>';
    }
  }

  /* ═══════════════════════════════════════════════════
   * FORM PRODUK (ADMIN)
   * ═══════════════════════════════════════════════════ */
  function resetProdForm() {
    ['editProdId','prodNama','prodHarga','prodImg','prodAlt','prodWA'].forEach(function(id){ document.getElementById(id).value = ''; });
    document.getElementById('prodKat').value = 'souvenir';
    document.getElementById('prodModalTitle').textContent = 'Tambah Produk';
    hideErr('prodErr');
  }

  async function openEditProduct(id) {
    try {
      var res = await apiGet('/catalog/' + id);
      if (!res.ok) { showToast('Produk tidak ditemukan.', 'err'); return; }
      var p = res.data;
      document.getElementById('editProdId').value = p.id;
      document.getElementById('prodNama').value   = p.name;
      document.getElementById('prodKat').value    = p.cat;
      document.getElementById('prodHarga').value  = p.harga || '';
      document.getElementById('prodImg').value    = p.img;
      document.getElementById('prodAlt').value    = p.alt;
      document.getElementById('prodWA').value     = p.wa || '';
      document.getElementById('prodModalTitle').textContent = 'Edit Produk';
      hideErr('prodErr');
      openModal('prodModal');
    } catch (e) { showToast('Gagal memuat data produk.', 'err'); }
  }

  document.getElementById('btnAddProd').addEventListener('click', function () {
    resetProdForm(); openModal('prodModal');
  });

  document.getElementById('saveProd').addEventListener('click', async function () {
    var id    = document.getElementById('editProdId').value;
    var name  = document.getElementById('prodNama').value.trim();
    var cat   = document.getElementById('prodKat').value;
    var harga = document.getElementById('prodHarga').value.trim() || 'Harga menyesuaikan desain';
    var img   = document.getElementById('prodImg').value.trim() || 'costum souvenir.jpg';
    var alt   = document.getElementById('prodAlt').value.trim() || name;
    var wa    = document.getElementById('prodWA').value.trim();

    if (!name) { showErr('prodErr', 'Nama produk wajib diisi.'); return; }
    hideErr('prodErr');

    try {
      var res;
      if (id) {
        res = await apiPut('/catalog/' + id, { name, cat, img, alt, harga, wa });
        if (res.ok) showToast('Produk berhasil diupdate! ✏', 'success');
      } else {
        res = await apiPost('/catalog', { name, cat, img, alt, harga, wa });
        if (res.ok) showToast('Produk baru ditambahkan! 🎉', 'success');
      }
      if (!res.ok) { showErr('prodErr', res.msg || 'Gagal menyimpan produk.'); return; }
      closeModal('prodModal');
      renderCatalog(currentFilter);
    } catch (e) { showErr('prodErr', 'Gagal konek ke server. Pastikan backend jalan.'); }
  });

  document.getElementById('cancelProd').addEventListener('click', function () { closeModal('prodModal'); });
  document.getElementById('closeProdModal').addEventListener('click', function () { closeModal('prodModal'); });

  /* ═══════════════════════════════════════════════════
   * LOGIN / REGISTER
   * ═══════════════════════════════════════════════════ */
  document.getElementById('openLoginBtn').addEventListener('click', function () {
    hideErr('loginErr'); hideErr('regErr'); openModal('loginModal');
  });
  document.getElementById('closeLoginModal').addEventListener('click', function () { closeModal('loginModal'); });

  document.getElementById('tabLogin').addEventListener('click', function () {
    document.getElementById('tabLogin').classList.add('on');
    document.getElementById('tabRegister').classList.remove('on');
    document.getElementById('panelLogin').classList.remove('hidden');
    document.getElementById('panelRegister').classList.add('hidden');
  });
  document.getElementById('tabRegister').addEventListener('click', function () {
    document.getElementById('tabRegister').classList.add('on');
    document.getElementById('tabLogin').classList.remove('on');
    document.getElementById('panelRegister').classList.remove('hidden');
    document.getElementById('panelLogin').classList.add('hidden');
  });

  document.getElementById('togglePass').addEventListener('click', function () {
    var i = document.getElementById('loginPass'); i.type = i.type === 'password' ? 'text' : 'password';
  });
  document.getElementById('toggleRegPass').addEventListener('click', function () {
    var i = document.getElementById('regPass'); i.type = i.type === 'password' ? 'text' : 'password';
  });

  // Login
  document.getElementById('doLogin').addEventListener('click', async function () {
    var username = document.getElementById('loginUser').value.trim();
    var password = document.getElementById('loginPass').value;
    hideErr('loginErr');
    if (!username || !password) { showErr('loginErr', 'Username dan password wajib diisi.'); return; }
    try {
      var res = await apiPost('/auth/login', { username, password });
      if (!res.ok) { showErr('loginErr', res.msg || 'Login gagal.'); return; }
      Auth.login(res.user);
      closeModal('loginModal');
      updateUI();
      showToast('Selamat datang, ' + res.user.nama + '! 👋', 'success');
    } catch (e) {
      showErr('loginErr', 'Gagal konek ke server. Pastikan backend sudah dijalankan.');
    }
  });

  document.getElementById('loginPass').addEventListener('keydown', function (e) {
    if (e.key === 'Enter') document.getElementById('doLogin').click();
  });

  // Register
  document.getElementById('doRegister').addEventListener('click', async function () {
    var nama     = document.getElementById('regNama').value.trim();
    var username = document.getElementById('regUser').value.trim();
    var password = document.getElementById('regPass').value;
    hideErr('regErr');
    if (!nama)              { showErr('regErr', 'Nama lengkap wajib diisi.'); return; }
    if (!username)          { showErr('regErr', 'Username wajib diisi.'); return; }
    if (username.length<3)  { showErr('regErr', 'Username minimal 3 karakter.'); return; }
    if (!password)          { showErr('regErr', 'Password wajib diisi.'); return; }
    if (password.length<6)  { showErr('regErr', 'Password minimal 6 karakter.'); return; }
    try {
      var res = await apiPost('/auth/register', { nama, username, password });
      if (!res.ok) { showErr('regErr', res.msg || 'Registrasi gagal.'); return; }
      Auth.login(res.user);
      closeModal('loginModal');
      updateUI();
      showToast('Akun berhasil dibuat! Selamat datang, ' + nama + ' 🎉', 'success');
    } catch (e) {
      showErr('regErr', 'Gagal konek ke server. Pastikan backend sudah dijalankan.');
    }
  });

  // Logout
  document.getElementById('logoutBtn').addEventListener('click', function () {
    var nama = Auth.getUser() ? Auth.getUser().nama : '';
    Auth.logout(); updateUI(); showToast('Sampai jumpa, ' + nama + '! 👋');
  });

  // Overlay click
  document.getElementById('modalOverlay').addEventListener('click', function () {
    closeModal('loginModal'); closeModal('prodModal');
    document.getElementById('favPanel').classList.remove('open');
  });

  /* ═══════════════════════════════════════════════════
   * PANEL FAVORIT
   * ═══════════════════════════════════════════════════ */
  document.getElementById('navFavBtn').addEventListener('click', function () {
    renderFavPanel();
    document.getElementById('favPanel').classList.add('open');
    openOverlay();
  });
  document.getElementById('closeFavPanel').addEventListener('click', function () {
    document.getElementById('favPanel').classList.remove('open'); closeOverlay();
  });

  /* ═══════════════════════════════════════════════════
   * FILTER KATEGORI
   * ═══════════════════════════════════════════════════ */
  document.querySelectorAll('.cat-tab').forEach(function (tab) {
    tab.addEventListener('click', function () {
      document.querySelectorAll('.cat-tab').forEach(function (t) { t.classList.remove('on'); });
      tab.classList.add('on');
      renderCatalog(tab.getAttribute('data-cat'));
    });
  });

  /* ═══════════════════════════════════════════════════
   * COUNTER ANIMASI HERO
   * ═══════════════════════════════════════════════════ */
  var heroStats = document.querySelector('.hero-stats');
  var counterObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.querySelectorAll('[data-target]').forEach(function (el) {
        var target = parseInt(el.getAttribute('data-target'));
        var step = target / 50, current = 0;
        var interval = setInterval(function () {
          current = Math.min(current + step, target);
          el.textContent = Math.floor(current) + (target === 100 ? '' : '+');
          if (current >= target) clearInterval(interval);
        }, 25);
      });
      counterObserver.unobserve(entry.target);
    });
  }, { threshold: 0.4 });
  if (heroStats) counterObserver.observe(heroStats);

  /* ═══════════════════════════════════════════════════
   * DARK MODE
   * ═══════════════════════════════════════════════════ */
  var darkToggle = document.getElementById('darkToggle');
  var html = document.documentElement;
  if (localStorage.getItem('darkMode') === 'true') {
    html.classList.add('dark'); darkToggle.textContent = '☀️';
  }
  darkToggle.addEventListener('click', function () {
    html.classList.toggle('dark');
    var isDark = html.classList.contains('dark');
    darkToggle.textContent = isDark ? '☀️' : '🌙';
    localStorage.setItem('darkMode', isDark);
  });

  /* ═══════════════════════════════════════════════════
   * ACTIVE LINK SCROLL
   * ═══════════════════════════════════════════════════ */
  var sections = document.querySelectorAll('section[id]');
  var navLinks = document.querySelectorAll('.nav-links a');
  window.addEventListener('scroll', function () {
    var current = '';
    sections.forEach(function (sec) { if (window.scrollY >= sec.offsetTop - 90) current = sec.id; });
    navLinks.forEach(function (link) {
      link.classList.remove('act');
      if (link.getAttribute('href') === '#' + current) link.classList.add('act');
    });
  });

  /* ═══════════════════════════════════════════════════
   * HAMBURGER MENU
   * ═══════════════════════════════════════════════════ */
  var hamburger  = document.getElementById('hbg');
  var mobileMenu = document.getElementById('mobm');
  hamburger.addEventListener('click', function () { mobileMenu.classList.toggle('open'); });
  mobileMenu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () { mobileMenu.classList.remove('open'); });
  });

  /* ═══════════════════════════════════════════════════
   * FORM KONTAK
   * ═══════════════════════════════════════════════════ */
  document.getElementById('sendBtn').addEventListener('click', function () {
    var nama  = document.getElementById('f-nama').value.trim();
    var wa    = document.getElementById('f-wa').value.trim();
    var pesan = document.getElementById('f-msg').value.trim();
    if (!nama || !wa || !pesan) { showToast('Mohon isi Nama, No. WhatsApp, dan Pesan.', 'err'); return; }
    showToast('Pesan terkirim! Kami akan menghubungi Anda segera.', 'success');
    document.getElementById('f-nama').value = '';
    document.getElementById('f-wa').value   = '';
    document.getElementById('f-prod').value = '';
    document.getElementById('f-msg').value  = '';
  });

  /* ═══════════════════════════════════════════════════
   * INIT
   * ═══════════════════════════════════════════════════ */
  updateUI();

}); // end DOMContentLoaded
