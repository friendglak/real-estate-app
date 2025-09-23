using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using MongoDB.Driver;
using RealEstate.Domain.Entities;
using RealEstate.Infrastructure.Context;

namespace RealEstate.Infrastructure.SeedData
{
    public class DatabaseSeeder : IHostedService
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly ILogger<DatabaseSeeder> _logger;

        public DatabaseSeeder(IServiceProvider serviceProvider, ILogger<DatabaseSeeder> logger)
        {
            _serviceProvider = serviceProvider;
            _logger = logger;
        }

        public async Task StartAsync(CancellationToken cancellationToken)
        {
            using var scope = _serviceProvider.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<MongoDbContext>();

            try
            {
                await SeedDataAsync(context);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while seeding the database");
            }
        }

        public Task StopAsync(CancellationToken cancellationToken) => Task.CompletedTask;

        private async Task SeedDataAsync(MongoDbContext context)
        {
            // Check if data already exists
            var count = await context.Properties.CountDocumentsAsync(FilterDefinition<Property>.Empty);
            if (count > 0)
            {
                _logger.LogInformation("Database already contains data. Skipping seed");
                return;
            }

            _logger.LogInformation("Seeding database with initial data");

            // Create sample owners
            var owners = new List<Owner>
            {
                new Owner
                {
                    Name = "John Doe",
                    Email = "john.doe@example.com",
                    Phone = "+1234567890"
                },
                new Owner
                {
                    Name = "Jane Smith",
                    Email = "jane.smith@example.com",
                    Phone = "+0987654321"
                }
            };

            await context.Owners.InsertManyAsync(owners);

            // Create sample properties
            var properties = new List<Property>
            {
                new Property
                {
                    IdOwner = owners[0].Id,
                    Name = "Luxury Downtown Apartment",
                    AddressProperty = "123 Main St, New York, NY 10001",
                    PriceProperty = 850000,
                    ImageUrl = "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800",
                    Description = "Modern 2-bedroom apartment with stunning city views",
                    Bedrooms = 2,
                    Bathrooms = 2,
                    SquareMeters = 120,
                    PropertyType = PropertyType.Apartment,
                    IsAvailable = true
                },
                new Property
                {
                    IdOwner = owners[0].Id,
                    Name = "Suburban Family House",
                    AddressProperty = "456 Oak Avenue, Los Angeles, CA 90001",
                    PriceProperty = 1200000,
                    ImageUrl = "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800",
                    Description = "Spacious 4-bedroom house with garden and pool",
                    Bedrooms = 4,
                    Bathrooms = 3,
                    SquareMeters = 250,
                    PropertyType = PropertyType.House,
                    IsAvailable = true
                },
                new Property
                {
                    IdOwner = owners[1].Id,
                    Name = "Beach Condo Paradise",
                    AddressProperty = "789 Ocean Drive, Miami, FL 33139",
                    PriceProperty = 650000,
                    ImageUrl = "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800",
                    Description = "Beautiful beachfront condo with ocean views",
                    Bedrooms = 1,
                    Bathrooms = 1,
                    SquareMeters = 85,
                    PropertyType = PropertyType.Condo,
                    IsAvailable = true
                },
                new Property
                {
                    IdOwner = owners[1].Id,
                    Name = "Mountain Retreat Townhouse",
                    AddressProperty = "321 Pine Street, Denver, CO 80201",
                    PriceProperty = 450000,
                    ImageUrl = "https://images.unsplash.com/photo-1494526585095-c41746248156?w=800",
                    Description = "Cozy townhouse near ski resorts",
                    Bedrooms = 3,
                    Bathrooms = 2,
                    SquareMeters = 150,
                    PropertyType = PropertyType.Townhouse,
                    IsAvailable = false
                }
            };

            await context.Properties.InsertManyAsync(properties);
            _logger.LogInformation("Database seeded successfully with {Count} properties", properties.Count);
        }
    }
}
