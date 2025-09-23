using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using Moq;
using RealEstate.API;
using RealEstate.Application.DTOs;
using RealEstate.Application.Interfaces;
using RealEstate.Domain.Entities;
using RealEstate.Tests.TestUtilities;
using System.Net;
using System.Text;
using System.Text.Json;
using FluentAssertions;

namespace RealEstate.Tests.Integration
{
    [TestFixture]
    public class PropertiesControllerIntegrationTests
    {
        private WebApplicationFactory<Program> _factory;
        private HttpClient _client;
        private Mock<IPropertyService> _mockPropertyService;

        [SetUp]
        public void Setup()
        {
            _mockPropertyService = new Mock<IPropertyService>();
            
            _factory = new WebApplicationFactory<Program>()
                .WithWebHostBuilder(builder =>
                {
                    builder.ConfigureServices(services =>
                    {
                        // Replace the real service with our mock
                        var descriptor = services.SingleOrDefault(
                            d => d.ServiceType == typeof(IPropertyService));
                        if (descriptor != null)
                        {
                            services.Remove(descriptor);
                        }
                        services.AddScoped<IPropertyService>(_ => _mockPropertyService.Object);
                    });
                });

            _client = _factory.CreateClient();
        }

        [TearDown]
        public void TearDown()
        {
            _client?.Dispose();
            _factory?.Dispose();
        }

        [Test]
        public async Task GetById_ValidId_ReturnsOk()
        {
            // Arrange
            var propertyId = "507f1f77bcf86cd799439011";
            var propertyDto = TestDataBuilder.CreateValidPropertyDto(propertyId);

            _mockPropertyService.Setup(x => x.GetByIdAsync(propertyId))
                .ReturnsAsync(propertyDto);

            // Act
            var response = await _client.GetAsync($"/api/properties/{propertyId}");

            // Assert
            response.StatusCode.Should().Be(HttpStatusCode.OK);
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonSerializer.Deserialize<PropertyDto>(content, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });
            result.Should().BeEquivalentTo(propertyDto);
        }

        [Test]
        public async Task GetById_InvalidId_ReturnsNotFound()
        {
            // Arrange
            var propertyId = "invalid-id";
            _mockPropertyService.Setup(x => x.GetByIdAsync(propertyId))
                .ReturnsAsync((PropertyDto?)null);

            // Act
            var response = await _client.GetAsync($"/api/properties/{propertyId}");

            // Assert
            response.StatusCode.Should().Be(HttpStatusCode.NotFound);
        }

        [Test]
        public async Task GetFiltered_ValidFilter_ReturnsOk()
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

            var paginatedResult = new PaginatedResultDto<PropertyListDto>
            {
                Items = propertyListDtos,
                PageNumber = filter.PageNumber,
                PageSize = filter.PageSize,
                TotalCount = propertyListDtos.Count
            };

            _mockPropertyService.Setup(x => x.GetFilteredAsync(It.IsAny<PropertyFilterDto>()))
                .ReturnsAsync(paginatedResult);

            // Act
            var queryString = $"?name={filter.Name}&minPrice={filter.MinPrice}&maxPrice={filter.MaxPrice}&propertyType={filter.PropertyType}&isAvailable={filter.IsAvailable}&pageNumber={filter.PageNumber}&pageSize={filter.PageSize}";
            var response = await _client.GetAsync($"/api/properties{queryString}");

