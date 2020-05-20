"use strict";

const firebaseConfig = {
  apiKey: "AIzaSyB0cnilljayJ3axmCdJyBvGV_nLdDQ9csI",
  authDomain: "webprog-coursework-e4b42.firebaseapp.com",
  projectId: "webprog-coursework-3f2d9"
};
firebase.initializeApp(firebaseConfig)

export function initAuth(appBar) {
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      appBar.setUser(user);
    } else {
      appBar.clearUser();
    }
  });
}

function loadGoogleAPI() {
  return new Promise(resolve => {
    gapi.load('auth2', () => resolve());
  });
}
function getAPIToken() {
  return new Promise(resolve => {
    gapi.auth2.authorize({
      client_id: '669091989709-1ft3bvjahneklp47kefipe1h6gglnr4o.apps.googleusercontent.com',
      scope: 'https://www.googleapis.com/auth/drive.file',
      response_type: 'code token id_token'
    }, function(result) {
      resolve(result.code);
    });
  });
}

export async function getGoogleDriveAuth() {
  if(!gapi.auth2) await loadGoogleAPI();
  return await getAPIToken();
}

export function getServerAuthCode() {
  return new Promise(resolve => {
    firebase.auth().onAuthStateChanged(user => {
      if(user) {
        user.getIdTokenResult().then((result) => {
          console.log(result)
          resolve(result.token);
        });
      } else resolve(false)
    })
  })
}

export async function login() {
  const provider = new firebase.auth.GoogleAuthProvider();
  try {
    const result = await firebase.auth().signInWithPopup(provider);
    const token = result.credential.accessToken;
    const user = result.user;
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
  }
}

export function logout() {
  firebase.auth().signOut();
}

/**
 * Returns a promise which when resolved will give a boolean value for the admin status
 * @returns {Promise<boolean>}
 */
export function getAdminStatus() {
  return new Promise(resolve => {
    firebase.auth().onAuthStateChanged(user => {
      if(user) {
        user.getIdTokenResult().then((token) => {
          if(token.claims.moderator) {
            resolve(true);
          } else {
            resolve(false)
          }
        });
      } else resolve(false)
    });
  });
}

export function initLogin() {}