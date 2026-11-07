// ==========================================
// ДАННЫЕ КУРСА (База знаний)
// ==========================================
const COURSE_DATA = [
    {
        moduleId: 'intro',
        moduleName: 'Введение',
        lessons: [
            {
                id: 'l_intro_1',
                title: 'Что такое Веб?',
                theory: `<p>Веб-сайт — это набор файлов (HTML, CSS, JS), которые браузер загружает с сервера.</p>
                         <ul>
                             <li><strong>HTML</strong>: Структура (каркас дома).</li>
                             <li><strong>CSS</strong>: Оформление (штукатурка, обои, краска).</li>
                             <li><strong>JavaScript</strong>: Поведение (двери открываются, свет включается).</li>
                         </ul>
                         <p>Давай напишем твой первый код!</p>`,
                starterCode: '<!-- Напиши заголовок -->\n<h1>Hello World!</h1>\n<p>Это мой первый сайт.</p>',
                quiz: {
                    q: 'Какой язык отвечает за структуру страницы?',
                    options: ['CSS', 'HTML', 'Python', 'Java'],
                    correctIdx: 1
                }
            },
            {
                id: 'l_intro_2',
                title: 'Первые теги',
                theory: `<p>Теги заключаются в угловые скобки &lt;&gt;. Большинство тегов парные: открывающий и закрывающий (&lt;/tag&gt;).</p>
                         <p>Основные теги текста:</p>
                         <pre><code>&lt;h1&gt; - Главный заголовок\n&lt;p&gt; - Абзац текста\n&lt;br&gt; - Перенос строки (одиночный)</code></pre>`,
                starterCode: '<h1>Мой блог</h1>\n<p>Привет! Меня зовут Артем.</p>\n<p>Я учусь делать сайты.</p>',
                quiz: {
                    q: 'Как закрыть тег параграфа <p>?',
                    options: ['<p/>', '</p>', '/<p>', '&lt;/p&gt;'],
                    correctIdx: 1
                }
            }
        ]
    },
    {
        moduleId: 'html',
        moduleName: 'HTML Основы',
        lessons: [
            {
                id: 'l_html_1',
                title: 'Списки и Ссылки',
                theory: `<p>Списки помогают структурировать информацию.</p>
                         <ul>
                             <li><code>&lt;ul&gt;</code> - Маркированный список (точки).</li>
                             <li><code>&lt;ol&gt;</code> - Нумерованный список (цифры).</li>
                             <li><code>&lt;li&gt;</code> - Элемент списка.</li>
                         </ul>
                         <p>Ссылки делаются через тег <code>&lt;a&gt;</code> с атрибутом <code>href</code>.</p>`,
                starterCode: '<h3>Мои любимые фрукты:</h3>\n<ul>\n  <li>Яблоко</li>\n  <li>Банан</li>\n</ul>\n<a href="#">Читать дальше...</a>',
                quiz: {
                    q: 'Какой атрибут указывает адрес ссылки?',
                    options: ['src', 'link', 'href', 'url'],
                    correctIdx: 2
                }
            }
        ]
    },
    {
        moduleId: 'css',
        moduleName: 'CSS Стилизация',
        lessons: [
            {
                id: 'l_css_1',
                title: 'Цвет и Фон',
                theory: `<p>CSS позволяет менять внешний вид элементов.</p>
                         <p>Синтаксис: <code>селектор { свойство: значение; }</code></p>
                         <p>Пример изменения фона и цвета текста:</p>
                         <pre><code>body {\n  background-color: lightblue;\n  color: navy;\n}</code></pre>`,
                starterCode: '<style>\n  body {\n    background-color: #ffebee;\n    font-family: Arial;\n  }\n  h1 {\n    color: #c62828;\n    text-align: center;\n  }\n</style>\n\n<h1>Красивый стиль!</h1>\n<p>Теперь текст стал цветным.</p>',
                quiz: {
                    q: 'Какое свойство меняет цвет текста?',
                    options: ['background-color', 'font-color', 'color', 'text-color'],
                    correctIdx: 2
                }
            }
        ]
    },
    {
        moduleId: 'js',
        moduleName: 'JavaScript Магия',
        lessons: [
            {
                id: 'l_js_1',
                title: 'Алерты и Команды',
                theory: `<p>JavaScript оживляет страницу. Самая простая команда — вывод сообщения.</p>
                         <p>Используй функцию <code>alert()</code>, чтобы показать всплывающее окно.</p>`,
                starterCode: '<button onclick="sayHi()">Нажми меня</button>\n\n<script>\nfunction sayHi() {\n  alert("Привет! Ты нажал кнопку!");\n}\n<\/script>', // Экранирование слэша важно
                quiz: {
                    q: 'Какая функция показывает всплывающее сообщение?',
                    options: ['console.log()', 'print()', 'alert()', 'msg()'],
                    correctIdx: 2
                }
            }
        ]
    }
];

