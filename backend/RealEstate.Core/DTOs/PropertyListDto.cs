namespace RealEstate.Application.DTOs
{
    public class PropertyListDto
    {
        public string Id { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string AddressProperty { get; set; } = string.Empty;
        public decimal PriceProperty { get; set; }
        public string ImageUrl { get; set; } = string.Empty;
        public string PropertyType { get; set; } = string.Empty;
        public bool IsAvailable { get; set; }
    }
}
