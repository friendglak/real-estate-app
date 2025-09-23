using AutoMapper;
using Microsoft.Extensions.Logging;
using Moq;
using RealEstate.Application.DTOs;
using RealEstate.Application.Interfaces;
using RealEstate.Application.Services;
using RealEstate.Domain.Entities;
using RealEstate.Tests.TestUtilities;
using FluentAssertions;

namespace RealEstate.Tests.Services
{
    [TestFixture]
    public class PropertyServiceTests
    {
        private Mock<IPropertyRepository> _mockRepository;
        private Mock<IMapper> _mockMapper;
        private Mock<ILogger<PropertyService>> _mockLogger;
        private PropertyService _service;

        [SetUp]
        public void Setup()
        {
            _mockRepository = new Mock<IPropertyRepository>();
            _mockMapper = new Mock<IMapper>();
            _mockLogger = new Mock<ILogger<PropertyService>>();
            _service = new PropertyService(_mockRepository.Object, _mockMapper.Object, _mockLogger.Object);
        }

        [Test]
        public async Task GetByIdAsync_ValidId_ReturnsPropertyDto()
        {
            // Arrange
            var propertyId = "507f1f77bcf86cd799439011";
            var property = TestDataBuilder.CreateValidProperty(propertyId);
            var propertyDto = TestDataBuilder.CreateValidPropertyDto(propertyId);

            _mockRepository.SetupGetByIdAsync(property);
            _mockMapper.SetupMapPropertyToDto(propertyDto);

            // Act
            var result = await _service.GetByIdAsync(propertyId);

            // Assert
            result.Should().NotBeNull();
            result.Should().BeEquivalentTo(propertyDto);
            _mockRepository.Verify(x => x.GetByIdAsync(propertyId), Times.Once);
            _mockMapper.Verify(x => x.Map<PropertyDto>(property), Times.Once);
        }

        [Test]
        public async Task GetByIdAsync_InvalidId_ReturnsNull()
        {
            // Arrange
            var propertyId = "invalid-id";
            _mockRepository.SetupGetByIdAsync(null);

            // Act
            var result = await _service.GetByIdAsync(propertyId);

            // Assert
            result.Should().BeNull();
            _mockRepository.Verify(x => x.GetByIdAsync(propertyId), Times.Once);
            _mockMapper.Verify(x => x.Map<PropertyDto>(It.IsAny<Property>()), Times.Never);
        }

        [Test]
        public async Task GetByIdAsync_RepositoryThrows_ThrowsInvalidOperationException()
        {
            // Arrange
            var propertyId = "507f1f77bcf86cd799439011";
            _mockRepository.Setup(x => x.GetByIdAsync(propertyId))
                .ThrowsAsync(new Exception("Database error"));

            // Act & Assert
            await _service.Invoking(s => s.GetByIdAsync(propertyId))
                .Should().ThrowAsync<InvalidOperationException>()
                .WithMessage($"Failed to retrieve property with id {propertyId}");
        }

        [Test]
        public async Task GetFilteredAsync_ValidFilter_ReturnsPaginatedResult()
        {
            // Arrange
            var filter = TestDataBuilder.CreateValidPropertyFilter();
            var properties = TestDataBuilder.CreatePropertyList(3);
            var propertyListDtos = properties.Select(p => new PropertyListDto
            {
                Id = p.Id,
                Name = p.Name,
                AddressProperty = p.AddressProperty,
                PriceProperty = p.PriceProperty,
                ImageUrl = p.ImageUrl,
                PropertyType = p.PropertyType.ToString(),
                IsAvailable = p.IsAvailable
            }).ToList();

            var repositoryResult = new PaginatedResultDto<Property>
            {
                Items = properties,
                PageNumber = filter.PageNumber,
                PageSize = filter.PageSize,
                TotalCount = properties.Count
            };

            _mockRepository.SetupGetFilteredAsync(repositoryResult);
            _mockMapper.SetupMapPropertyListToDto(propertyListDtos);

            // Act
            var result = await _service.GetFilteredAsync(filter);

            // Assert
            result.Should().NotBeNull();
            result.Items.Should().HaveCount(3);
            result.PageNumber.Should().Be(filter.PageNumber);
            result.PageSize.Should().Be(filter.PageSize);
            result.TotalCount.Should().Be(3);
            _mockRepository.Verify(x => x.GetFilteredAsync(filter), Times.Once);
        }

        [Test]
        public async Task GetFilteredAsync_InvalidPagination_AdjustsParameters()
        {
            // Arrange
            var filter = new PropertyFilterDto
            {
                PageNumber = 0, // Invalid
                PageSize = 0,   // Invalid
                Name = "Test"
            };

            var properties = TestDataBuilder.CreatePropertyList(1);
            var repositoryResult = new PaginatedResultDto<Property>
            {
                Items = properties,
                PageNumber = 1, // Should be adjusted
                PageSize = 10,  // Should be adjusted
                TotalCount = 1
            };

            _mockRepository.SetupGetFilteredAsync(repositoryResult);
            _mockMapper.SetupMapPropertyListToDto(new List<PropertyListDto>());

            // Act
            var result = await _service.GetFilteredAsync(filter);

            // Assert
            result.Should().NotBeNull();
            _mockRepository.Verify(x => x.GetFilteredAsync(It.Is<PropertyFilterDto>(f => 
                f.PageNumber == 1 && f.PageSize == 10)), Times.Once);
        }

