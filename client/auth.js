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

firebase.initializeApp(firebaseConfig)



export function initUI(container) {
    const uiConfig = {
        signInSuccessUrl: 'quizeditor',
        signInOptions: [
        // Leave the lines as is for the providers you want to offer your users.
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.FacebookAuthProvider.PROVIDER_ID,
        firebase.auth.TwitterAuthProvider.PROVIDER_ID,
        firebase.auth.GithubAuthProvider.PROVIDER_ID,
        firebase.auth.EmailAuthProvider.PROVIDER_ID,
        firebase.auth.PhoneAuthProvider.PROVIDER_ID,
        firebaseui.auth.AnonymousAuthProvider.PROVIDER_ID
        ],
        // tosUrl and privacyPolicyUrl accept either url string or a callback
        // function.
        // Terms of service url/callback.
        tosUrl: '<your-tos-url>',
        // Privacy policy url/callback.
        privacyPolicyUrl: function() {
        window.location.assign('<your-privacy-policy-url>');
        }
    };
    const ui = new firebaseui.auth.AuthUI(firebase.auth())

    ui.start(container, uiConfig);
}

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