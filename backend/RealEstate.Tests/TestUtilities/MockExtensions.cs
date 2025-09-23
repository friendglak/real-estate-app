using AutoMapper;
using Microsoft.Extensions.Logging;
using Moq;
using RealEstate.Application.DTOs;
using RealEstate.Application.Interfaces;
using RealEstate.Domain.Entities;

namespace RealEstate.Tests.TestUtilities
{
    public static class MockExtensions
    {
        public static Mock<IPropertyRepository> CreateMockPropertyRepository()
        {
            var mock = new Mock<IPropertyRepository>();
            return mock;
        }

        public static Mock<IMapper> CreateMockMapper()
        {
            var mock = new Mock<IMapper>();
            return mock;
        }

        public static Mock<ILogger<T>> CreateMockLogger<T>()
        {
            var mock = new Mock<ILogger<T>>();
            return mock;
        }

        public static void SetupGetByIdAsync(this Mock<IPropertyRepository> mock, Property? property)
        {
            mock.Setup(x => x.GetByIdAsync(It.IsAny<string>()))
                .ReturnsAsync(property);
        }

        public static void SetupGetFilteredAsync(this Mock<IPropertyRepository> mock, PaginatedResultDto<Property> result)
        {
            mock.Setup(x => x.GetFilteredAsync(It.IsAny<PropertyFilterDto>()))
                .ReturnsAsync(result);
        }

        public static void SetupCreateAsync(this Mock<IPropertyRepository> mock, Property property)
        {
            mock.Setup(x => x.CreateAsync(It.IsAny<Property>()))
                .ReturnsAsync(property);
        }

        public static void SetupUpdateAsync(this Mock<IPropertyRepository> mock, Property? property)
        {
            mock.Setup(x => x.UpdateAsync(It.IsAny<string>(), It.IsAny<Property>()))
                .ReturnsAsync(property);
        }

        public static void SetupDeleteAsync(this Mock<IPropertyRepository> mock, bool result)
        {
            mock.Setup(x => x.DeleteAsync(It.IsAny<string>()))
                .ReturnsAsync(result);
        }

        public static void SetupMapPropertyToDto(this Mock<IMapper> mock, PropertyDto dto)
        {
            mock.Setup(x => x.Map<PropertyDto>(It.IsAny<Property>()))
                .Returns(dto);
        }

        public static void SetupMapDtoToProperty(this Mock<IMapper> mock, Property property)
        {
            mock.Setup(x => x.Map<Property>(It.IsAny<PropertyDto>()))
                .Returns(property);
        }

        public static void SetupMapPropertyListToDto(this Mock<IMapper> mock, List<PropertyListDto> dtos)
        {
            mock.Setup(x => x.Map<List<PropertyListDto>>(It.IsAny<List<Property>>()))
                .Returns(dtos);
        }
    }
}
