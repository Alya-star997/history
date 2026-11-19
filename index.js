
    // ⚠️ ВСТАВЬ СВОИ ДАННЫЕ ⚠️
    const BOT_TOKEN = '9060284126:AAGADCenOQ1aJ4Neo4_znBwIRg2FstuShZs'; 
    const CHAT_ID = '1090327020';   

    // Логика звезд (оставляем как было)
    const stars = document.querySelectorAll('#star-rating span');
    const ratingInput = document.getElementById('ratingValue');
    
    stars.forEach(star => {
        star.addEventListener('click', function() {
            const value = this.getAttribute('data-value');
            ratingInput.value = value;
            stars.forEach(s => s.classList.remove('active'));
            for (let i = 0; i < value; i++) {
                stars[i].classList.add('active');
            }
        });
    });

    // Отправка формы
    document.getElementById('tgForm').addEventListener('submit', async function(e) {
        e.preventDefault();

        const name = document.getElementById('userName').value;
        const comment = document.getElementById('userComment').value;
        const rating = ratingInput.value;
        
        // ПОЛУЧАЕМ НИК ИЗ НОВОГО ПОЛЯ (если пусто, пишем "Не указан")
        const tgUsername = document.getElementById('tgUsername').value.trim() || "Не указан"; 

        const status = document.getElementById('formStatus');
        const btn = document.getElementById('submitBtn');

        if (rating === '0') {
            status.style.color = '#ff3333';
            status.innerText = 'Пожалуйста, выберите оценку (звезды).';
            return;
        }

        status.style.color = 'white';
        status.innerText = 'Отправка...';
        btn.disabled = true;

        // Формируем сообщение для ТГ, ДОБАВЛЯЕМ НИК
        const text = `📬 <b>Новый отзыв на сайте!</b>\n\n` +
                     `<b>Оценка:</b> ${'⭐'.repeat(rating)} (${rating}/5)\n` +
                     `<b>Имя:</b> ${name}\n` +
                     `<b>Telegram:</b> ${tgUsername}\n` + 
                     `<b>Текст:</b>\n${comment}`;

        try {
            const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: CHAT_ID,
                    text: text,
                    parse_mode: 'HTML'
                })
            });

            const data = await response.json();

            if (data.ok) {
                status.style.color = '#00ff00';
                status.innerText = 'Спасибо! Ваш отзыв отправлен.';
                document.getElementById('tgForm').reset();
                stars.forEach(s => s.classList.remove('active'));
                ratingInput.value = '0';
            } else {
                status.style.color = '#ff3333';
                status.innerText = 'Ошибка ТГ: ' + data.description;
            }
        } catch (error) {
            status.style.color = '#ff3333';
            status.innerText = 'Ошибка сети. Проверьте интернет.';
        } finally {
            btn.disabled = false;
        }
    });
