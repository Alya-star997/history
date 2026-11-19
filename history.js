
        // Проверка прочитанного для первой карточки
        if (localStorage.getItem('story_last_shot_read') === 'true') {
            const story = document.getElementById('story_last_shot');
            if (story) story.classList.add('read');
        }
        // Проверка прочитанного для второй карточки
        if (localStorage.getItem('story_struni_read') === 'true') {
            const story = document.getElementById('story_struni');
            if (story) story.classList.add('read');
        }

        // Функция открытия окна с инфой
        function openStoryInfo(title, infoHtml) {
            document.getElementById('story-modal-title').innerText = title;
            document.getElementById('story-modal-desc').innerHTML = infoHtml;
            document.getElementById('storyModal').style.display = 'block';
        }

        function closeStoryInfo() {
            document.getElementById('storyModal').style.display = 'none';
        }

        window.addEventListener('click', function(event) {
            let modal = document.getElementById('storyModal');
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
  