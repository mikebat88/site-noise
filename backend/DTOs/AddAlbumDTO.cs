namespace backend.DTOs;

public record AddAlbumDTO (
    string Title,
    string Cover,
    string BuyLink,
    string StreamLink,
    DateTime ReleaseDate
);