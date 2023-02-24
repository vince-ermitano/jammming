// import logo from './logo.svg';
import React from 'react';
import './App.css';
import { SearchBar } from '../SearchBar/SearchBar.js';
import { SearchResults } from '../SearchResults/SearchResults.js';
import { Playlist } from '../Playlist/Playlist.js';
import { Spotify } from '../../util/Spotify.js';

//hardcoded tracks for placeholders
// const track_1 = { name: 'name_1', artist: 'artist_1', album: 'album_1', id: 1 };
// const track_2 = { name: 'name_2', artist: 'artist_2', album: 'album_2', id: 2 };
// const track_3 = { name: 'name_3', artist: 'artist_3', album: 'album_3', id: 3 };
// const track_4 = { name: 'name_4', artist: 'artist_4', album: 'album_4', id: 4 };
// const track_5 = { name: 'name_5', artist: 'artist_5', album: 'album_5', id: 5 };
// const track_6 = { name: 'name_6', artist: 'artist_6', album: 'album_6', id: 6 };

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { searchResults : [],
                   playlistName: '',
                   playlistTracks: [] };
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }

  addTrack(track) {
    if (this.state.playlistTracks.find(savedTrack => savedTrack.id === track.id)) {
      return;
    }
    this.state.playlistTracks.push(track);
    this.setState({playlistTracks: this.state.playlistTracks});
  }

  removeTrack(track) {
    const filtered = this.state.playlistTracks.filter(savedTrack => savedTrack.id !== track.id);
    this.setState({playlistTracks: filtered});
  }

  updatePlaylistName(name) {
    this.setState({playlistName: name});
  }

  savePlaylist() {
    const trackURIs = this.state.playlistTracks.map(track => track.uri);
    console.log(trackURIs.length);
    Spotify.savePlaylist(this.state.playlistName, trackURIs).then(() => {
      this.setState({
        playlistName: 'New Playlist',
        playlistTracks: []
      });
      const input = document.querySelector('.Playlist input');
      input.value = '';
      alert('Playlist saved!');
    }).catch(error => {
      console.log(error)});
  }

  search(searchTerm) {
    console.log(searchTerm);
    Spotify.search(searchTerm).then(searchResults => {
      localStorage.setItem('searchResults', JSON.stringify(searchResults));
      this.setState({searchResults: searchResults});
    });
  }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          {/* <!-- Add a SearchBar component --> */}
          <SearchBar onSearch={this.search}/>
          <div className="App-playlist">
            {/* <!-- Add a SearchResults component --> */}
            <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack}/>
            {/* <!-- Add a Playlist component --> */}
            <Playlist playlistName={this.state.playlistName} playlistTracks={this.state.playlistTracks} onRemove={this.removeTrack} onNameChange={this.updatePlaylistName} onSave={this.savePlaylist}/>
          </div>
        </div>
        <div>Test</div>
      </div>
    );
  }
}

export default App;
