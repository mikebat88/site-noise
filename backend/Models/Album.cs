using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class Album
    {
        [Key]
        public int Id { get; private set;}
        [Required]
        public string Title { get; set; } = string.Empty;
        [Required]
        public string Cover { get; set; } = string.Empty;
        [Required]
        public string BuyLink { get; set; } = string.Empty;
        [Required]
        public string StreamLink { get; set; } = string.Empty;
        [Required]
        public DateTime ReleaseDate { get; set; }
    }
}