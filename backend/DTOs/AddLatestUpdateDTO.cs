namespace backend.DTOs;

public record AddLatestUpdateDTO (
    string Title,
    string Content,
    string? Type,
    string? MediaUrl,
    bool IsVisible
);