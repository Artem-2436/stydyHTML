// Данные уроков
const courseData = [
    {
        id: 'intro',
        title: 'Введение',
        lessons: [
            {
                id: 'l1_1',
                title: 'Что такое HTML?',
                theory: `<p>Представь, что ты строишь дом. <strong>HTML</strong> — это кирпичи и каркас дома. Он определяет структуру страницы: где заголовок, где картинка, где текст.</p>
                        <p>Теги выглядят так: <code>&lt;p&gt;текст&lt;/p&gt;</code>. Тег открывает элемент, а слэш <code>/</code> закрывает его.</p>`,
                starterCode: '<!-- Нажми ▶ Запустить, чтобы увидеть результат -->\n<h1>Привет, мир!</h1>\n<p>Это мой первый абзац текста.</p>',
                quiz: {
                    question: 'Какой тег используется для самого главного заголовка?',
                    options: ['<h1>', '<header>', '<title>', '<heading>'],
                    correctIndex: 0
                }
            },
            {
                id: 'l1_2',
                title: 'Первый CSS',
                theory: `<p>Если HTML — это каркас, то <strong>CSS</strong> — это краска и обои. Он делает сайт красивым.</p>
                        <p>Мы пишем правила внутри тега <code>&lt;style&gt;</code>.</p>`,
                starterCode: '<style>\n  body {\n    background-color: lightblue;\n    font-family: Arial;\n  }\n  h1 {\n    color: darkblue;\n    text-align: center;\n  }\n</style>\n\n<h1>Красивый заголовок</h1>\n<p>Фон стал голубым!</p>',
                quiz: {
                    question: 'Какое свойство меняет цвет текста?',
                    options: ['background-color', 'font-color', 'color', 'text-color'],
                    correctIndex: 2
                }
            }
        ]
    },
    {
        id: 'html-basics',
        title: 'HTML Основы',
        lessons: [
            {
                id: 'l2_1',
                title: 'Списки и ссылки',
                theory: `<p>На сайтах часто нужны списки товаров или меню. Используй <code>&lt;ul&gt;</code> (неупорядоченный) и <code>&lt;li&gt;</code> (элемент списка).</p>
                        <p>Ссылки делаются через <code>&lt;a href="url"&gt;</code>.</p>`,
                starterCode: '<ul>\n  <li><a href="#">Яблоко</a></li>\n  <li><a href="#">Банан</a></li>\n</ul>',
                quiz: {
                    question: 'Какой атрибут указывает адрес ссылки?',
                    options: ['src', 'href', 'link', 'path'],
                    correctIndex: 1
                }
            }
        ]
    },
    // Можно добавить больше уроков сюда
];

// Состояние приложения
let state = {
    currentTopicId: 'intro',
    currentLessonIndex: 0,
    completedLessons: JSON.parse(localStorage.getItem('learnweb_progress')) || []
};

// DOM Элементы
const screens = document.querySelectorAll('.screen');
const navBtns = document.querySelectorAll('.main-nav button');
const topicListEl = document.getElementById('topic-list');
const lessonTitleEl = document.getElementById('current-lesson-title');
const topicNameEl = document.getElementById('current-topic-name');
const theoryContentEl = document.getElementById('lesson-content');
const codeInputEl = document.getElementById('user-code-input');
const previewFrame = document.getElementById('live-preview');
const runBtn = document.getElementById('run-code-btn');
const resetBtn = document.getElementById('reset-code-btn');
const quizSection = document.getElementById('quiz-section');
const quizQuestionEl = document.getElementById('quiz-question');
const quizOptionsEl = document.getElementById('quiz-options');
const feedbackEl = document.getElementById('quiz-feedback');
const nextLessonBtn = document.getElementById('next-lesson-btn');
const globalProgressFill = document.getElementById('global-progress-fill');
const progressPercentText = document.getElementById('progress-percent');
const startLearningBtn = document.getElementById('start-learning-btn');

// Инициализация
function init() {
    renderTopics();
    loadLesson(state.currentTopicId, state.currentLessonIndex);
    updateGlobalProgress();
    
    // Слушатели событий
    setupEventListeners();
}

function setupEventListeners() {
    // Навигация между экранами
    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetScreen = btn.id.replace('btn-', 'screen-');
            switchScreen(targetScreen);
            
            // Обновление активного класса в навигации
            navBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    startLearningBtn.addEventListener('click', () => {
        switchScreen('screen-course');
        document.getElementById('btn-course').classList.add('active');
        document.getElementById('btn-home').classList.remove('active');
    });

    // Выбор темы
    topicListEl.addEventListener('click', (e) => {
        if(e.target.classList.contains('topic-item')) {
            const topicId = e.target.dataset.topic;
            state.currentTopicId = topicId;
            state.currentLessonIndex = 0; // Начинаем с первого урока новой темы
            
            // Обновление UI
            document.querySelectorAll('.topic-item').forEach(el => el.classList.remove('active'));
            e.target.classList.add('active');
            
            loadLesson(topicId, 0);
        }
    });

    // Управление кодом
    runBtn.addEventListener('click', executeCode);
    resetBtn.addEventListener('click', () => {
        const lesson = getCurrentLesson();
        codeInputEl.value = lesson.starterCode;
        executeCode(); // Сразу обновим превью
    });

    // Следующий урок
    nextLessonBtn.addEventListener('click', goNextLesson);
    
    // Очистка данных
    document.getElementById('clear-data-btn')?.addEventListener('click', () => {
        if(confirm("Вы уверены? Весь прогресс будет удален.")) {
            localStorage.removeItem('learnweb_progress');
            location.reload();
        }
    });
}

