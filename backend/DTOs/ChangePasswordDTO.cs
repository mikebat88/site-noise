namespace backend.DTOs;

public record ChangePasswordDto (
    string OldPassword,
    string NewPassword
);