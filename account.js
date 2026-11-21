// Демонстрационная авторизация для статического сайта (без сервера).
// Один скрипт работает и для login.html, и для account.html.

const ADMIN_LOGIN    = "DestaAdmin";
const ADMIN_PASSWORD = "Chan_y_UwU45";

let isAdmin  = false;
let authMode = 'login';

/* ---------- Утилиты ---------- */
function readUsers() {
  try { return JSON.parse(localStorage.getItem('site_users') || '{}'); }
  catch { return {}; }
}
function saveUsers(users) {
  localStorage.setItem('site_users', JSON.stringify(users));
  localStorage.setItem('site_registered_users', String(Object.keys(users).length));
}
function isLoggedIn() {
  return !!(localStorage.getItem('user_role') && localStorage.getItem('user_phone'));
}

/* ============================================================
   ЧАСТЬ 1. СТРАНИЦА ВХОДА (login.html)
   ============================================================ */
function setAuthMode(mode) {
  authMode = mode;
  document.getElementById('loginTab').classList.toggle('active',    mode === 'login');
  document.getElementById('registerTab').classList.toggle('active', mode === 'register');
  document.getElementById('authSubmit').textContent =
    mode === 'login' ? 'Войти' : 'Зарегистрироваться';
  document.getElementById('authError').textContent = '';
}

function handleAuth() {
  const login = document.getElementById('authPhone').value.trim();
  const pass  = document.getElementById('authPass').value;
  const error = document.getElementById('authError');

  if (!login || pass.length < 6) {
    error.textContent = 'Введите логин и пароль (не менее 6 символов).';
    return;
  }

  if (login === ADMIN_LOGIN) {
    if (pass !== ADMIN_PASSWORD) {
      error.textContent = 'Неверный пароль администратора.';
      return;
    }
    isAdmin = true;
  } else {
    isAdmin = false;
    const users = readUsers();

    if (authMode === 'register') {
      if (users[login]) {
        error.textContent = 'Такой логин уже зарегистрирован.';
        return;
      }
      users[login] = { password: pass, createdAt: Date.now() };
      saveUsers(users);
    } else {
      if (!users[login] || users[login].password !== pass) {
        error.textContent = 'Аккаунт не найден или пароль неверный.';
        return;
      }
    }
  }

  // Запоминаем сессию
  localStorage.setItem('user_role',  isAdmin ? 'admin' : 'user');
  localStorage.setItem('user_phone', login);

  // Переходим в профиль (это уже другая страница)
  window.location.href = 'account.html';
}

/* ============================================================
   ЧАСТЬ 2. СТРАНИЦА ПРОФИЛЯ (account.html)
   ============================================================ */
function updateAvatar(login) {
  const container = document.getElementById('avatarContainer');
  if (!container) return;

  const preview = document.getElementById('avatar-preview');
  const letter  = document.getElementById('avatarLetter');
  const saved   = localStorage.getItem('avatar_' + login);

  if (saved) {
    preview.src = saved;
    container.classList.add('has-photo');
  } else {
    preview.removeAttribute('src');
    container.classList.remove('has-photo');
    letter.textContent = isAdmin ? 'A' : (login.charAt(0).toUpperCase() || '?');
  }
}

function loadReadStories(login) {
  const stories = [
    ['story_last_shot_read_' + login, 'Последний выстрел'],
    ['story_struni_read_'    + login, 'Струны судьбы']
  ];
  const read = stories.filter(([key]) => localStorage.getItem(key) === 'true');

  const counter = document.getElementById('statsReadCount');
  if (counter) counter.textContent = read.length;

  const list = document.getElementById('storiesList');
  if (!list) return;

  if (!read.length) {
    list.innerHTML = '<div class="empty-state">Вы пока не прочитали ни одной истории.<br>Когда дочитаете рассказ, он появится здесь.</div>';
    return;
  }
  list.innerHTML = read.map(([, title]) =>
    `<div class="story-row"><span class="story-title">📖 ${title}</span><span class="story-status">✓ Прочитано</span></div>`
  ).join('');
}

function loadProfile(login) {
  document.getElementById('displayName').textContent  = isAdmin ? '👑 Администратор' : 'Читатель';
  document.getElementById('displayLogin').textContent = login;

  document.getElementById('btnGoToAdmin').hidden = !isAdmin;
  document.getElementById('adminPanel').hidden   = true;

  updateAvatar(login);
  loadReadStories(login);
}

function switchTab(tab) {
  const stories = tab === 'stories';
  document.getElementById('tabStories').hidden = !stories;
  document.getElementById('tabGames').hidden   = stories;
  document.getElementById('storiesTab').classList.toggle('active',  stories);
  document.getElementById('gamesTab').classList.toggle('active',  !stories);
}

function showAdmin() {
  if (!isAdmin) return;
  document.getElementById('adminPanel').hidden = false;
  document.getElementById('statVisits').textContent = localStorage.getItem('site_visits') || '0';
  document.getElementById('statUsers').textContent  =
    localStorage.getItem('site_registered_users') || Object.keys(readUsers()).length;
  document.getElementById('statBot').textContent    = localStorage.getItem('site_bot_clicks') || '0';
  document.getElementById('adminPanel').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function logout() {
  localStorage.removeItem('user_role');
  localStorage.removeItem('user_phone');
  isAdmin = false;
  window.location.href = 'login.html';   // возвращаем на форму входа
}

/* ============================================================
   ЧАСТЬ 3. ИНИЦИАЛИЗАЦИЯ — что делать в зависимости от страницы
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {

  const onLoginPage   = !!document.getElementById('authScreen')    === false
                        && !!document.getElementById('authPhone');
  const onAccountPage = !!document.getElementById('profileScreen');

  /* --- Страница входа (login.html) --- */
  if (onLoginPage) {
    // Если уже вошёл — уводим в профиль (страховка, если head-скрипт не сработал)
    if (isLoggedIn()) {
      window.location.replace('account.html');
      return;
    }
    // Ничего больше не нужно — форма готова
    return;
  }

  /* --- Страница профиля (account.html) --- */
  if (onAccountPage) {
    // Если не вошёл — уводим на форму входа
    if (!isLoggedIn()) {
      window.location.replace('login.html');
      return;
    }

    const role  = localStorage.getItem('user_role');
    const login = localStorage.getItem('user_phone');
    isAdmin = role === 'admin';
    loadProfile(login);

    // Загрузка / смена аватара
    const fileInput = document.getElementById('file-input');
    if (fileInput) {
      fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
          alert('Фото слишком большое. Максимум 2 МБ.');
          fileInput.value = '';
          return;
        }

        const reader = new FileReader();
        reader.onload = (ev) => {
          const loginNow = localStorage.getItem('user_phone');
          if (!loginNow) return;

          try {
            localStorage.setItem('avatar_' + loginNow, ev.target.result);
          } catch (err) {
            alert('Не удалось сохранить фото (память браузера переполнена).');
            return;
          }
          updateAvatar(loginNow);
          fileInput.value = '';
        };
        reader.readAsDataURL(file);
      });
    }
    return;
  }
});