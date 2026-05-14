using System.ComponentModel.DataAnnotations;

namespace backend.Models
{

    public class LatestUpdate
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Content { get; set; }
        public string? MediaUrl { get; set; }
        public string Type { get; set; } = "TEXT"; // "VIDEO", "IMAGE", or "TEXT"
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public bool IsVisible { get; set; } = false;
    }
}