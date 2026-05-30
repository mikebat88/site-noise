const YoutubeIdExtractor = (link) => {
    if (!link || typeof link !== 'string') return ""; 
    
    if (link.includes("watch?v=")) {
        return link.split("watch?v=")[1].split("&")[0];
    }
    return "";
}

export default YoutubeIdExtractor;