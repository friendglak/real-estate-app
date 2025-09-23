using MongoDB.Bson;
using RealEstate.Application.DTOs;
using RealEstate.Domain.Entities;

namespace RealEstate.Tests.TestUtilities
{
    public static class TestDataBuilder
    {
        public static PropertyDto CreateValidPropertyDto(string? id = null)
        {
            return new PropertyDto
            {
                Id = id,
                IdOwner = "507f1f77bcf86cd799439011",
                Name = "Beautiful House",
                AddressProperty = "123 Main Street, City, State 12345",
                PriceProperty = 500000.00m,
                ImageUrl = "https://example.com/image.jpg",
                Description = "A beautiful house with great views",
                Bedrooms = 3,
                Bathrooms = 2,
                SquareMeters = 150.5,
                PropertyType = "House",
                IsAvailable = true
            };
        }

        public static Property CreateValidProperty(string? id = null)
        {
            return new Property
            {
                Id = id ?? ObjectId.GenerateNewId().ToString(),
                IdOwner = "507f1f77bcf86cd799439011",
                Name = "Beautiful House",
                AddressProperty = "123 Main Street, City, State 12345",
                PriceProperty = 500000.00m,
                ImageUrl = "https://example.com/image.jpg",
                Description = "A beautiful house with great views",
                Bedrooms = 3,
                Bathrooms = 2,
                SquareMeters = 150.5,
                PropertyType = PropertyType.House,
                IsAvailable = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };
        }

        public static PropertyFilterDto CreateValidPropertyFilter()
        {
            return new PropertyFilterDto
            {
                Name = "House",
                MinPrice = 100000,
                MaxPrice = 1000000,
                PropertyType = "House",
                IsAvailable = true,
                PageNumber = 1,
                PageSize = 10
            };
        }

        public static List<Property> CreatePropertyList(int count = 5)
        {
            var properties = new List<Property>();
            for (int i = 0; i < count; i++)
            {
                properties.Add(new Property
                {
                    Id = ObjectId.GenerateNewId().ToString(),
                    IdOwner = "507f1f77bcf86cd799439011",
                    Name = $"Property {i + 1}",
                    AddressProperty = $"{100 + i} Main Street, City, State 12345",
                    PriceProperty = 200000 + (i * 50000),
                    ImageUrl = $"https://example.com/image{i + 1}.jpg",
                    Description = $"Description for property {i + 1}",
                    Bedrooms = 2 + i,
                    Bathrooms = 1 + i,
                    SquareMeters = 100 + (i * 25),
                    PropertyType = (PropertyType)(i % 6),
                    IsAvailable = i % 2 == 0,
                    CreatedAt = DateTime.UtcNow.AddDays(-i),
                    UpdatedAt = DateTime.UtcNow.AddDays(-i)
                });
            }
            return properties;
        }

        public static PropertyDto CreateInvalidPropertyDto()
        {
            return new PropertyDto
            {
                Id = "invalid-id",
                IdOwner = "", // Invalid: empty
                Name = "A", // Invalid: too short
                AddressProperty = "123", // Invalid: too short
                PriceProperty = -1000, // Invalid: negative price
                ImageUrl = "not-a-url", // Invalid: not a URL
                PropertyType = "InvalidType", // Invalid: not a valid enum
                Bedrooms = -1, // Invalid: negative
                Bathrooms = 100, // Invalid: too many
                SquareMeters = -50 // Invalid: negative
            };
        }
    }
}
