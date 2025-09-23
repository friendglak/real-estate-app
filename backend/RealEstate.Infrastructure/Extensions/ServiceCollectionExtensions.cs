using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using RealEstate.Application.Interfaces;
using RealEstate.Infrastructure.Context;
using RealEstate.Infrastructure.Repositories;
using RealEstate.Infrastructure.SeedData;
using RealEstate.Infrastructure.Settings;

namespace RealEstate.Infrastructure.Extensions
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddInfrastructure(
            this IServiceCollection services,
            IConfiguration configuration)
        {
            // Register MongoDB settings
            services.Configure<MongoDbSettings>(
                configuration.GetSection(nameof(MongoDbSettings)));

            // Register MongoDB context
            services.AddSingleton<MongoDbContext>();

            // Register repositories
            services.AddScoped<IPropertyRepository, PropertyRepository>();

            // Register hosted services
            services.AddHostedService<DatabaseSeeder>();

            return services;
        }
    }
}