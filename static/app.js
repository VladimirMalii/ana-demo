(function () {
  'use strict';
  document.querySelectorAll('[data-logout]').forEach(function (b) {
    b.addEventListener('click', function () { window.ANA_ACCES.logout(); });
  });
  var tabs = document.querySelectorAll('.tabs button');
  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      tabs.forEach(function (t) { t.classList.toggle('on', t === tab); });
      document.querySelectorAll('.panel').forEach(function (p) {
        p.classList.toggle('on', p.id === tab.getAttribute('data-tab'));
      });
    });
  });
  function reveal() {
    var status = document.getElementById('status-text');
    var items = document.querySelectorAll('#read .rd-entry, #read .rd > p, #read .rd > h4');
    items.forEach(function (el) { el.classList.remove('reveal'); el.style.visibility = 'hidden'; });
    if (status) { status.textContent = 'Se citește documentul…'; status.classList.add('typing'); }
    items.forEach(function (el, i) {
      setTimeout(function () {
        el.style.visibility = ''; el.classList.add('reveal');
        if (i === items.length - 1 && status) {
          status.classList.remove('typing');
          status.textContent = status.getAttribute('data-done');
        }
      }, 350 + i * 260);
    });
  }
  var again = document.getElementById('replay');
  if (again) { again.addEventListener('click', reveal); reveal(); }
  var login = document.getElementById('login-form');
  if (login) {
    login.addEventListener('submit', async function (e) {
      e.preventDefault();
      var ok = await window.ANA_ACCES.login(document.getElementById('parola').value);
      if (!ok) { document.getElementById('login-err').textContent = 'Parolă greșită.'; }
    });
  }
})();
