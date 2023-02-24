import { Config } from '../config.js';

let access_token = '';
const CLIENT_ID = Config.clientId;
// const redirectUri = 'http://localhost:3000/';
const redirectUri = 'http://vince-jamming.surge.sh/';
const Spotify = {
    getAccessToken() {
        if (access_token) {
            return access_token;
        }
        const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
        const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);
        if (accessTokenMatch && expiresInMatch) {
            access_token = accessTokenMatch[1];
            const expiresIn = Number(expiresInMatch[1]);
            window.setTimeout(() => access_token = '', expiresIn * 1000);
            window.history.pushState('Access Token', null, '/');
            return access_token;
        } else {
            window.location = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
        }
    },
    
    search(term) {
        const access_token = Spotify.getAccessToken();
        // const endpoint = `https://api.spotify.com/v1/search?type=track&q=${term}`;

        // const response = fetch(endpoint, { headers: { Authorization: `Bearer ${access_token}` } });

        // if (response.ok) {
        //     const returned = response.json();
        //     if (returned.tracks) {
        //         return returned.tracks.items.map(track => ({
        //             id: track.id,
        //             name: track.name,
        //             artist: track.artists[0].name,
        //             album: track.album.name,
        //             uri: track.uri
        //         }));
        //     } else {
        //         return [];
        //     }
        // } else {
        //     return [];
        // }

        return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
            headers: { Authorization: `Bearer ${access_token}` }
        })
            .then(response => {
                return response.json();
            })
            .then(jsonResponse => {
                if (!jsonResponse.tracks) {
                    return [];
                }
                return jsonResponse.tracks.items.map(track => ({
                    id: track.id,
                    name: track.name,
                    artist: track.artists[0].name,
                    album: track.album.name,
                    uri: track.uri
                }));
            }).catch(error => {
                console.log(error);
            });
    },

    savePlaylist(name, trackUris) {
        if (!name || !trackUris.length) {
            return Promise.reject('Name or trackUris is empty');
        }

        // add loading screen

        const access_token = Spotify.getAccessToken();
        const headers = { Authorization: `Bearer ${access_token}` };
        let userId;

        return fetch('https://api.spotify.com/v1/me', { headers: headers })
            .then(response => response.json())
            .then(jsonResponse => {
                userId = jsonResponse.id;
                return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
                    headers: headers,
                    method: 'POST',
                    body: JSON.stringify({ name: name })
                })
                    .then(response => response.json())
                    .then(jsonResponse => {
                        const playlistId = jsonResponse.id;
                        return fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`, {
                            headers: headers,
                            method: 'POST',
                            body: JSON.stringify({ uris: trackUris })
                        });
                    });
            });
    }
};

export { Spotify };