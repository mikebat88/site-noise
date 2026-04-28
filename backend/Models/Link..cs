using System.ComponentModel.DataAnnotations;

namespace Models
{
    public class Link
    {
        [Key]
        public int Id { get; private set; }
        [Required]
        public string Title { get; set; } = string.Empty;
        [Required]
        public string Url { get; set; } = string.Empty;
        [Required]
        public string Icon { get; set; } = string.Empty;
    }
}