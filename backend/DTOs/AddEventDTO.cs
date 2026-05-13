namespace backend.DTOs;

public record AddEventDTO (
    DateTime Date,
    string Venue,
    string City,
    string InfoText,
    string InfoLink
);