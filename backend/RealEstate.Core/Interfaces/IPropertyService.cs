using RealEstate.Application.DTOs;

namespace RealEstate.Application.Interfaces
{
    public interface IPropertyService
    {
        Task<PropertyDto?> GetByIdAsync(string id);
        Task<PaginatedResultDto<PropertyListDto>> GetFilteredAsync(PropertyFilterDto filter);
        Task<PropertyDto> CreateAsync(PropertyDto propertyDto);
        Task<PropertyDto?> UpdateAsync(string id, PropertyDto propertyDto);
        Task<bool> DeleteAsync(string id);
    }
}