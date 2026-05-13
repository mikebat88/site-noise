using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class Event
    {
        [Key]
        public int Id { get; private set;}
        [Required]
        public DateTime Date { get; set; }
        [Required]
        public string Venue { get; set; } = string.Empty;
        [Required]
        public string City { get; set; } = string.Empty;
        [Required]
        public string InfoText { get; set; } = string.Empty;
        [Required]
        public string InfoLink { get; set; }  = string.Empty;
    }
}