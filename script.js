// ====== ПРОСТАЯ I18N НА I18NEXT ======
(async function () {
  const langs = ['ru', 'en', 'kz'];
  const resources = {};

  // ====== ЗАГРУЗКА JSON ======
  async function loadJSON(url) {
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to load ' + url);
    return res.json();
  }

  // Загружаем все языки
  for (const l of langs) {
    try {
      resources[l] = { translation: await loadJSON(`lang/${l}.json`) };
    } catch (e) {
      console.warn('Could not load lang', l, e);
      resources[l] = { translation: {} };
    }
  }

  // ====== ОПРЕДЕЛЯЕМ ТЕКУЩИЙ ЯЗЫК ======
  function detectInitialLang() {
    const saved = localStorage.getItem('site_lang');
    if (saved && langs.includes(saved)) return saved;
    const nav = (navigator.language || navigator.userLanguage || 'ru').slice(0, 2);
    return langs.includes(nav) ? nav : 'ru';
  }

  const currentLang = detectInitialLang();

  // ====== ИНИЦИАЛИЗАЦИЯ I18NEXT ======
  i18next.init({
    lng: currentLang,
    debug: true,
    resources
  }, function (err, t) {
    if (err) console.error(err);
    updateContent();
  });

  // ====== ФУНКЦИЯ ОБНОВЛЕНИЯ ТЕКСТОВ ======
  function updateContent() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (key.includes("[") && key.includes("]")) {
        // Поддержка placeholder и других атрибутов
        const attr = key.match(/\[(.*?)\]/)[1];
        const cleanKey = key.replace(/\[.*?\]/, "");
        el.setAttribute(attr, i18next.t(cleanKey));
      } else {
        el.textContent = i18next.t(key);
      }
    });
  }

  // ====== СЕЛЕКТОР ЯЗЫКА ======
  const langSelect = document.getElementById('langSelect');
  if (langSelect) {
    langSelect.value = currentLang;
    langSelect.addEventListener('change', e => {
      const lng = e.target.value;
      i18next.changeLanguage(lng, () => {
        updateContent();
        localStorage.setItem('site_lang', lng);
      });
    });
  }

  // ====== ГОД В ПОДВАЛЕ ======
  const yr = document.getElementById('yr');
  if (yr) yr.textContent = new Date().getFullYear();

  // ====== ПЛАВНЫЙ СКРОЛЛ ======
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function (e) {
      const id = this.getAttribute('href');
      if (id === '#') return;
      const el = document.querySelector(id);
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

})();