            // Assert
            response.StatusCode.Should().Be(HttpStatusCode.OK);
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonSerializer.Deserialize<PaginatedResultDto<PropertyListDto>>(content, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });
            result.Should().NotBeNull();
            result!.Items.Should().HaveCount(3);
        }

        [Test]
        public async Task Create_ValidProperty_ReturnsCreated()
        {
            // Arrange
            var propertyDto = TestDataBuilder.CreateValidPropertyDto();
            var createdPropertyDto = TestDataBuilder.CreateValidPropertyDto("new-id");

            _mockPropertyService.Setup(x => x.CreateAsync(It.IsAny<PropertyDto>()))
                .ReturnsAsync(createdPropertyDto);

            var json = JsonSerializer.Serialize(propertyDto);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            // Act
            var response = await _client.PostAsync("/api/properties", content);

            // Assert
            response.StatusCode.Should().Be(HttpStatusCode.Created);
            var responseContent = await response.Content.ReadAsStringAsync();
            var result = JsonSerializer.Deserialize<PropertyDto>(responseContent, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });
            result.Should().BeEquivalentTo(createdPropertyDto);
        }

        [Test]
        public async Task Create_InvalidProperty_ReturnsBadRequest()
        {
            // Arrange
            var propertyDto = TestDataBuilder.CreateInvalidPropertyDto();
            var json = JsonSerializer.Serialize(propertyDto);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            // Act
            var response = await _client.PostAsync("/api/properties", content);

            // Assert
            response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        }

        [Test]
        public async Task Update_ValidIdAndProperty_ReturnsOk()
        {
            // Arrange
            var propertyId = "507f1f77bcf86cd799439011";
            var propertyDto = TestDataBuilder.CreateValidPropertyDto();
            var updatedPropertyDto = TestDataBuilder.CreateValidPropertyDto(propertyId);

            _mockPropertyService.Setup(x => x.UpdateAsync(propertyId, It.IsAny<PropertyDto>()))
                .ReturnsAsync(updatedPropertyDto);

            var json = JsonSerializer.Serialize(propertyDto);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            // Act
            var response = await _client.PutAsync($"/api/properties/{propertyId}", content);

            // Assert
            response.StatusCode.Should().Be(HttpStatusCode.OK);
            var responseContent = await response.Content.ReadAsStringAsync();
            var result = JsonSerializer.Deserialize<PropertyDto>(responseContent, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });
            result.Should().BeEquivalentTo(updatedPropertyDto);
        }

        [Test]
        public async Task Update_PropertyNotFound_ReturnsNotFound()
        {
            // Arrange
            var propertyId = "507f1f77bcf86cd799439011";
            var propertyDto = TestDataBuilder.CreateValidPropertyDto();

            _mockPropertyService.Setup(x => x.UpdateAsync(propertyId, It.IsAny<PropertyDto>()))
                .ReturnsAsync((PropertyDto?)null);

            var json = JsonSerializer.Serialize(propertyDto);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            // Act
            var response = await _client.PutAsync($"/api/properties/{propertyId}", content);

            // Assert
            response.StatusCode.Should().Be(HttpStatusCode.NotFound);
        }

        [Test]
        public async Task Delete_ValidId_ReturnsNoContent()
        {
            // Arrange
            var propertyId = "507f1f77bcf86cd799439011";
            _mockPropertyService.Setup(x => x.DeleteAsync(propertyId))
                .ReturnsAsync(true);

            // Act
            var response = await _client.DeleteAsync($"/api/properties/{propertyId}");

            // Assert
            response.StatusCode.Should().Be(HttpStatusCode.NoContent);
        }

        [Test]
        public async Task Delete_PropertyNotFound_ReturnsNotFound()
        {
            // Arrange
            var propertyId = "507f1f77bcf86cd799439011";
            _mockPropertyService.Setup(x => x.DeleteAsync(propertyId))
                .ReturnsAsync(false);

            // Act
            var response = await _client.DeleteAsync($"/api/properties/{propertyId}");

            // Assert
            response.StatusCode.Should().Be(HttpStatusCode.NotFound);
        }

        [Test]
        public async Task HealthCheck_ReturnsOk()
        {
            // Act
            var response = await _client.GetAsync("/health");

            // Assert
            response.StatusCode.Should().Be(HttpStatusCode.OK);
        }

        [Test]
        public async Task RootEndpoint_ReturnsApiInfo()
        {
            // Act
            var response = await _client.GetAsync("/");

            // Assert
            response.StatusCode.Should().Be(HttpStatusCode.OK);
            var content = await response.Content.ReadAsStringAsync();
            content.Should().Contain("Real Estate API");
        }
    }
}
