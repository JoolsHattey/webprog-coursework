'use strict';

export function initDrive(uid) {
    return new Promise(resolve => {
        gapi.load('auth2', () => {
            gapi.auth2.authorize({
                client_id: '669091989709-1ft3bvjahneklp47kefipe1h6gglnr4o.apps.googleusercontent.com',
                scope: 'https://www.googleapis.com/auth/drive.file',
                response_type: 'code token id_token'
            }, function(result) {
                console.log(result)
                fetch(`/api/exportdrive/${uid}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({authToken: result.code})
                }).then(data => console.log(data.json().then(thing => resolve(thing))))
            });
        });
    });
}

export async function getGoogleDriveAuth() {
    
}