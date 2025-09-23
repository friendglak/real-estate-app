using AutoMapper;
using Microsoft.Extensions.Logging;
using RealEstate.Application.DTOs;
using RealEstate.Application.Interfaces;
using RealEstate.Domain.Entities;

namespace RealEstate.Application.Services
{
    public class PropertyService : IPropertyService
    {
        private readonly IPropertyRepository _repository;
        private readonly IMapper _mapper;
        private readonly ILogger<PropertyService> _logger;

        public PropertyService(
            IPropertyRepository repository,
            IMapper mapper,
            ILogger<PropertyService> logger)
        {
            _repository = repository ?? throw new ArgumentNullException(nameof(repository));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        public async Task<PropertyDto?> GetByIdAsync(string id)
        {
            try
            {
                var property = await _repository.GetByIdAsync(id);
                return property != null ? _mapper.Map<PropertyDto>(property) : null;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting property with id {PropertyId}", id);
                throw new InvalidOperationException($"Failed to retrieve property with id {id}", ex);
            }
        }

        public async Task<PaginatedResultDto<PropertyListDto>> GetFilteredAsync(PropertyFilterDto filter)
        {
            try
            {
                // Validate pagination parameters
                if (filter.PageNumber < 1) filter.PageNumber = 1;
                if (filter.PageSize < 1) filter.PageSize = 10;
                if (filter.PageSize > 100) filter.PageSize = 100; // Max page size limit

                var result = await _repository.GetFilteredAsync(filter);

                return new PaginatedResultDto<PropertyListDto>
                {
                    Items = _mapper.Map<List<PropertyListDto>>(result.Items),
                    PageNumber = result.PageNumber,
                    PageSize = result.PageSize,
                    TotalCount = result.TotalCount
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting filtered properties");
                throw new InvalidOperationException("Failed to retrieve filtered properties", ex);
            }
        }

        public async Task<PropertyDto> CreateAsync(PropertyDto propertyDto)
        {
            try
            {
                var property = _mapper.Map<Property>(propertyDto);
                property.CreatedAt = DateTime.UtcNow;
                property.UpdatedAt = DateTime.UtcNow;

                var created = await _repository.CreateAsync(property);
                return _mapper.Map<PropertyDto>(created);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating property");
                throw new InvalidOperationException("Failed to create property", ex);
            }
        }

        public async Task<PropertyDto?> UpdateAsync(string id, PropertyDto propertyDto)
        {
            try
            {
                var property = _mapper.Map<Property>(propertyDto);
                property.Id = id;
                property.UpdatedAt = DateTime.UtcNow;

                var updated = await _repository.UpdateAsync(id, property);
                return updated != null ? _mapper.Map<PropertyDto>(updated) : null;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating property with id {PropertyId}", id);
                throw new InvalidOperationException($"Failed to update property with id {id}", ex);
            }
        }

        public async Task<bool> DeleteAsync(string id)
        {
            try
            {
                return await _repository.DeleteAsync(id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting property with id {PropertyId}", id);
                throw new InvalidOperationException($"Failed to delete property with id {id}", ex);
            }
        }
    }
}