// ==========================================
// СОСТОЯНИЕ ПРИЛОЖЕНИЯ
// ==========================================
let appState = {
    currentModuleId: 'intro',
    currentLessonIndex: 0,
    completedLessons: [], // Массив ID пройденных уроков
    startTime: Date.now(),
    activityLog: []
};

// DOM ЭЛЕМЕНТЫ (Кэшируем для скорости)
const els = {
    homeBtn: document.getElementById('nav-home-btn'),
    courseBtn: document.getElementById('nav-course-btn'),
    profileBtn: document.getElementById('nav-profile-btn'),
    
    screenHome: document.getElementById('screen-home'),
    screenCourse: document.getElementById('screen-course'),
    screenProfile: document.getElementById('screen-profile'),
    
    breadcrumb: document.getElementById('breadcrumb-path'),
    lessonTitle: document.getElementById('current-lesson-title'),
    theoryContent: document.getElementById('theory-content-html'),
    
    codeInput: document.getElementById('code-input-area'),
    resultFrame: document.getElementById('result-frame'),
    
    quizContainer: document.getElementById('quiz-container'),
    quizQuestion: document.getElementById('quiz-question-text'),
    quizOptions: document.getElementById('quiz-options-div'),
    quizFeedback: document.getElementById('quiz-feedback-msg'),
    nextLessonBtn: document.getElementById('next-lesson-button'),
    
    globalBarFill: document.getElementById('global-bar-fill'),
    globalPercentText: document.getElementById('global-percent-text'),
    
    profCompletedCount: document.getElementById('prof-completed-count'),
    profTotalTime: document.getElementById('prof-total-time'),
    profLevel: document.getElementById('prof-level'),
    activityLogUl: document.getElementById('activity-log-ul')
};

// ==========================================
// ИНИЦИАЛИЗАЦИЯ
// ==========================================
window.onload = function() {
    loadProgressFromStorage();
    updateGlobalUI();
    renderSidebarModules();
    // Автоматически загружаем первый урок выбранного модуля
    selectModule(appState.currentModuleId);
};

// ==========================================
// НАВИГАЦИЯ МЕЖДУ ЭКРАНАМИ (СТАРЫЙ ДОБРЫЙ СПОСОБ)
// ==========================================

function showHomeScreen() {
    setActiveNavButton('home');
    hideAllScreens();
    els.screenHome.classList.remove('hidden');
    els.screenHome.classList.add('visible');
}

function showCourseScreen() {
    setActiveNavButton('course');
    hideAllScreens();
    els.screenCourse.classList.remove('hidden');
    els.screenCourse.classList.add('visible');
}

function showProfileScreen() {
    setActiveNavButton('profile');
    hideAllScreens();
    els.screenProfile.classList.remove('hidden');
    els.screenProfile.classList.add('visible');
    refreshProfileStats(); // Обновляем цифры при открытии профиля
}

function startLearning() {
    showCourseScreen();
    // Если есть незавершенный урок, идем к нему, иначе к первому
    if (appState.completedLessons.length > 0 && appState.completedLessons.length < getTotalLessons()) {
       // Логика поиска следующего непройденного можно усложнить, пока просто перезагрузим текущий контекст
       selectModule(appState.currentModuleId); 
    }
}

function setActiveNavButton(type) {
    els.homeBtn.classList.remove('active');
    els.courseBtn.classList.remove('active');
    els.profileBtn.classList.remove('active');
    
    if(type === 'home') els.homeBtn.classList.add('active');
    if(type === 'course') els.courseBtn.classList.add('active');
    if(type === 'profile') els.profileBtn.classList.add('active');
}

