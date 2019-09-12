importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-messaging.js');

firebase.initializeApp({
    messagingSenderId: "882588722429"
});

const messaging = firebase.messaging();

// messaging.onMessage(function (payload) {
//     const notificationTitle = payload.notification.title;
//     const notificationOptions = {
//         body: payload.notification.body,
//         icon: payload.notification.icon,
//     };

//     if (!("Notification" in window)) {
//         console.log("This browser does not support system notifications");
//     }
//     // Let's check whether notification permissions have already been granted
//     else if (Notification.permission === "granted") {
//         // If it's okay let's create a notification
//         var notification = new Notification(notificationTitle, notificationOptions);
//         notification.onclick = function (event) {
//             event.preventDefault(); // prevent the browser from focusing the Notification's tab
//             window.open(payload.notification.click_action, '_blank');
//             notification.close();
//         }
//     }
// });