// Демонстрационная авторизация для статического сайта. Для реального сайта
// учётные записи и пароли нужно перенести на сервер.
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
  if(!login || pass.length<6){error.textContent='Введите логин и пароль (не менее 6 символов).';return;}
  if(login===ADMIN_LOGIN){
    if(pass!==ADMIN_PASSWORD){error.textContent='Неверный пароль администратора.';return;}
    isAdmin=true;
  } else {
    isAdmin=false;
    const users=readUsers();
    if(authMode==='register'){
      if(users[login]){error.textContent='Такой логин уже зарегистрирован.';return;}
      users[login]={password:pass,createdAt:Date.now()};
      localStorage.setItem('site_users',JSON.stringify(users));
      localStorage.setItem('site_registered_users',String(Object.keys(users).length));
    } else if(!users[login] || users[login].password!==pass){
      error.textContent='Аккаунт не найден или пароль неверный. Зарегистрируйтесь, если вы здесь впервые.';return;
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
  document.getElementById('avatarLetter').textContent=isAdmin?'A':(login.charAt(0).toUpperCase()||'U');
  document.getElementById('btnGoToAdmin').hidden=!isAdmin;
  document.getElementById('adminPanel').hidden=true;
  loadReadStories();
}
function loadReadStories(){
  const stories=[['story_last_shot_read','Последний выстрел'],['story_struni_read','Струны судьбы']];
  const read=stories.filter(([key])=>localStorage.getItem(key)==='true');
  document.getElementById('statsReadCount').textContent=read.length;
  const list=document.getElementById('storiesList');
  if(!read.length){list.innerHTML='<div class="empty-state">Вы пока не прочитали ни одной истории.<br>Когда дочитаете рассказ, он появится здесь.</div>';return;}
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
  localStorage.removeItem('user_role');localStorage.removeItem('user_phone');isAdmin=false;
  document.getElementById('profileScreen').hidden=true;document.getElementById('authScreen').hidden=false;
  document.getElementById('authPass').value='';document.getElementById('authPhone').value='';document.getElementById('authError').textContent='';
  setAuthMode('login');
}
document.addEventListener('DOMContentLoaded',()=>{
  const role=localStorage.getItem('user_role');const login=localStorage.getItem('user_phone');
  if(role&&login){isAdmin=role==='admin';loadProfile(login);}
});
