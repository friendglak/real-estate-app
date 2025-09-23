using Microsoft.AspNetCore.Mvc;
using RealEstate.Application.DTOs;
using RealEstate.Application.Interfaces;
using FluentValidation;
using System.Net;

namespace RealEstate.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Produces("application/json")]
    public class PropertiesController : ControllerBase
    {
        private readonly IPropertyService _propertyService;
        private readonly IValidator<PropertyDto> _propertyValidator;
        private readonly ILogger<PropertiesController> _logger;

        public PropertiesController(
            IPropertyService propertyService,
            IValidator<PropertyDto> propertyValidator,
            ILogger<PropertiesController> logger)
        {
            _propertyService = propertyService ?? throw new ArgumentNullException(nameof(propertyService));
            _propertyValidator = propertyValidator ?? throw new ArgumentNullException(nameof(propertyValidator));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        [HttpGet("{id}")]
        [ProducesResponseType(typeof(PropertyDto), (int)HttpStatusCode.OK)]
        [ProducesResponseType((int)HttpStatusCode.NotFound)]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        public async Task<IActionResult> GetById(string id)
        {
            if (string.IsNullOrWhiteSpace(id))
            {
                return BadRequest(new { error = "Invalid property ID" });
            }

            var property = await _propertyService.GetByIdAsync(id);

            if (property == null)
            {
                return NotFound(new { error = $"Property with ID {id} not found" });
            }

            return Ok(property);
        }

        [HttpGet]
        [ProducesResponseType(typeof(PaginatedResultDto<PropertyListDto>), (int)HttpStatusCode.OK)]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        public async Task<IActionResult> GetFiltered([FromQuery] PropertyFilterDto filter)
        {
            try
            {
                var result = await _propertyService.GetFilteredAsync(filter);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting filtered properties");
                return StatusCode(500, new { error = "An error occurred while fetching properties" });
            }
        }

        [HttpPost]
        [ProducesResponseType(typeof(PropertyDto), (int)HttpStatusCode.Created)]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        public async Task<IActionResult> Create([FromBody] PropertyDto propertyDto)
        {
            var validationResult = await _propertyValidator.ValidateAsync(propertyDto);

            if (!validationResult.IsValid)
            {
                return BadRequest(new
                {
                    errors = validationResult.Errors.Select(e => new
                    {
                        field = e.PropertyName,
                        message = e.ErrorMessage
                    })
                });
            }

            try
            {
                var created = await _propertyService.CreateAsync(propertyDto);
                return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating property");
                return StatusCode(500, new { error = "An error occurred while creating the property" });
            }
        }

        [HttpPut("{id}")]
        [ProducesResponseType(typeof(PropertyDto), (int)HttpStatusCode.OK)]
        [ProducesResponseType((int)HttpStatusCode.NotFound)]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        public async Task<IActionResult> Update(string id, [FromBody] PropertyDto propertyDto)
        {
            if (string.IsNullOrWhiteSpace(id))
            {
                return BadRequest(new { error = "Invalid property ID" });
            }

            var validationResult = await _propertyValidator.ValidateAsync(propertyDto);

            if (!validationResult.IsValid)
            {
                return BadRequest(new
                {
                    errors = validationResult.Errors.Select(e => new
                    {
                        field = e.PropertyName,
                        message = e.ErrorMessage
                    })
                });
            }

            try
            {
                var updated = await _propertyService.UpdateAsync(id, propertyDto);

                if (updated == null)
                {
                    return NotFound(new { error = $"Property with ID {id} not found" });
                }

                return Ok(updated);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating property {PropertyId}", id);
                return StatusCode(500, new { error = "An error occurred while updating the property" });
            }
        }

        [HttpDelete("{id}")]
        [ProducesResponseType((int)HttpStatusCode.NoContent)]
        [ProducesResponseType((int)HttpStatusCode.NotFound)]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        public async Task<IActionResult> Delete(string id)
        {
            if (string.IsNullOrWhiteSpace(id))
            {
                return BadRequest(new { error = "Invalid property ID" });
            }

            try
            {
                var deleted = await _propertyService.DeleteAsync(id);

                if (!deleted)
                {
                    return NotFound(new { error = $"Property with ID {id} not found" });
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting property {PropertyId}", id);
                return StatusCode(500, new { error = "An error occurred while deleting the property" });
            }
        }
    }
}