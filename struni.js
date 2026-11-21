
        let currentStoryId = 'story_struni'; // <--- ИСПРАВЛЕНО (теперь сохраняет для этого рассказа)
        let pages = [];
        let currentPageIndex = 0;

        function initReader() {
            pages = document.querySelectorAll('.story-page');
            if (pages.length === 0) return;

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
            pages.forEach(page => page.style.display = 'none');
            pages[currentPageIndex].style.display = 'block';
            
            const indicator = document.getElementById('page-indicator');
            if (indicator) indicator.innerText = `Страница ${currentPageIndex + 1} из ${pages.length}`;
            
            const btnPrev = document.getElementById('btn-prev');
            const btnNext = document.getElementById('btn-next');
            if (btnPrev) btnPrev.disabled = (currentPageIndex === 0);
            if (btnNext) btnNext.disabled = (currentPageIndex === pages.length - 1);

            localStorage.setItem(currentStoryId + '_page', currentPageIndex);
            updateSidebar();
        }

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

        function goToPage(pageIndex) {
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
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });
        }

        function markAsRead() {
            localStorage.setItem(currentStoryId + '_read', 'true');
            localStorage.setItem(currentStoryId + '_page', 0);
            window.location.href = 'history.html'; 
        }
        function markAsRead() {
            // Получаем логин того, кто сейчас читает
            const currentUser = localStorage.getItem('user_phone') || 'guest';

            // Сохраняем прочтение ЛИЧНО ДЛЯ НЕГО
            localStorage.setItem(currentStoryId + '_read_' + currentUser, 'true');
            localStorage.setItem(currentStoryId + '_page', 0);
            window.location.href = 'history.html'; 
        }
        // Логика галереи
        let currentGalleryImageIndex = 0;
        let galleryImages = [];

        function openGallery(element) {
            galleryImages = Array.from(document.querySelectorAll('.story-img'));
            currentGalleryImageIndex = galleryImages.indexOf(element);
            if (currentGalleryImageIndex === -1) currentGalleryImageIndex = 0;

            const modal = document.getElementById('imageGallery');
            const modalImg = document.getElementById('gallery-main-img');
            
            modalImg.src = element.src;
            modal.style.display = 'flex';
        }

        function closeGallery() {
            document.getElementById('imageGallery').style.display = 'none';
        }

        function changeImage(direction) {
            if (galleryImages.length === 0) return;
            currentGalleryImageIndex += direction;

            if (currentGalleryImageIndex >= galleryImages.length) currentGalleryImageIndex = 0;
            if (currentGalleryImageIndex < 0) currentGalleryImageIndex = galleryImages.length - 1;

            document.getElementById('gallery-main-img').src = galleryImages[currentGalleryImageIndex].src;
        }

        document.addEventListener('keydown', function(event) {
            if (event.key === "Escape") closeGallery();
        });

        // Логика панели цветов
        document.addEventListener("DOMContentLoaded", function() {
            const colorBtn = document.getElementById('color-toggle-btn');
            const colorPanel = document.getElementById('color-panel');

            if (colorBtn && colorPanel) {
                colorBtn.addEventListener('click', function() {
                    colorPanel.classList.toggle('show');
                    if (colorPanel.classList.contains('show')) {
                        colorBtn.innerText = "✕ Закрыть";
                    } else {
                        colorBtn.innerText = "🎨 Цвета";
                    }
                });
            }
            // Запускаем инициализацию читалки
            initReader();
        });
        // Функция открытия галереи Вики
function openVikaGallery() {
    document.getElementById('vikaModal').style.display = 'flex';
}

// Функция закрытия
function closeVikaGallery() {
    document.getElementById('vikaModal').style.display = 'none';
}

// Закрытие по клику на пустое место (темный фон)
document.getElementById('vikaModal').addEventListener('click', function(event) {
    if (event.target === this) {
        closeVikaGallery();
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
   