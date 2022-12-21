import React from 'react';

import './Playlist.css';
import { TrackList } from '../TrackList/TrackList';

export class Playlist extends React.Component {

    constructor(props) {
        super(props);
        this.handleNameChange = this.handleNameChange.bind(this);
    }

    handleNameChange(event) {
        this.props.onNameChange(event.target.value);
    }
    render() {
        return (
            <div className="Playlist">
                <input placeholder='Enter Playlist Name' onChange={this.handleNameChange}/>
                {/* <!-- Add a TrackList component --> */}
                <TrackList tracks={this.props.playlistTracks} onRemove={this.props.onRemove} isRemoval={true}/>
                <button className="Playlist-save" onClick={this.props.onSave}>SAVE TO SPOTIFY</button>
            </div>
        );
    }
}