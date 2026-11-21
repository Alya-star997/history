
    let currentStoryId = 'story_last_shot';
    let pages = [];
    let currentPageIndex = 0;

    // 1. Инициализация
    function initReader() {
        pages = document.querySelectorAll('.story-page');
        if (pages.length === 0) return;

        // Загружаем сохраненную страницу, если она есть
        const savedPage = localStorage.getItem(currentStoryId + '_page');
        if (savedPage !== null) {
            currentPageIndex = parseInt(savedPage);
        }
        // Если страниц стало меньше, начинаем с начала
        if (currentPageIndex >= pages.length) {
            currentPageIndex = 0;
        }

        renderPage(); 
    }

    // 2. Отрисовка текста и кнопок
    function renderPage() {
        // Прячтом все страницы
        pages.forEach(page => page.style.display = 'none');
        
        // Показываем нужную
        pages[currentPageIndex].style.display = 'block';
        
        // Обновляем счтотчик страниц внизу
        const indicator = document.getElementById('page-indicator');
        if (indicator) {
            indicator.innerText = `Страница ${currentPageIndex + 1} из ${pages.length}`;
        }
        
        // Включаем/выключаем кнопки Вперед/Назад
        const btnPrev = document.getElementById('btn-prev');
        const btnNext = document.getElementById('btn-next');
        if (btnPrev) btnPrev.disabled = (currentPageIndex === 0);
        if (btnNext) btnNext.disabled = (currentPageIndex === pages.length - 1);

        // Сохраняем прогресс
        localStorage.setItem(currentStoryId + '_page', currentPageIndex);

        // Подсвечиваем активную главу в боковом меню
        updateSidebar();
    }

    // 3. Переход по кнопкам Вперед/Назад
    function nextPage() {
        if (currentPageIndex < pages.length - 1) {
            currentPageIndex++;
            renderPage();
            window.scrollTo(0,0);
        }
    }

    function prevPage() {
        if (currentPageIndex > 0) {
            currentPageIndex--;
            renderPage();
            window.scrollTo(0,0);
        }
    }

    // 4. Боковое меню (Главы)
    function goToPage(pageIndex) {
        // Проверяем, существует ли такая страница
        if (pageIndex >= 0 && pageIndex < pages.length) {
            currentPageIndex = pageIndex;
            renderPage();
             window.scrollTo(0,0);
        }
    }

    function updateSidebar() {
        const buttons = document.querySelectorAll('.chapter-btn');
        buttons.forEach((btn, index) => {
            if (index === currentPageIndex) {
                btn.classList.add('active'); // Красим активную кнопку
            } else {
                btn.classList.remove('active');
            }
        });
    }

        // 5. Кнопка "Прочитано"
    function markAsRead() {
        // Получаем логин того, кто сейчас читает
        const currentUser = localStorage.getItem('user_phone') || 'guest';
        
        // Сохраняем прочтение ЛИЧНО ДЛЯ НЕГО
        localStorage.setItem(currentStoryId + '_read_' + currentUser, 'true');
        localStorage.setItem(currentStoryId + '_page', 0); // Сбрасываем страницу на первую
        window.location.href = 'history.html'; 
    }

    // Запускаем когда страница загрузится
    document.addEventListener("DOMContentLoaded", initReader);
        // ==========================================
    // ЛОГИКА ДЛЯ ГАЛЕРЕИ ИЗОБРАЖЕНИЙ
    // ==========================================
    let currentGalleryImageIndex = 0;
    let galleryImages = [];

    // Функция открытия галереи
    function openGallery(element) {
        // Собираем все картинки рассказа на странице
        galleryImages = Array.from(document.querySelectorAll('.story-img'));
        
        // Находим индекс картинки, по которой кликнули
        currentGalleryImageIndex = galleryImages.indexOf(element);
        if (currentGalleryImageIndex === -1) currentGalleryImageIndex = 0;

        const modal = document.getElementById('imageGallery');
        const modalImg = document.getElementById('gallery-main-img');
        
        // Включаем картинку и показываем окно
        modalImg.src = element.src;
        modal.style.display = 'flex'; // Ваш CSS сработает здесь
    }

    // Функция закрытия
    function closeGallery() {
        document.getElementById('imageGallery').style.display = 'none';
    }

    // Функция перелистывания
    function changeImage(direction) {
        if (galleryImages.length === 0) return;

        currentGalleryImageIndex += direction;

        if (currentGalleryImageIndex >= galleryImages.length) {
            currentGalleryImageIndex = 0;
        }
        if (currentGalleryImageIndex < 0) {
            currentGalleryImageIndex = galleryImages.length - 1;
        }

        document.getElementById('gallery-main-img').src = galleryImages[currentGalleryImageIndex].src;
    }

    // Закрытие по клавише Esc
    document.addEventListener('keydown', function(event) {
        if (event.key === "Escape") {
            closeGallery();
        }
    });
   
    // Ждем, пока страница полностью загрузится
    document.addEventListener("DOMContentLoaded", function() {
        const colorBtn = document.getElementById('color-toggle-btn');
        const colorPanel = document.getElementById('color-panel');

        // Проверяем, существуют ли они на странице, чтобы не было ошибок
        if (colorBtn && colorPanel) {
            colorBtn.addEventListener('click', function() {
                colorPanel.classList.toggle('show');
                
                if (colorPanel.classList.contains('show')) {
                    colorBtn.innerText = "✕ Закрыть";
                } else {
                    colorBtn.innerText = "Цвета";
                }
            });
        }
    });
function markStoryAsRead(storyName) {
    // storyName должен быть либо 'story_last_shot_read', либо 'story_struni_read'
    const currentUser = localStorage.getItem('user_phone') || 'guest';
    localStorage.setItem(storyName + '_' + currentUser, 'true');
}

// ПРИМЕР: как привязать это к вашей кнопке
// Если у вас есть кнопка <button id="finishBtn">Завершить</button>:

document.getElementById('finishBtn').addEventListener('click', function() {
    // Если это рассказ "Последний выстрел":
    markStoryAsRead('story_last_shot_read'); 
    
    // Если это рассказ "Струны судьбы":
    // markStoryAsRead('story_struni_read'); 
    
    alert('Рассказ добавлен в прочитанные!');
});
