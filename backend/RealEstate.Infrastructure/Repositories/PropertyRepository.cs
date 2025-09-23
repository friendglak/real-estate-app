using MongoDB.Driver;
using MongoDB.Bson;
using Microsoft.Extensions.Logging;
using RealEstate.Application.Interfaces;
using RealEstate.Domain.Entities;
using RealEstate.Application.DTOs;
using RealEstate.Infrastructure.Context;
using System.Text.RegularExpressions;

namespace RealEstate.Infrastructure.Repositories
{
    public class PropertyRepository : IPropertyRepository
    {
        private readonly MongoDbContext _context;
        private readonly ILogger<PropertyRepository> _logger;

        public PropertyRepository(MongoDbContext context, ILogger<PropertyRepository> logger)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        public async Task<Property?> GetByIdAsync(string id)
        {
            try
            {
                if (!ObjectId.TryParse(id, out _))
                    return null;

                return await _context.Properties
                    .Find(p => p.Id == id)
                    .FirstOrDefaultAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving property with ID: {PropertyId}", id);
                throw new InvalidOperationException($"Failed to retrieve property with id {id}", ex);
            }
        }

        public async Task<PaginatedResultDto<Property>> GetFilteredAsync(PropertyFilterDto filter)
        {
            try
            {
                var filterBuilder = Builders<Property>.Filter;
                var filterDefinition = filterBuilder.Empty;

                // Build dynamic filters
                if (!string.IsNullOrWhiteSpace(filter.Name))
                {
                    var nameRegex = new BsonRegularExpression(Regex.Escape(filter.Name), "i");
                    filterDefinition &= filterBuilder.Regex(p => p.Name, nameRegex);
                }

                if (!string.IsNullOrWhiteSpace(filter.Address))
                {
                    var addressRegex = new BsonRegularExpression(Regex.Escape(filter.Address), "i");
                    filterDefinition &= filterBuilder.Regex(p => p.AddressProperty, addressRegex);
                }

                if (filter.MinPrice.HasValue)
                {
                    filterDefinition &= filterBuilder.Gte(p => p.PriceProperty, filter.MinPrice.Value);
                }

                if (filter.MaxPrice.HasValue)
                {
                    filterDefinition &= filterBuilder.Lte(p => p.PriceProperty, filter.MaxPrice.Value);
                }

                if (!string.IsNullOrWhiteSpace(filter.PropertyType) &&
                    Enum.TryParse<PropertyType>(filter.PropertyType, out var propertyType))
                {
                    filterDefinition &= filterBuilder.Eq(p => p.PropertyType, propertyType);
                }

                if (filter.IsAvailable.HasValue)
                {
                    filterDefinition &= filterBuilder.Eq(p => p.IsAvailable, filter.IsAvailable.Value);
                }

                // Get total count for pagination
                var totalCount = await _context.Properties.CountDocumentsAsync(filterDefinition);

                // Get paginated results
                var skip = (filter.PageNumber - 1) * filter.PageSize;
                var properties = await _context.Properties
                    .Find(filterDefinition)
                    .SortByDescending(p => p.CreatedAt)
                    .Skip(skip)
                    .Limit(filter.PageSize)
                    .ToListAsync();

                return new PaginatedResultDto<Property>
                {
                    Items = properties,
                    PageNumber = filter.PageNumber,
                    PageSize = filter.PageSize,
                    TotalCount = (int)totalCount
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error filtering properties");
                throw new InvalidOperationException("Failed to filter properties", ex);
            }
        }

        public async Task<Property> CreateAsync(Property property)
        {
            try
            {
                await _context.Properties.InsertOneAsync(property);
                return property;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating property");
                throw new InvalidOperationException("Failed to create property", ex);
            }
        }

        public async Task<Property?> UpdateAsync(string id, Property property)
        {
            try
            {
                if (!ObjectId.TryParse(id, out _))
                    return null;

                property.Id = id;
                var result = await _context.Properties.ReplaceOneAsync(
                    p => p.Id == id,
                    property,
                    new ReplaceOptions { IsUpsert = false }
                );

                return result.ModifiedCount > 0 ? property : null;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating property with ID: {PropertyId}", id);
                throw new InvalidOperationException($"Failed to update property with id {id}", ex);
            }
        }

        public async Task<bool> DeleteAsync(string id)
        {
            try
            {
                if (!ObjectId.TryParse(id, out _))
                    return false;

                var result = await _context.Properties.DeleteOneAsync(p => p.Id == id);
                return result.DeletedCount > 0;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting property with ID: {PropertyId}", id);
                throw new InvalidOperationException($"Failed to delete property with id {id}", ex);
            }
        }

        public async Task<bool> ExistsAsync(string id)
        {
            try
            {
                if (!ObjectId.TryParse(id, out _))
                    return false;

                var count = await _context.Properties.CountDocumentsAsync(p => p.Id == id);
                return count > 0;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error checking if property exists with ID: {PropertyId}", id);
                throw new InvalidOperationException($"Failed to check if property exists with id {id}", ex);
            }
        }

        public async Task<int> GetTotalCountAsync()
        {
            try
            {
                var count = await _context.Properties.CountDocumentsAsync(FilterDefinition<Property>.Empty);
                return (int)count;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting total property count");
                throw new InvalidOperationException("Failed to get total property count", ex);
            }
        }
    }
}