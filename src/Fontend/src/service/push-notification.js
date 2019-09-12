import firebase from 'firebase';


export const initializeFirebase = () => {

    firebase.initializeApp({
        apiKey: "AIzaSyA9WAFEAL9ZiQQ6Wn0syCQZ1lJSS3fD9GU",
        authDomain: "project-eojts.firebaseapp.com",
        databaseURL: "https://project-eojts.firebaseio.com",
        projectId: "project-eojts",
        storageBucket: "project-eojts.appspot.com",
        messagingSenderId: "882588722429",
        appId: "1:882588722429:web:bc17cfd9b761e33f"
    })
};


export const askForPermissioToReceiveNotifications = async () => {
    try {
        const messaging = firebase.messaging();
        await messaging.requestPermission();
        const token = await messaging.getToken();

        return token;
    } catch (error) {
        console.error(error);
    }
}