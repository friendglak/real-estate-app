using System.ComponentModel.DataAnnotations;

namespace RealEstate.Application.DTOs
{
    public class PropertyDto
    {
        public string? Id { get; set; }

        [Required]
        public string IdOwner { get; set; } = string.Empty;

        [Required]
        [StringLength(100, MinimumLength = 3)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [StringLength(200, MinimumLength = 5)]
        public string AddressProperty { get; set; } = string.Empty;

        [Required]
        [Range(0, double.MaxValue, ErrorMessage = "Price must be a positive value")]
        public decimal PriceProperty { get; set; }

        [Required]
        [Url]
        public string ImageUrl { get; set; } = string.Empty;

        public string? Description { get; set; }
        public int? Bedrooms { get; set; }
        public int? Bathrooms { get; set; }
        public double? SquareMeters { get; set; }
        public string PropertyType { get; set; } = "House";
        public bool IsAvailable { get; set; } = true;
    }
}
