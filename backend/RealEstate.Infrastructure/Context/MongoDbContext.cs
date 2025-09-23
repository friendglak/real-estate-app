using MongoDB.Driver;
using Microsoft.Extensions.Options;
using RealEstate.Domain.Entities;
using RealEstate.Infrastructure.Settings;

namespace RealEstate.Infrastructure.Context
{
    public class MongoDbContext
    {
        private readonly IMongoDatabase _database;
        private readonly MongoDbSettings _settings;

        public MongoDbContext(IOptions<MongoDbSettings> settings)
        {
            _settings = settings.Value;

            var client = new MongoClient(_settings.ConnectionString);
            _database = client.GetDatabase(_settings.DatabaseName);

            // Ensure indexes are created
            CreateIndexes();
        }

        public IMongoCollection<Property> Properties =>
            _database.GetCollection<Property>(_settings.PropertiesCollectionName);

        public IMongoCollection<Owner> Owners =>
            _database.GetCollection<Owner>(_settings.OwnersCollectionName);

        private void CreateIndexes()
        {
            // Create indexes for better query performance
            var propertyIndexKeys = Builders<Property>.IndexKeys;
            var propertyIndexModels = new[]
            {
                new CreateIndexModel<Property>(propertyIndexKeys.Text(x => x.Name)),
                new CreateIndexModel<Property>(propertyIndexKeys.Text(x => x.AddressProperty)),
                new CreateIndexModel<Property>(propertyIndexKeys.Ascending(x => x.PriceProperty)),
                new CreateIndexModel<Property>(propertyIndexKeys.Ascending(x => x.PropertyType)),
                new CreateIndexModel<Property>(propertyIndexKeys.Ascending(x => x.IsAvailable)),
                new CreateIndexModel<Property>(propertyIndexKeys.Ascending(x => x.IdOwner)),
                new CreateIndexModel<Property>(
                    propertyIndexKeys.Combine(
                        propertyIndexKeys.Text(x => x.Name),
                        propertyIndexKeys.Text(x => x.AddressProperty)
                    ),
                    new CreateIndexOptions { Name = "text_search_index" }
                )
            };

            Properties.Indexes.CreateMany(propertyIndexModels);

            var ownerIndexKeys = Builders<Owner>.IndexKeys;
            var ownerIndexModel = new CreateIndexModel<Owner>(
                ownerIndexKeys.Ascending(x => x.Email),
                new CreateIndexOptions { Unique = true }
            );

            Owners.Indexes.CreateOne(ownerIndexModel);
        }
    }
}