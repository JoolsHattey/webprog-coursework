"use strict";

const firebaseConfig = {
    apiKey: "AIzaSyB0cnilljayJ3axmCdJyBvGV_nLdDQ9csI",
    authDomain: "webprog-coursework-e4b42.firebaseapp.com",
    databaseURL: "https://webprog-coursework-e4b42.firebaseio.com",
    projectId: "webprog-coursework-3f2d9",
    storageBucket: "webprog-coursework-e4b42.appspot.com",
    messagingSenderId: "669091989709",
    appId: "1:669091989709:web:ecefeb8f3d8c5ad0ca8184"
};
firebase.initializeApp(firebaseConfig);

export const authObservable = {
    subscribe: observer => {
        firebase.auth().onAuthStateChanged(user => {
            observer.next(user);
        });
    }
}

export function initAuth(appBar) {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            appBar.setUser(user);
        } else {
            appBar.clearUser();
        }
    });
}

let authStatus;


export function login() {
    const provider = new firebase.auth.GoogleAuthProvider();
    
    firebase.auth().signInWithPopup(provider)
        .then(result => {
            const token = result.credential.accessToken;
            const user = result.user;
            console.log(user)
            user.getIdTokenResult().then((token) => {
                console.log(token);
                console.log(jwt_decode(token));
            });
            sendAuthToken({token: user.uid});
        }).catch(error => {
            const errorCode = error.code;
            const errorMessage = error.message;
        });
}

export function logout() {
    firebase.auth().signOut();
}

export function getAuthStatus() {
    if(firebase.auth().currentUser) {
        return true;
    }
    return false;
}

export function getAuthStatusAsync() {
    return new Promise(resolve => {
        firebase.auth().onAuthStateChanged(user => {
            if(user) {
                user.getIdTokenResult().then((token) => {
                    console.log(token);
                    resolve(token);
                });
            }
            else resolve(false);
        });
    });
}

function sendToken() {
    firebase.auth().currentUser.getIdToken(/* forceRefresh */ true).then(function(idToken) {
        const authToken = { "token": idToken }
        sendAuthToken(authToken);
    }).catch(function(error) {
        // Handle error
    });
    
}

async function sendAuthToken(authToken) {
    const response = await fetch("/api/authenticate", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(authToken)
    });
}