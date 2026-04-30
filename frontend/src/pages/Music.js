import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';


const Music = () => {
  const albums = [
    {
      id: 1,
      title: "SIX",
      image: "/path-to-six-cover.jpg",
      links: [{ label: "PRE-ORDER", url: "#" }, { label: "STREAM", url: "#" }]
    },
    {
      id: 2,
      title: "LIVE...AND LET DIE",
      image: "/path-to-live-cover.jpg",
      links: [{ label: "BUY", url: "#" }, { label: "STREAM", url: "#" }]
    },
    // Add more albums here
  ];

  return (
    <div className="music-page">
      <h1 className="page-title">MUSIC</h1>
      
      <div className="album-grid">
        {albums.map((album) => (
          <div key={album.id} className="album-card">
            <img src={album.image} alt={album.title} className="album-cover" />
            <h3 className="album-name">{album.title}</h3>
            <div className="album-links">
              {album.links.map((link, index) => (
                <span key={index}>
                  <a href={link.url}>{link.label}</a>
                  {index < album.links.length - 1 && " | "}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Music;