function hideAllScreens() {
    els.screenHome.classList.add('hidden');
    els.screenHome.classList.remove('visible');
    els.screenCourse.classList.add('hidden');
    els.screenCourse.classList.remove('visible');
    els.screenProfile.classList.add('hidden');
    els.screenProfile.classList.remove('visible');
}

// ==========================================
// ЛОГИКА КУРСА И УРОКОВ
// ==========================================

function renderSidebarModules() {
    const ul = document.getElementById('module-list-ul');
    ul.innerHTML = ''; // Очищаем
    
    COURSE_DATA.forEach(mod => {
        const li = document.createElement('li');
        li.className = 'module-item';
        li.textContent = mod.moduleName;
        li.onclick = () => selectModule(mod.moduleId);
        
        if (mod.moduleId === appState.currentModuleId) {
            li.classList.add('active');
        }
        
        ul.appendChild(li);
    });
}

function selectModule(moduleId) {
    appState.currentModuleId = moduleId;
    appState.currentLessonIndex = 0; // Всегда начинаем с первого урока нового модуля
    
    // Обновляем подсветку в сайдбаре вручную (быстрее чем перерисовать весь список)
    const items = document.querySelectorAll('.module-item');
    items.forEach(item => item.classList.remove('active'));
    // Найдем нужный элемент по тексту или индексу, проще всего найти через data-atribute, но у нас старый стиль.
    // Давайте найдем индекс модуля в массиве
    const modIndex = COURSE_DATA.findIndex(m => m.moduleId === moduleId);
    if(items[modIndex]) items[modIndex].classList.add('active');

    loadCurrentLesson();
}

function loadCurrentLesson() {
    const module = COURSE_DATA.find(m => m.moduleId === appState.currentModuleId);
    if (!module || !module.lessons[appState.currentLessonIndex]) return;

    const lesson = module.lessons[appState.currentLessonIndex];
    
    // Обновляем UI
    els.breadcrumb.textContent = `${module.moduleName} > ${lesson.title}`;
    els.lessonTitle.textContent = lesson.title;
    els.theoryContent.innerHTML = lesson.theory;
    els.codeInput.value = lesson.starterCode;
    
    // Сбрасываем состояние квиза
    els.quizContainer.classList.add('hidden');
    els.quizFeedback.textContent = '';
    els.nextLessonBtn.classList.add('hidden');
    
    // Запускаем предварительный рендер кода
    setTimeout(runUserCode, 100);
}

