
    // Проверяем, выбрал ли пользователь тему ранее
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'light') {
        document.body.classList.add('light-theme');
    }

    // Функция переключения
    function toggleTheme() {
        document.body.classList.toggle('light-theme');
        
        // Сохраняем выбор в память браузера
        if (document.body.classList.contains('light-theme')) {
            localStorage.setItem('theme', 'light');
        } else {
            localStorage.setItem('theme', 'dark');
        }
    }
