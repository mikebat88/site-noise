using System.ComponentModel.DataAnnotations;

namespace backend.Models
{

    public class LatestUpdate
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string Title { get; set; } = string.Empty;
        public string? Content { get; set; }
        public string? MediaUrl { get; set; }
        [Required]
        public string Type { get; set; } = "TEXT"; // "VIDEO", "IMAGE", or "TEXT"
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public bool IsVisible { get; set; } = false;
    }
}