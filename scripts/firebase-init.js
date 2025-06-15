// Подключаем конфигурацию из firebase-config.js
// (Предполагается, что firebase-config.js будет загружен ПЕРЕД этим файлом)

// Проверяем, что firebaseConfig определен
if (typeof firebaseConfig === 'undefined') {
    console.error("firebaseConfig is not defined. Make sure firebase-config.js is loaded before firebase-init.js");
} else {
    // Инициализация Firebase
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
    // Экспортируем базу данных для удобства, если вы используете глобальные переменные
    // В противном случае, каждый скрипт будет вызывать firebase.database()
    const database = firebase.database();
}