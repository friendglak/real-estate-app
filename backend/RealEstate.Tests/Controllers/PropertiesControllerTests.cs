using FluentValidation;
using FluentValidation.Results;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using RealEstate.API.Controllers;
using RealEstate.Application.DTOs;
using RealEstate.Application.Interfaces;
using RealEstate.Tests.TestUtilities;
using FluentAssertions;

namespace RealEstate.Tests.Controllers
{
    [TestFixture]
    public class PropertiesControllerTests
    {
        private Mock<IPropertyService> _mockService;
        private Mock<IValidator<PropertyDto>> _mockValidator;
        private Mock<ILogger<PropertiesController>> _mockLogger;
        private PropertiesController _controller;

        [SetUp]
        public void Setup()
        {
            _mockService = new Mock<IPropertyService>();
            _mockValidator = new Mock<IValidator<PropertyDto>>();
            _mockLogger = new Mock<ILogger<PropertiesController>>();
            _controller = new PropertiesController(_mockService.Object, _mockValidator.Object, _mockLogger.Object);
        }

        [Test]
        public async Task GetById_ValidId_ReturnsOkWithProperty()
        {
            // Arrange
            var propertyId = "507f1f77bcf86cd799439011";
            var propertyDto = TestDataBuilder.CreateValidPropertyDto(propertyId);

            _mockService.Setup(x => x.GetByIdAsync(propertyId))
                .ReturnsAsync(propertyDto);

            // Act
            var result = await _controller.GetById(propertyId);

            // Assert
            result.Should().BeOfType<OkObjectResult>();
            var okResult = result as OkObjectResult;
            okResult!.Value.Should().BeEquivalentTo(propertyDto);
            _mockService.Verify(x => x.GetByIdAsync(propertyId), Times.Once);
        }

        [Test]
        public async Task GetById_EmptyId_ReturnsBadRequest()
        {
            // Arrange
            var propertyId = "";

            // Act
            var result = await _controller.GetById(propertyId);

            // Assert
            result.Should().BeOfType<BadRequestObjectResult>();
            var badRequestResult = result as BadRequestObjectResult;
            badRequestResult!.Value.Should().BeEquivalentTo(new { error = "Invalid property ID" });
            _mockService.Verify(x => x.GetByIdAsync(It.IsAny<string>()), Times.Never);
        }

        [Test]
        public async Task GetById_PropertyNotFound_ReturnsNotFound()
        {
            // Arrange
            var propertyId = "507f1f77bcf86cd799439011";
            _mockService.Setup(x => x.GetByIdAsync(propertyId))
                .ReturnsAsync((PropertyDto?)null);

            // Act
            var result = await _controller.GetById(propertyId);

            // Assert
            result.Should().BeOfType<NotFoundObjectResult>();
            var notFoundResult = result as NotFoundObjectResult;
            notFoundResult!.Value.Should().BeEquivalentTo(new { error = $"Property with ID {propertyId} not found" });
        }

        [Test]
        public async Task GetFiltered_ValidFilter_ReturnsOkWithPaginatedResult()
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

            _mockService.Setup(x => x.GetFilteredAsync(filter))
                .ReturnsAsync(paginatedResult);

            // Act
            var result = await _controller.GetFiltered(filter);

            // Assert
            result.Should().BeOfType<OkObjectResult>();
            var okResult = result as OkObjectResult;
            okResult!.Value.Should().BeEquivalentTo(paginatedResult);
            _mockService.Verify(x => x.GetFilteredAsync(filter), Times.Once);
        }

        [Test]
        public async Task GetFiltered_ServiceThrows_ReturnsInternalServerError()
        {
            // Arrange
            var filter = TestDataBuilder.CreateValidPropertyFilter();
            _mockService.Setup(x => x.GetFilteredAsync(filter))
                .ThrowsAsync(new Exception("Service error"));

            // Act
            var result = await _controller.GetFiltered(filter);

            // Assert
            result.Should().BeOfType<ObjectResult>();
            var objectResult = result as ObjectResult;
            objectResult!.StatusCode.Should().Be(500);
            objectResult.Value.Should().BeEquivalentTo(new { error = "An error occurred while fetching properties" });
        }

