using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace RealEstate.Domain.Entities
{
    public class Property
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = string.Empty;

        [BsonElement("idOwner")]
        public string IdOwner { get; set; } = string.Empty;

        [BsonElement("name")]
        public string Name { get; set; } = string.Empty;

        [BsonElement("addressProperty")]
        public string AddressProperty { get; set; } = string.Empty;

        [BsonElement("priceProperty")]
        public decimal PriceProperty { get; set; }

        [BsonElement("imageUrl")]
        public string ImageUrl { get; set; } = string.Empty;

        [BsonElement("description")]
        public string? Description { get; set; }

        [BsonElement("bedrooms")]
        public int? Bedrooms { get; set; }

        [BsonElement("bathrooms")]
        public int? Bathrooms { get; set; }

        [BsonElement("squareMeters")]
        public double? SquareMeters { get; set; }

        [BsonElement("propertyType")]
        public PropertyType PropertyType { get; set; }

        [BsonElement("isAvailable")]
        public bool IsAvailable { get; set; } = true;

        [BsonElement("createdAt")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [BsonElement("updatedAt")]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }

    public enum PropertyType
    {
        House,
        Apartment,
        Condo,
        Townhouse,
        Land,
        Commercial
    }
}