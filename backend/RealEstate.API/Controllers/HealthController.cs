using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using RealEstate.Infrastructure.Context;

namespace RealEstate.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HealthController : ControllerBase
    {
        private readonly MongoDbContext _context;

        public HealthController(MongoDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        [ProducesResponseType(typeof(object), 200)]
        public IActionResult Get()
        {
            return Ok(new
            {
                status = "Healthy",
                timestamp = DateTime.UtcNow,
                service = "RealEstate.API"
            });
        }

        [HttpGet("detailed")]
        [ProducesResponseType(typeof(object), 200)]
        [ProducesResponseType(typeof(object), 503)]
        public async Task<IActionResult> GetDetailed()
        {
            try
            {
                // Check MongoDB connection
                var count = await _context.Properties.CountDocumentsAsync(FilterDefinition<Domain.Entities.Property>.Empty);

                return Ok(new
                {
                    status = "Healthy",
                    timestamp = DateTime.UtcNow,
                    service = "RealEstate.API",
                    database = new
                    {
                        status = "Connected",
                        propertyCount = count
                    }
                });
            }
            catch (Exception ex)
            {
                return StatusCode(503, new
                {
                    status = "Unhealthy",
                    timestamp = DateTime.UtcNow,
                    service = "RealEstate.API",
                    database = new
                    {
                        status = "Disconnected",
                        error = ex.Message
                    }
                });
            }
        }
    }
}