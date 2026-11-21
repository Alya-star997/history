// Локальная статистика: действует только в пределах текущего браузера.
(function(){
  try {
    if(!sessionStorage.getItem('site_visit_counted')){
      const visits=Number(localStorage.getItem('site_visits')||0)+1;
      localStorage.setItem('site_visits',String(visits));
      sessionStorage.setItem('site_visit_counted','1');
    }
    document.addEventListener('click',function(event){
      const link=event.target.closest('a[href*="t.me/"]');
      if(!link || localStorage.getItem('site_bot_click_counted')==='1') return;
      localStorage.setItem('site_bot_click_counted','1');
      localStorage.setItem('site_bot_clicks',String(Number(localStorage.getItem('site_bot_clicks')||0)+1));
    });
  } catch(error) { console.warn('Не удалось сохранить локальную статистику',error); }
})();
