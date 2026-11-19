
        // ⚠️ ТВОИ ЛИЧНЫЕ ДАННЫЕ ДЛЯ ВХОДА В АДМИНКУ ⚠️
        const ADMIN_LOGIN = "DestaAdmin"; // Твой логин
        const ADMIN_PASSWORD = "Chan_y_UwU45"; // Твой пароль
        
        let isAdmin = false;

        function switchTab(mode) {
            const tabs = document.querySelectorAll('.auth-tab');
            tabs.forEach(t => t.classList.remove('active'));
            
            if (mode === 'login') {
                tabs[0].classList.add('active');
                document.getElementById('submitBtn').innerText = 'Войти';
            } else {
                tabs[1].classList.add('active');
                document.getElementById('submitBtn').innerText = 'Зарегистрироваться';
            }
            document.getElementById('authError').innerText = '';
        }

        function handleAuth() {
            const login = document.getElementById('authPhone').value.trim();
            const pass = document.getElementById('authPass').value;
            const errorMsg = document.getElementById('authError');

            if (!login || pass.length < 6) {
                errorMsg.innerText = "Заполните все поля (пароль от 6 символов)";
                return;
            }

            // Проверка на админа
            if (login === ADMIN_LOGIN && pass === ADMIN_PASSWORD) {
                isAdmin = true;
                localStorage.setItem('user_role', 'admin');
                localStorage.setItem('user_phone', login);
            } 
            else if (login === ADMIN_LOGIN && pass !== ADMIN_PASSWORD) {
                errorMsg.innerText = "Неверный пароль администратора!";
                return; 
            }
            else {
                isAdmin = false;
                localStorage.setItem('user_role', 'user');
                localStorage.setItem('user_phone', login);
            }

            loadProfile(login);
        }

        function loadProfile(login) {
            // Скрываем окно входа, показываем профиль
            document.getElementById('authScreen').classList.add('hidden');
            document.getElementById('profileScreen').classList.remove('hidden');

            document.getElementById('displayName').innerText = isAdmin ? "👑 Администратор" : "Читатель";
            document.getElementById('displayPhone').innerText = login;
            
            let firstLetter = isAdmin ? "A" : login.charAt(0).toUpperCase();
            document.getElementById('avatarLetter').innerText = firstLetter;

            if (isAdmin) {
                document.getElementById('btnGoToAdmin').classList.remove('hidden');
            } else {
                document.getElementById('btnGoToAdmin').classList.add('hidden');
            }

            loadReadStories();
        }

        function logout() {
            localStorage.removeItem('user_role');
            localStorage.removeItem('user_phone');
            isAdmin = false;
            
            document.getElementById('profileScreen').classList.add('hidden');
            document.getElementById('authScreen').classList.remove('hidden');
            document.getElementById('authPass').value = '';
            document.getElementById('authPhone').value = '';
            document.getElementById('btnGoToAdmin').classList.add('hidden');
        }

        function loadReadStories() {
            const list = document.getElementById('readStoriesList');
            const stats = document.getElementById('statsReadCount');
            list.innerHTML = '';
            let count = 0;

            if (localStorage.getItem('story_last_shot_read') === 'true') {
                list.innerHTML += '<li>📖 Последний выстрел</li>';
                count++;
            }
            if (localStorage.getItem('story_struni_read') === 'true') {
                list.innerHTML += '<li>📖 Струны судьбы</li>';
                count++;
            }

            stats.innerText = count;

            if (count === 0) {
                list.innerHTML = '<p class="empty-text">Вы пока не прочитали ни одного рассказа.</p>';
            }
        }

        function openAdminPanel() {
            alert("Добро пожаловать в Админ-панель!\n\nЗдесь вы можете управлять сайтом и отвечать на сообщения.");
        }

        // Проверка при загрузке страницы (если уже вошли)
        document.addEventListener("DOMContentLoaded", () => {
            const role = localStorage.getItem('user_role');
            const phone = localStorage.getItem('user_phone');
            
            if (role && phone) {
                isAdmin = (role === 'admin');
                loadProfile(phone);
            }
        });
    