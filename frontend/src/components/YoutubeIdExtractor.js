const YoutubeIdExtractor = ({link}) => {
    return link.split("watch?v=")[1].split("&")[0];
}

export default YoutubeIdExtractor;