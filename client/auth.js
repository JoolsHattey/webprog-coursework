/* eslint-disable no-undef */
'use strict';

import { firebaseConfig, clientID } from './config.js';

firebase.initializeApp(firebaseConfig);

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
      client_id: clientID,
      scope: 'https://www.googleapis.com/auth/drive.file',
      response_type: 'code token id_token',
    }, (result) => {
      resolve(result.code);
    });
  });
}

export async function getGoogleDriveAuth() {
  if (!gapi.auth2) await loadGoogleAPI();
  return getAPIToken();
}

/**
 * Get auth code used for backend authentication
 * @returns {String}
 */
export function getServerAuthCode() {
  return new Promise(resolve => {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        user.getIdTokenResult().then((result) => {
          resolve(result.token);
        });
      } else resolve(null);
    });
  });
}

export async function login() {
  const provider = new firebase.auth.GoogleAuthProvider();
  await firebase.auth().signInWithPopup(provider);
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
      if (user) {
        user.getIdTokenResult().then((token) => {
          if (token.claims.admin) {
            resolve(true);
          } else {
            resolve(false);
          }
        });
      } else resolve(false);
    });
  });
}
