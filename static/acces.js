/* ANA demo, online version: simple access gate. It only keeps casual visitors out: the check runs in
   the browser, so it is NOT security. Only a salted SHA-256 fingerprint of the password is stored. */
(function () {
  'use strict';
  var KEY = 'ana-demo-acces';
  var SALT = 'ana-demo-online|';
  var HASH = '63a6baf64939671feeed3d9cfe3b16dfdce2df164f334541175ad942bfdbbbeb';
  var PAGES = /^(index|profil|pagina-[1-3])\.html$/;
  var script = document.currentScript;
  var isLogin = !!(script && script.getAttribute('data-pagina') === 'login');
  function has() { try { return sessionStorage.getItem(KEY) === '1'; } catch (e) { return false; } }
  function here() { return location.pathname.split('/').pop() || 'index.html'; }
  function guard() {
    if (isLogin || has()) { document.documentElement.classList.add('ok'); return; }
    location.replace('login.html?next=' + encodeURIComponent(here()));
  }
  guard();
  window.addEventListener('pageshow', function (e) { if (e.persisted) { guard(); } });
  async function digest(text) {
    var buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
    return Array.from(new Uint8Array(buf)).map(function (b) { return b.toString(16).padStart(2, '0'); }).join('');
  }
  window.ANA_ACCES = {
    login: async function (password) {
      if ((await digest(SALT + password)) !== HASH) { return false; }
      try { sessionStorage.setItem(KEY, '1'); } catch (e) { return false; }
      var next = new URLSearchParams(location.search).get('next') || '';
      location.replace(PAGES.test(next) ? next : 'index.html');
      return true;
    },
    logout: function () {
      try { sessionStorage.removeItem(KEY); } catch (e) { /* nothing to clear */ }
      location.replace('login.html');
    }
  };
})();
