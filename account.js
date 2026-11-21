 const ADMIN_LOGIN = "DestaAdmin";
const ADMIN_PASSWORD = "Chan_y_UwU45";
let isAdmin = false;
let authMode = 'login';


function readUsers(){ try{return JSON.parse(localStorage.getItem('site_users')||'{}')}catch{return {}} }

function setAuthMode(mode){
  authMode=mode;
  document.getElementById('loginTab').classList.toggle('active',mode==='login');
  document.getElementById('registerTab').classList.toggle('active',mode==='register');
  document.getElementById('authSubmit').textContent=mode==='login'?'Войти':'Зарегистрироваться';
  document.getElementById('authError').textContent='';
}


function handleAuth(){
  const login=document.getElementById('authPhone').value.trim();
  const pass=document.getElementById('authPass').value;
  const error=document.getElementById('authError');
  
  if(!login || pass.length<6){
    error.textContent='Введите логин и пароль (не менее 6 символов).';
    return;
  }
  
  if(login===ADMIN_LOGIN){
    if(pass!==ADMIN_PASSWORD){
      error.textContent='Неверный пароль администратора.';
      return;
    }
    isAdmin=true;
  } else {
    isAdmin=false;
    const users=readUsers();
    if(authMode==='register'){
      if(users[login]){
        error.textContent='Такой логин уже зарегистрирован.';
        return;
      }
      users[login]={password:pass,createdAt:Date.now()};
      localStorage.setItem('site_users',JSON.stringify(users));
      localStorage.setItem('site_registered_users',String(Object.keys(users).length));
    } else if(!users[login] || users[login].password!==pass){
      error.textContent='Аккаунт не найден или пароль неверный.';
      return;
    }
  }
  
  localStorage.setItem('user_role',isAdmin?'admin':'user');
  localStorage.setItem('user_phone',login);
  loadProfile(login);
}

function loadProfile(login){
  document.getElementById('authScreen').hidden=true;
  document.getElementById('profileScreen').hidden=false;
  document.getElementById('displayName').textContent=isAdmin?'👑 Администратор':'Читатель';
  document.getElementById('displayLogin').textContent=login;
  
  // Скрываем кнопку Админки для обычных юзеров
  document.getElementById('btnGoToAdmin').hidden=!isAdmin; 
  document.getElementById('adminPanel').hidden=true;
  
  // --- ЛОГИКА АВАТАРКИ ---
  const avatarPreview = document.getElementById('avatar-preview');
  const plusBtn = document.querySelector('.plus-btn');
  const avatarLetter = document.getElementById('avatarLetter');

  const savedAvatar = localStorage.getItem('avatar_' + login);

  if (savedAvatar) {
    avatarPreview.src = savedAvatar;
    avatarPreview.style.display = 'block';
    if(plusBtn) plusBtn.style.display = 'none';
    if(avatarLetter) avatarLetter.style.display = 'none';
  } else {
    avatarPreview.src = '';
    avatarPreview.style.display = 'none';
    if(plusBtn) plusBtn.style.display = 'flex'; 
    if(avatarLetter) {
        avatarLetter.style.display = 'block';
        avatarLetter.textContent = isAdmin ? 'A' : (login.charAt(0).toUpperCase() || 'U');
    }
  }

  // Передаем логин в функцию прочитанных рассказов
  loadReadStories(login);
}

function loadReadStories(login){
  // Ищем рассказы КОНКРЕТНО ЭТОГО пользователя
  const stories=[
    ['story_last_shot_read_' + login, 'Последний выстрел'],
    ['story_struni_read_' + login, 'Струны судьбы']
  ];
  
  const read=stories.filter(([key])=>localStorage.getItem(key)==='true');
  document.getElementById('statsReadCount').textContent=read.length;
  const list=document.getElementById('storiesList');
  
  if(!read.length){
    list.innerHTML='<div class="empty-state">Вы пока не прочитали ни одной истории.<br>Когда дочитаете рассказ, он появится здесь.</div>';
    return;
  }
  list.innerHTML=read.map(([,title])=>`<div class="story-row"><span class="story-title">📖 ${title}</span><span class="story-status">✓ Прочитано</span></div>`).join('');
}

function switchTab(tab){
  const stories=tab==='stories';
  document.getElementById('tabStories').hidden=!stories;
  document.getElementById('tabGames').hidden=stories;
  document.getElementById('storiesTab').classList.toggle('active',stories);
  document.getElementById('gamesTab').classList.toggle('active',!stories);
}

function showAdmin(){
  if(!isAdmin)return;
  document.getElementById('adminPanel').hidden=false;
  document.getElementById('statVisits').textContent=localStorage.getItem('site_visits')||'0';
  document.getElementById('statUsers').textContent=localStorage.getItem('site_registered_users')||Object.keys(readUsers()).length;
  document.getElementById('statBot').textContent=localStorage.getItem('site_bot_clicks')||'0';
  document.getElementById('adminPanel').scrollIntoView({behavior:'smooth',block:'start'});
}

function logout(){
  localStorage.removeItem('user_role');
  localStorage.removeItem('user_phone');
  isAdmin=false;
  
  const avatarPreview = document.getElementById('avatar-preview');
  const plusBtn = document.querySelector('.plus-btn');
  if(avatarPreview) { avatarPreview.src = ''; avatarPreview.style.display = 'none'; }
  if(plusBtn) plusBtn.style.display = 'flex';

  document.getElementById('profileScreen').hidden=true;
  document.getElementById('authScreen').hidden=false;
  document.getElementById('authPass').value='';
  document.getElementById('authPhone').value='';
  document.getElementById('authError').textContent='';
  setAuthMode('login');
}

// Запуск при загрузке страницы
document.addEventListener('DOMContentLoaded',()=>{
  const role=localStorage.getItem('user_role');
  const login=localStorage.getItem('user_phone');
  
  if(role&&login){
    isAdmin=role==='admin';
    loadProfile(login);
  }

  // --- СКРИПТ ДЛЯ ЗАГРУЗКИ АВАТАРКИ ---
  const fileInput = document.getElementById('file-input');
  const avatarPreview = document.getElementById('avatar-preview');
  const plusBtn = document.querySelector('.plus-btn');
  const avatarLetter = document.getElementById('avatarLetter');

  if (fileInput) {
    fileInput.addEventListener('change', function(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
          const base64Image = e.target.result;
          avatarPreview.src = base64Image; 
          avatarPreview.style.display = 'block'; 
          
          if(plusBtn) plusBtn.style.display = 'none'; 
          if(avatarLetter) avatarLetter.style.display = 'none'; 

          const currentLogin = localStorage.getItem('user_phone');
          if(currentLogin) {
              localStorage.setItem('avatar_' + currentLogin, base64Image);
          }
        }
        reader.readAsDataURL(file);
      }
    });
  }
 
});