        [Test]
        public async Task GetFilteredAsync_LargePageSize_LimitsToMax()
        {
            // Arrange
            var filter = new PropertyFilterDto
            {
                PageNumber = 1,
                PageSize = 200, // Too large
                Name = "Test"
            };

            var properties = TestDataBuilder.CreatePropertyList(1);
            var repositoryResult = new PaginatedResultDto<Property>
            {
                Items = properties,
                PageNumber = 1,
                PageSize = 100, // Should be limited to 100
                TotalCount = 1
            };

            _mockRepository.SetupGetFilteredAsync(repositoryResult);
            _mockMapper.SetupMapPropertyListToDto(new List<PropertyListDto>());

            // Act
            var result = await _service.GetFilteredAsync(filter);

            // Assert
            result.Should().NotBeNull();
            _mockRepository.Verify(x => x.GetFilteredAsync(It.Is<PropertyFilterDto>(f => 
                f.PageSize == 100)), Times.Once);
        }

        [Test]
        public async Task CreateAsync_ValidProperty_ReturnsCreatedPropertyDto()
        {
            // Arrange
            var propertyDto = TestDataBuilder.CreateValidPropertyDto();
            var property = TestDataBuilder.CreateValidProperty();
            var createdProperty = TestDataBuilder.CreateValidProperty("new-id");
            var createdPropertyDto = TestDataBuilder.CreateValidPropertyDto("new-id");

            _mockMapper.SetupMapDtoToProperty(property);
            _mockRepository.SetupCreateAsync(createdProperty);
            _mockMapper.Setup(x => x.Map<PropertyDto>(createdProperty))
                .Returns(createdPropertyDto);

            // Act
            var result = await _service.CreateAsync(propertyDto);

            // Assert
            result.Should().NotBeNull();
            result.Should().BeEquivalentTo(createdPropertyDto);
            _mockMapper.Verify(x => x.Map<Property>(propertyDto), Times.Once);
            _mockRepository.Verify(x => x.CreateAsync(It.Is<Property>(p => 
                p.CreatedAt != default && p.UpdatedAt != default)), Times.Once);
        }

        [Test]
        public async Task UpdateAsync_ValidId_ReturnsUpdatedPropertyDto()
        {
            // Arrange
            var propertyId = "507f1f77bcf86cd799439011";
            var propertyDto = TestDataBuilder.CreateValidPropertyDto();
            var property = TestDataBuilder.CreateValidProperty(propertyId);
            var updatedProperty = TestDataBuilder.CreateValidProperty(propertyId);
            var updatedPropertyDto = TestDataBuilder.CreateValidPropertyDto(propertyId);

            _mockMapper.SetupMapDtoToProperty(property);
            _mockRepository.SetupUpdateAsync(updatedProperty);
            _mockMapper.Setup(x => x.Map<PropertyDto>(updatedProperty))
                .Returns(updatedPropertyDto);

            // Act
            var result = await _service.UpdateAsync(propertyId, propertyDto);

            // Assert
            result.Should().NotBeNull();
            result.Should().BeEquivalentTo(updatedPropertyDto);
            _mockMapper.Verify(x => x.Map<Property>(propertyDto), Times.Once);
            _mockRepository.Verify(x => x.UpdateAsync(propertyId, It.Is<Property>(p => 
                p.Id == propertyId && p.UpdatedAt != default)), Times.Once);
        }

        [Test]
        public async Task UpdateAsync_InvalidId_ReturnsNull()
        {
            // Arrange
            var propertyId = "invalid-id";
            var propertyDto = TestDataBuilder.CreateValidPropertyDto();

            _mockMapper.SetupMapDtoToProperty(TestDataBuilder.CreateValidProperty());
            _mockRepository.SetupUpdateAsync(null);

            // Act
            var result = await _service.UpdateAsync(propertyId, propertyDto);

            // Assert
            result.Should().BeNull();
            _mockRepository.Verify(x => x.UpdateAsync(propertyId, It.IsAny<Property>()), Times.Once);
        }

        [Test]
        public async Task DeleteAsync_ValidId_ReturnsTrue()
        {
            // Arrange
            var propertyId = "507f1f77bcf86cd799439011";
            _mockRepository.SetupDeleteAsync(true);

            // Act
            var result = await _service.DeleteAsync(propertyId);

            // Assert
            result.Should().BeTrue();
            _mockRepository.Verify(x => x.DeleteAsync(propertyId), Times.Once);
        }

        [Test]
        public async Task DeleteAsync_InvalidId_ReturnsFalse()
        {
            // Arrange
            var propertyId = "invalid-id";
            _mockRepository.SetupDeleteAsync(false);

            // Act
            var result = await _service.DeleteAsync(propertyId);

            // Assert
            result.Should().BeFalse();
            _mockRepository.Verify(x => x.DeleteAsync(propertyId), Times.Once);
        }

        [Test]
        public async Task CreateAsync_RepositoryThrows_ThrowsInvalidOperationException()
        {
            // Arrange
            var propertyDto = TestDataBuilder.CreateValidPropertyDto();
            _mockMapper.SetupMapDtoToProperty(TestDataBuilder.CreateValidProperty());
            _mockRepository.Setup(x => x.CreateAsync(It.IsAny<Property>()))
                .ThrowsAsync(new Exception("Database error"));

            // Act & Assert
            await _service.Invoking(s => s.CreateAsync(propertyDto))
                .Should().ThrowAsync<InvalidOperationException>()
                .WithMessage("Failed to create property");
        }
    }
}
