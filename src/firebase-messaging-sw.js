importScripts('https://www.gstatic.com/firebasejs/7.6.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.6.0/firebase-messaging.js');


firebase.initializeApp({
    apiKey: "AIzaSyCtx2dE3f5eBFXdqqcliVp2vbHLe7NZCPA",
    authDomain: "care-homes-3ec55.firebaseapp.com",
    // databaseURL: "https://care-homes-3ec55-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "care-homes-3ec55",
    storageBucket: "care-homes-3ec55.appspot.com",
    messagingSenderId: "752267279750",
    appId: "1:752267279750:web:fd531242b4851d51c6c007",
    measurementId: "G-9RM374636Q"
});
// firebase.initializeApp({
//     apiKey: "AIzaSyDHOdxWSMaXYAb-1NkhHVUdW-eTHA6HCAk",
//     authDomain: "demoproject-4a4ac.firebaseapp.com",
//     projectId: "demoproject-4a4ac",
//     storageBucket: "demoproject-4a4ac.appspot.com",
//     messagingSenderId: "849056978047",
//     appId: "1:849056978047:web:0752bef21873b212de1b4a",
//     measurementId: "G-FZLW4JG423"
// });


const messaging = firebase.messaging();