function runUserCode() {
    const code = els.codeInput.value;
    // Оборачиваем в полный HTML документ для iframe
    const fullHtml = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: sans-serif; padding: 20px; margin: 0; }
                * { box-sizing: border-box; }
            </style>
        </head>
        <body>
            ${code}
        </body>
        </html>
    `;
    els.resultFrame.srcdoc = fullHtml;
    
    // Показываем блок проверки знаний только после попытки запустить код
    showQuizBlock();
}

function resetUserCode() {
    const module = COURSE_DATA.find(m => m.moduleId === appState.currentModuleId);
    const lesson = module.lessons[appState.currentLessonIndex];
    els.codeInput.value = lesson.starterCode;
    runUserCode();
}

function showQuizBlock() {
    const module = COURSE_DATA.find(m => m.moduleId === appState.currentModuleId);
    const lesson = module.lessons[appState.currentLessonIndex];
    
    if (!lesson.quiz) return; // Нет квиза в этом уроке

    els.quizContainer.classList.remove('hidden');
    els.quizQuestion.textContent = lesson.quiz.q;
    els.quizOptions.innerHTML = '';
    els.quizFeedback.textContent = '';
    
    lesson.quiz.options.forEach((opt, idx) => {
        const btn = document.createElement('button');
        btn.className = 'opt-btn';
        btn.textContent = opt;
        btn.onclick = () => checkAnswer(idx, lesson.quiz.correctIdx);
        els.quizOptions.appendChild(btn);
    });
}

function checkAnswer(selectedIdx, correctIdx) {
    const buttons = els.quizOptions.querySelectorAll('.opt-btn');
    
    // Блокируем повторные клики
    buttons.forEach(b => b.disabled = true);
    
    if (selectedIdx === correctIdx) {
        buttons[selectedIdx].classList.add('correct');
        els.quizFeedback.textContent = "✅ Верно! Отличная работа.";
        els.quizFeedback.style.color = "var(--success-color)";
        
        markLessonAsComplete();
        els.nextLessonBtn.classList.remove('hidden');
    } else {
        buttons[selectedIdx].classList.add('wrong');
        buttons[correctIdx].classList.add('correct'); // Показываем правильный
        els.quizFeedback.textContent = "❌ Неверно. Правильный ответ выделен зеленым.";
        els.quizFeedback.style.color = "var(--error-color)";
    }
}

function goToNextLesson() {
    const module = COURSE_DATA.find(m => m.moduleId === appState.currentModuleId);
    
    if (appState.currentLessonIndex < module.lessons.length - 1) {
        appState.currentLessonIndex++;
        loadCurrentLesson();
    } else {
        alert("Поздравляем! Вы завершили этот модуль. Выберите следующий слева.");
        // Можно автопереход к следующему модулю, если хочешь
    }
}

// ==========================================
// СИСТЕМА ПРОГРЕССА И ХРАНЕНИЯ
// ==========================================

function markLessonAsComplete() {
    const module = COURSE_DATA.find(m => m.moduleId === appState.currentModuleId);
    const lessonId = module.lessons[appState.currentLessonIndex].id;
    
    if (!appState.completedLessons.includes(lessonId)) {
        appState.completedLessons.push(lessonId);
        saveProgressToStorage();
        updateGlobalUI();
        logActivity(`Прошел урок: ${module.lessons[appState.currentLessonIndex].title}`);
    }
}

function saveProgressToStorage() {
    localStorage.setItem('learnweb_v1_data', JSON.stringify({
        completed: appState.completedLessons,
        lastModule: appState.currentModuleId,
        startTime: appState.startTime
    }));
}

function loadProgressFromStorage() {
    const saved = localStorage.getItem('learnweb_v1_data');
    if (saved) {
        try {
            const data = JSON.parse(saved);
            appState.completedLessons = data.completed || [];
            appState.currentModuleId = data.lastModule || 'intro';
            appState.startTime = data.startTime || Date.now();
        } catch(e) {
            console.error("Ошибка загрузки данных", e);
        }
    }
}

function clearAllProgress() {
    if(confirm("Вы уверены? Весь ваш прогресс будет удален безвозвратно.")) {
        localStorage.removeItem('learnweb_v1_data');
        location.reload();
    }
}

function updateGlobalUI() {
    const total = getTotalLessons();
    const done = appState.completedLessons.length;
    const percent = total > 0 ? Math.round((done / total) * 100) : 0;
    
    els.globalBarFill.style.width = `${percent}%`;
    els.globalPercentText.textContent = `${percent}%`;
}

function getTotalLessons() {
    let count = 0;
    COURSE_DATA.forEach(m => count += m.lessons.length);
    return count;
}

function refreshProfileStats() {
    els.profCompletedCount.textContent = appState.completedLessons.length;
    
    // Расчет времени (грубый пример: 2 минуты на урок)
    const minutes = appState.completedLessons.length * 2;
    els.profTotalTime.textContent = `${minutes} мин`;
    
    // Уровень
    const percent = (appState.completedLessons.length / getTotalLessons()) * 100;
    if(percent >= 100) els.profLevel.textContent = "Мастер";
    else if(percent >= 50) els.profLevel.textContent = "Ученик";
    else els.profLevel.textContent = "Новичок";
    
    // Лог активности
    els.activityLogUl.innerHTML = '';
    if(appState.activityLog.length === 0) {
        els.activityLogUl.innerHTML = '<li>Нет активных занятий</li>';
    } else {
        // Выводим последние 5 записей
        appState.activityLog.slice(-5).reverse().forEach(log => {
            const li = document.createElement('li');
            li.textContent = log;
            els.activityLogUl.appendChild(li);
        });
    }
}

function logActivity(text) {
    const timeStr = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    appState.activityLog.unshift(`${timeStr}: ${text}`);
    if(appState.activityLog.length > 20) appState.activityLog.pop(); // Храним только последние 20
}
