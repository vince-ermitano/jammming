import React from 'react';
import './TrackList.css';
import { Track } from '../Track/Track';


export class TrackList extends React.Component {
    // constructor(props) {
    //     super(props);
    // }

    render() {
        return (
            <div className="TrackList">
                { this.props.tracks.map(track => {
                    return <Track track={track} onRemove={this.props.onRemove} onAdd={this.props.onAdd} key={track.id} isRemoval={this.props.isRemoval}/>
                }) }
            </div>
        );
    }
}