using RealEstate.Application.Interfaces;
using RealEstate.Application.Mappings;
using RealEstate.Application.Services;
using RealEstate.Application.Validators;
using RealEstate.Infrastructure.Extensions;
using RealEstate.Infrastructure.Settings;
using FluentValidation;
using Microsoft.Extensions.Diagnostics.HealthChecks;

namespace RealEstate.API.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        // Add AutoMapper
        services.AddAutoMapper(typeof(PropertyMappingProfile));

        // Add FluentValidation
        services.AddValidatorsFromAssemblyContaining<PropertyDtoValidator>();

        // Add Application Services
        services.AddScoped<IPropertyService, PropertyService>();

        return services;
    }

    public static IServiceCollection AddInfrastructureServices(this IServiceCollection services, IConfiguration configuration)
    {
        // Configure MongoDB settings with environment variable override
        services.Configure<MongoDbSettings>(options =>
        {
            options.ConnectionString = Environment.GetEnvironmentVariable("MONGODB_URI")
                ?? configuration["MongoDbSettings:ConnectionString"] ?? string.Empty;
            options.DatabaseName = Environment.GetEnvironmentVariable("MONGODB_DATABASE")
                ?? configuration["MongoDbSettings:DatabaseName"] ?? string.Empty;
            options.PropertiesCollectionName = configuration["MongoDbSettings:PropertiesCollectionName"] ?? "properties";
            options.OwnersCollectionName = configuration["MongoDbSettings:OwnersCollectionName"] ?? "owners";
        });

        services.AddInfrastructure(configuration);
        return services;
    }

    public static IServiceCollection AddCorsPolicies(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddCors(options =>
        {
            options.AddPolicy("Production", policy =>
            {
                var frontendUrl = Environment.GetEnvironmentVariable("FRONTEND_URL");
                if (!string.IsNullOrEmpty(frontendUrl))
                {
                    policy.WithOrigins(frontendUrl.Split(','))
                          .AllowAnyMethod()
                          .AllowAnyHeader()
                          .AllowCredentials();
                }
                else
                {
                    var allowedOrigins = configuration.GetSection("AllowedOrigins").Get<string[]>()
                        ?? ["http://localhost:3000"];
                    policy.WithOrigins(allowedOrigins)
                          .AllowAnyMethod()
                          .AllowAnyHeader()
                          .AllowCredentials();
                }
            });

            options.AddPolicy("Development", policy =>
            {
                policy.WithOrigins("http://localhost:3000", "https://localhost:3000")
                      .AllowAnyMethod()
                      .AllowAnyHeader()
                      .AllowCredentials();
            });
        });

        return services;
    }

    public static IServiceCollection AddHealthCheckServices(this IServiceCollection services)
    {
        services.AddHealthChecks()
            .AddCheck("self", () => HealthCheckResult.Healthy());

        return services;
    }
}
