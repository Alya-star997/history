
    // Функция открытия окна (принимает имя, описание и ссылку на картинку)
    function openModal(name, desc, imgSrc) {
        document.getElementById('modal-title').innerText = name;
        document.getElementById('modal-desc').innerText = desc;
        
        // Если есть картинка, ставим её
        if (imgSrc) {
            document.getElementById('modal-img').src = imgSrc;
            document.getElementById('modal-img').style.display = 'block';
        } else {
            document.getElementById('modal-img').style.display = 'none'; // Скрываем, если картинки нет
        }

        // Показываем окно
        document.getElementById('myModal').style.display = 'block';
    }

    // Функция закрытия окна (по крестику)
    function closeModal() {
        document.getElementById('myModal').style.display = 'none';
    }

    // Закрытие окна, если кликнуть мимо него (по темному фону)
    window.onclick = function(event) {
        let modal = document.getElementById('myModal');
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
