namespace backend.DTOs;

public record ChangePasswordDto (
    string CurrentPassword,
    string NewPassword
);