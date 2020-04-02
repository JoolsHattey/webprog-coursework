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

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        //const image = document.createElement("img");
        screen1.appBar.profileImage.src = user.photoURL
        //screen1.appBar.userProfile.appendChild(image)
        screen1.appBar.setUser(user);
    } else {
        //const image = document.createElement("img");
        screen1.appBar.profileImage.src = "/assets/account_18dp.png"
        //screen1.appBar.userProfile.appendChild(image)
        screen1.appBar.clearUser();
    }
  });
let authStatus;

export function login() {
    const provider = new firebase.auth.GoogleAuthProvider();
    
    firebase.auth().signInWithPopup(provider)
        .then(result => {
            const token = result.credential.accessToken;
            const user = result.user;
            sendToken();
        }).catch(error => {
            const errorCode = error.code;
            const errorMessage = error.message;
        });
}

function logout() {
    firebase.auth().signOut();
}

export function getAuthStatus() {
    if(firebase.auth().currentUser) {
        return true;
    }
    return false;
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
    const response = await fetch("/authenticate", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(authToken)
    });
}