function switchScreen(screenId) {
    screens.forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
}

function renderTopics() {
    topicListEl.innerHTML = '';
    courseData.forEach(topic => {
        const li = document.createElement('li');
        li.className = 'topic-item';
        li.dataset.topic = topic.id;
        li.textContent = topic.title;
        if (topic.id === state.currentTopicId) li.classList.add('active');
        topicListEl.appendChild(li);
    });
}

function getCurrentLesson() {
    const topic = courseData.find(t => t.id === state.currentTopicId);
    return topic ? topic.lessons[state.currentLessonIndex] : null;
}

function loadLesson(topicId, index) {
    const topic = courseData.find(t => t.id === topicId);
    if (!topic || !topic.lessons[index]) return;

    const lesson = topic.lessons[index];
    
    // Обновление текстов
    topicNameEl.textContent = topic.title;
    lessonTitleEl.textContent = lesson.title;
    theoryContentEl.innerHTML = lesson.theory;
    codeInputEl.value = lesson.starterCode;
    
    // Скрыть квиз при новом уроке
    quizSection.classList.add('hidden');
    feedbackEl.textContent = '';
    nextLessonBtn.classList.add('hidden');
    
    // Выполнить стартовый код
    setTimeout(executeCode, 100);
}

function executeCode() {
    const code = codeInputEl.value;
    // Оборачиваем в полный HTML документ для корректного рендера в iframe
    const fullHtml = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: sans-serif; padding: 20px; }
                * { box-sizing: border-box; }
            </style>
        </head>
        <body>
            ${code}
        </body>
        </html>
    `;
    previewFrame.srcdoc = fullHtml;
    
    // После успешного запуска показываем кнопку проверки знаний
    showQuiz();
}

function showQuiz() {
    const lesson = getCurrentLesson();
    if (!lesson || !lesson.quiz) return;

    quizQuestionEl.textContent = lesson.quiz.question;
    quizOptionsEl.innerHTML = '';
    feedbackEl.textContent = '';
    quizSection.classList.remove('hidden');

    lesson.quiz.options.forEach((opt, idx) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.textContent = opt;
        btn.onclick = () => checkAnswer(idx, lesson.quiz.correctIndex);
        quizOptionsEl.appendChild(btn);
    });
}

function checkAnswer(selectedIdx, correctIdx) {
    const buttons = quizOptionsEl.querySelectorAll('.option-btn');
    
    // Блокируем все кнопки
    buttons.forEach(b => b.disabled = true);
    
    if (selectedIdx === correctIdx) {
        buttons[selectedIdx].classList.add('correct');
        feedbackEl.textContent = "Отлично! Ты правильно ответил.";
        feedbackEl.style.color = "var(--success-green)";
        
        // Сохраняем прогресс
        saveProgress(getCurrentLesson().id);
        nextLessonBtn.classList.remove('hidden');
    } else {
        buttons[selectedIdx].classList.add('wrong');
        buttons[correctIdx].classList.add('correct'); // Показать правильный
        feedbackEl.textContent = "Не совсем. Правильный ответ выделен зеленым.";
        feedbackEl.style.color = "var(--error-red)";
    }
}

function saveProgress(lessonId) {
    if (!state.completedLessons.includes(lessonId)) {
        state.completedLessons.push(lessonId);
        localStorage.setItem('learnweb_progress', JSON.stringify(state.completedLessons));
        updateGlobalProgress();
    }
}

function updateGlobalProgress() {
    let totalLessons = 0;
    courseData.forEach(t => totalLessons += t.lessons.length);
    
    const percent = totalLessons > 0 ? Math.round((state.completedLessons.length / totalLessons) * 100) : 0;
    globalProgressFill.style.width = `${percent}%`;
    progressPercentText.textContent = `${percent}%`;
}

function goNextLesson() {
    const topic = courseData.find(t => t.id === state.currentTopicId);
    if (state.currentLessonIndex < topic.lessons.length - 1) {
        state.currentLessonIndex++;
        loadLesson(state.currentTopicId, state.currentLessonIndex);
    } else {
        alert("Поздравляем! Вы прошли эту тему.");
        // Можно перейти к следующей теме автоматически
    }
}

// Запуск
document.addEventListener('DOMContentLoaded', init);
