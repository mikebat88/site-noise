const FormatUrl = (url) => {
    if (!url) return ""; 
    
    if (/^https?:\/\//i.test(url)) {
        return url;
    }
    
    return `https://${url}`;
}

export default FormatUrl;