let currentStoryId = '';
let pages = [];
let currentPageIndex = 0;

function initReader(storyId) {
    currentStoryId = storyId;
    pages = document.querySelectorAll('.story-page');

    if (pages.length === 0) {
        console.error("ОШИБКА: Не найдено ни одного блока <div class='story-page'> в HTML!");
        return;
    }

    const savedPage = localStorage.getItem(currentStoryId + '_page');
    if (savedPage !== null) {
        currentPageIndex = parseInt(savedPage);
    }

    if (currentPageIndex >= pages.length) {
        currentPageIndex = 0;
    }

    renderPage(); 
}

function renderPage() {
    if (pages.length === 0) return;

    // Прячем все страницы
    pages.forEach(page => {
        page.style.display = 'none';
    });

    // Показываем текущую
    pages[currentPageIndex].style.display = 'block';

    // Обновляем счетчик
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

    // ОБНОВЛЯЕМ БОКОВОЕ МЕНЮ (подсвечиваем нужную главу)
    updateSidebar();
}

// --- НОВЫЕ ФУНКЦИИ ДЛЯ БОКОВОГО МЕНЮ ---

// Переход на конкретную страницу
function goToPage(pageIndex) {
    if (pageIndex >= 0 && pageIndex < pages.length) {
        currentPageIndex = pageIndex;
        renderPage();
    }
}

// Подсветка активной кнопки в меню
function updateSidebar() {
    const buttons = document.querySelectorAll('.chapter-btn');
    buttons.forEach((btn, index) => {
        if (index === currentPageIndex) {
            btn.classList.add('active'); // Добавляем красный цвет
        } else {
            btn.classList.remove('active'); // Убираем
        }
    });
}

// ---------------------------------------

function nextPage() {
    if (currentPageIndex < pages.length - 1) {
        currentPageIndex++;
        renderPage();
    }
}

function prevPage() {
    if (currentPageIndex > 0) {
        currentPageIndex--;
        renderPage();
    }
}

function markAsRead() {
    localStorage.setItem(currentStoryId + '_read', 'true');
    localStorage.setItem(currentStoryId + '_page', 0);
    window.location.href = 'history.html'; 
}
    // ==========================================
    // СКРИПТ ДЛЯ ГАЛЕРЕИ ИЗОБРАЖЕНИЙ
    // ==========================================

    // Список всех картинок для галереи. 
    // ВАЖНО: Пути должны совпадать с теми, что ты вставил в текст!
    const imagesList = [
        "твоя_картинка_1.jpg",
        "твоя_картинка_2.jpg"
        // Добавляй сюда новые картинки через запятую
    ];

    let currentImageIndex = 0;

    // Открыть галерею
    function openGallery(index) {
        // Если передали индекс картинки, открываем её
        if (typeof index === 'number') {
            currentImageIndex = index;
        }
        document.getElementById('gallery-main-img').src = imagesList[currentImageIndex];
        document.getElementById('imageGallery').style.display = 'flex';
    }

    // Закрыть галерею
    function closeGallery() {
        document.getElementById('imageGallery').style.display = 'none';
    }

    // Перелистывание картинок (вперед/назад)
    function changeImage(step) {
        currentImageIndex += step;
        
        // Если дошли до конца, перекидываем в начало
        if (currentImageIndex >= imagesList.length) {
            currentImageIndex = 0;
        }
        // Если листаем назад с начала, перекидываем в конец
        if (currentImageIndex < 0) {
            currentImageIndex = imagesList.length - 1;
        }
        
        document.getElementById('gallery-main-img').src = imagesList[currentImageIndex];
    }

    // Закрытие галереи при клике на темный фон
    document.getElementById('imageGallery').addEventListener('click', function(event) {
        if (event.target === this) {
            closeGallery();
        }
    });