        [Test]
        public async Task Create_ValidProperty_ReturnsCreatedAtAction()
        {
            // Arrange
            var propertyDto = TestDataBuilder.CreateValidPropertyDto();
            var createdPropertyDto = TestDataBuilder.CreateValidPropertyDto("new-id");
            var validationResult = new ValidationResult();

            _mockValidator.Setup(x => x.ValidateAsync(propertyDto))
                .ReturnsAsync(validationResult);
            _mockService.Setup(x => x.CreateAsync(propertyDto))
                .ReturnsAsync(createdPropertyDto);

            // Act
            var result = await _controller.Create(propertyDto);

            // Assert
            result.Should().BeOfType<CreatedAtActionResult>();
            var createdAtResult = result as CreatedAtActionResult;
            createdAtResult!.ActionName.Should().Be(nameof(PropertiesController.GetById));
            createdAtResult.RouteValues!["id"].Should().Be(createdPropertyDto.Id);
            createdAtResult.Value.Should().BeEquivalentTo(createdPropertyDto);
            _mockValidator.Verify(x => x.ValidateAsync(propertyDto), Times.Once);
            _mockService.Verify(x => x.CreateAsync(propertyDto), Times.Once);
        }

        [Test]
        public async Task Create_InvalidProperty_ReturnsBadRequest()
        {
            // Arrange
            var propertyDto = TestDataBuilder.CreateInvalidPropertyDto();
            var validationResult = new ValidationResult();
            validationResult.Errors.Add(new ValidationFailure("Name", "Name is required"));
            validationResult.Errors.Add(new ValidationFailure("PriceProperty", "Price must be positive"));

            _mockValidator.Setup(x => x.ValidateAsync(propertyDto))
                .ReturnsAsync(validationResult);

            // Act
            var result = await _controller.Create(propertyDto);

            // Assert
            result.Should().BeOfType<BadRequestObjectResult>();
            var badRequestResult = result as BadRequestObjectResult;
            badRequestResult!.Value.Should().NotBeNull();
            _mockService.Verify(x => x.CreateAsync(It.IsAny<PropertyDto>()), Times.Never);
        }

        [Test]
        public async Task Create_ServiceThrows_ReturnsInternalServerError()
        {
            // Arrange
            var propertyDto = TestDataBuilder.CreateValidPropertyDto();
            var validationResult = new ValidationResult();

            _mockValidator.Setup(x => x.ValidateAsync(propertyDto))
                .ReturnsAsync(validationResult);
            _mockService.Setup(x => x.CreateAsync(propertyDto))
                .ThrowsAsync(new Exception("Service error"));

            // Act
            var result = await _controller.Create(propertyDto);

            // Assert
            result.Should().BeOfType<ObjectResult>();
            var objectResult = result as ObjectResult;
            objectResult!.StatusCode.Should().Be(500);
            objectResult.Value.Should().BeEquivalentTo(new { error = "An error occurred while creating the property" });
        }

        [Test]
        public async Task Update_ValidIdAndProperty_ReturnsOkWithUpdatedProperty()
        {
            // Arrange
            var propertyId = "507f1f77bcf86cd799439011";
            var propertyDto = TestDataBuilder.CreateValidPropertyDto();
            var updatedPropertyDto = TestDataBuilder.CreateValidPropertyDto(propertyId);
            var validationResult = new ValidationResult();

            _mockValidator.Setup(x => x.ValidateAsync(propertyDto))
                .ReturnsAsync(validationResult);
            _mockService.Setup(x => x.UpdateAsync(propertyId, propertyDto))
                .ReturnsAsync(updatedPropertyDto);

            // Act
            var result = await _controller.Update(propertyId, propertyDto);

            // Assert
            result.Should().BeOfType<OkObjectResult>();
            var okResult = result as OkObjectResult;
            okResult!.Value.Should().BeEquivalentTo(updatedPropertyDto);
            _mockService.Verify(x => x.UpdateAsync(propertyId, propertyDto), Times.Once);
        }

