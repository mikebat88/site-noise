import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import "./MusicGridGlobal.css";


const Music = () => {
  const albums = [
  {
    id: 1,
    title: "SIX",
    image: "/path-to-six-cover.jpg",
    buyLink: "https://yourshop.com/six",
    streamLink: "https://spotify.com/six"
  },
  {
    id: 2,
    title: "LIVE...AND LET DIE",
    image: "/path-to-live-cover.jpg",
    buyLink: "https://yourshop.com/live",
    streamLink: "https://spotify.com/live"
  },
  {
    id: 3,
    title: "LIVE...AND LET DIE",
    image: "/path-to-live-cover.jpg",
    buyLink: "https://yourshop.com/live",
    streamLink: "https://spotify.com/live"
  },
  {
    id: 4,
    title: "LIVE...AND LET DIE",
    image: "/path-to-live-cover.jpg",
    buyLink: "https://yourshop.com/live",
    streamLink: "https://spotify.com/live"
  },
  {
    id: 5,
    title: "LIVE...AND LET DIE",
    image: "/path-to-live-cover.jpg",
    buyLink: "https://yourshop.com/live",
    streamLink: "https://spotify.com/live"
  }
];

  return (
    <div className="music-page">
      <div className="album-grid">
        {albums.map((album) => (
          <div key={album.id} className="album-card">
            <img src={album.image} alt={album.title} className="album-cover" />
            <h3 className="album-name">{album.title}</h3>
            
            <div className="album-links">
              <a href={album.buyLink} target="_blank" rel="noreferrer">buy</a>
              <span className="separator">|</span> 
              <a href={album.streamLink} target="_blank" rel="noreferrer">stream</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Music;