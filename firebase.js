var firebaseConfig = {
    apiKey: "AIzaSyA2dLId879BMm1w9gRSJ9g6jlJxzLhzspM",
    authDomain: "todo-db88b.firebaseapp.com",
    projectId: "todo-db88b",
    storageBucket: "todo-db88b.appspot.com",
    messagingSenderId: "929873148047",
    appId: "1:929873148047:web:b1aa8862247b8a0fe898fa",
    measurementId: "G-NWR059V585"
  };

  // Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();
var db = firebase.firestore();