        [Test]
        public async Task Update_EmptyId_ReturnsBadRequest()
        {
            // Arrange
            var propertyId = "";
            var propertyDto = TestDataBuilder.CreateValidPropertyDto();

            // Act
            var result = await _controller.Update(propertyId, propertyDto);

            // Assert
            result.Should().BeOfType<BadRequestObjectResult>();
            var badRequestResult = result as BadRequestObjectResult;
            badRequestResult!.Value.Should().BeEquivalentTo(new { error = "Invalid property ID" });
            _mockService.Verify(x => x.UpdateAsync(It.IsAny<string>(), It.IsAny<PropertyDto>()), Times.Never);
        }

        [Test]
        public async Task Update_PropertyNotFound_ReturnsNotFound()
        {
            // Arrange
            var propertyId = "507f1f77bcf86cd799439011";
            var propertyDto = TestDataBuilder.CreateValidPropertyDto();
            var validationResult = new ValidationResult();

            _mockValidator.Setup(x => x.ValidateAsync(propertyDto))
                .ReturnsAsync(validationResult);
            _mockService.Setup(x => x.UpdateAsync(propertyId, propertyDto))
                .ReturnsAsync((PropertyDto?)null);

            // Act
            var result = await _controller.Update(propertyId, propertyDto);

            // Assert
            result.Should().BeOfType<NotFoundObjectResult>();
            var notFoundResult = result as NotFoundObjectResult;
            notFoundResult!.Value.Should().BeEquivalentTo(new { error = $"Property with ID {propertyId} not found" });
        }

        [Test]
        public async Task Delete_ValidId_ReturnsNoContent()
        {
            // Arrange
            var propertyId = "507f1f77bcf86cd799439011";
            _mockService.Setup(x => x.DeleteAsync(propertyId))
                .ReturnsAsync(true);

            // Act
            var result = await _controller.Delete(propertyId);

            // Assert
            result.Should().BeOfType<NoContentResult>();
            _mockService.Verify(x => x.DeleteAsync(propertyId), Times.Once);
        }

        [Test]
        public async Task Delete_EmptyId_ReturnsBadRequest()
        {
            // Arrange
            var propertyId = "";

            // Act
            var result = await _controller.Delete(propertyId);

            // Assert
            result.Should().BeOfType<BadRequestObjectResult>();
            var badRequestResult = result as BadRequestObjectResult;
            badRequestResult!.Value.Should().BeEquivalentTo(new { error = "Invalid property ID" });
            _mockService.Verify(x => x.DeleteAsync(It.IsAny<string>()), Times.Never);
        }

        [Test]
        public async Task Delete_PropertyNotFound_ReturnsNotFound()
        {
            // Arrange
            var propertyId = "507f1f77bcf86cd799439011";
            _mockService.Setup(x => x.DeleteAsync(propertyId))
                .ReturnsAsync(false);

            // Act
            var result = await _controller.Delete(propertyId);

            // Assert
            result.Should().BeOfType<NotFoundObjectResult>();
            var notFoundResult = result as NotFoundObjectResult;
            notFoundResult!.Value.Should().BeEquivalentTo(new { error = $"Property with ID {propertyId} not found" });
        }

        [Test]
        public async Task Delete_ServiceThrows_ReturnsInternalServerError()
        {
            // Arrange
            var propertyId = "507f1f77bcf86cd799439011";
            _mockService.Setup(x => x.DeleteAsync(propertyId))
                .ThrowsAsync(new Exception("Service error"));

            // Act
            var result = await _controller.Delete(propertyId);

            // Assert
            result.Should().BeOfType<ObjectResult>();
            var objectResult = result as ObjectResult;
            objectResult!.StatusCode.Should().Be(500);
            objectResult.Value.Should().BeEquivalentTo(new { error = "An error occurred while deleting the property" });
        }
    }
}
