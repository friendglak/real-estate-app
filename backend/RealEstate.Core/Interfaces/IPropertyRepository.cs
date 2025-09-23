using RealEstate.Application.DTOs;
using RealEstate.Domain.Entities;

namespace RealEstate.Application.Interfaces
{
    public interface IPropertyRepository
    {
        Task<Property?> GetByIdAsync(string id);
        Task<PaginatedResultDto<Property>> GetFilteredAsync(PropertyFilterDto filter);
        Task<Property> CreateAsync(Property property);
        Task<Property?> UpdateAsync(string id, Property property);
        Task<bool> DeleteAsync(string id);
        Task<bool> ExistsAsync(string id);
        Task<int> GetTotalCountAsync();
    }
}