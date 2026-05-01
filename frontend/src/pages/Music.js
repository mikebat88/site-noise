import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import "./MusicGridGlobal.css";


const Music = () => {
	const [albums, setAlbums] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
			const fetchAlbums = async () => {
				try {
					const response = await fetch('http://localhost:5000/api/albums');
					const data = await response.json();
					
					const sorted = data.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));
					
					setAlbums(sorted);
					setLoading(false);
				} catch (error) {
					console.error("Failed to fetch albums:", error);
					setLoading(false);
				}
			};
	
			fetchAlbums();
		}, []);

	return (
		<div className="music-page">
            {loading ? (
                <p className="status-message">LOADING DATABASE...</p>
            ) : albums.length == 0 ? (  
                <div className="empty-state">
                    <p>ain’t nobody here but us chickens</p>
                </div>
            ) : (
                <div className="album-grid">
                    {albums.map((album) => (
                    <div key={album.id} className="album-card">
                        <img 
                            src={`http://localhost:5000${album.cover}`} 
                            alt={album.title} 
                            className="album-cover" 
                        />
                        <h3 className="album-name">{album.title}</h3>
				
						<div className="album-links">
							<a href={album.buyLink} target="_blank" rel="noreferrer">buy</a>
							<span className="separator">|</span> 
							<a href={album.streamLink} target="_blank" rel="noreferrer">stream</a>
						</div>
					</div>
				))}
				</div>
			)}	
		</div>
	);
};

export default Music;