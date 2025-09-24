using RealEstate.API.Extensions;
using RealEstate.API.Middleware;
using RealEstate.Infrastructure.SeedData;
using Serilog;
using DotNetEnv;

Env.Load();

var builder = WebApplication.CreateBuilder(args);

// Configure application to use environment variables and support Render deployment
builder.Configuration
    .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
    .AddJsonFile($"appsettings.{builder.Environment.EnvironmentName}.json", optional: true, reloadOnChange: true)
    .AddEnvironmentVariables();

// Override MongoDB settings with environment variables if they exist
var mongoConnectionString = Environment.GetEnvironmentVariable("MONGODB_URI")
    ?? builder.Configuration["MongoDbSettings:ConnectionString"];
var mongoDatabaseName = Environment.GetEnvironmentVariable("MONGODB_DATABASE")
    ?? builder.Configuration["MongoDbSettings:DatabaseName"];

if (!string.IsNullOrEmpty(mongoConnectionString))
{
    builder.Configuration["MongoDbSettings:ConnectionString"] = mongoConnectionString;
}
if (!string.IsNullOrEmpty(mongoDatabaseName))
{
    builder.Configuration["MongoDbSettings:DatabaseName"] = mongoDatabaseName;
}

// Configure port for Render deployment
var port = Environment.GetEnvironmentVariable("PORT") ?? "5000";
builder.WebHost.UseUrls($"http://0.0.0.0:{port}");

// Configure Serilog
Log.Logger = new LoggerConfiguration()
    .ReadFrom.Configuration(builder.Configuration)
    .Enrich.FromLogContext()
    .WriteTo.Console()
    .WriteTo.File("logs/realestateapi-.txt", rollingInterval: RollingInterval.Day)
    .CreateLogger();

builder.Host.UseSerilog();

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
    {
        Title = "Real Estate API",
        Version = "v1",
        Description = "API for managing real estate properties",
        Contact = new Microsoft.OpenApi.Models.OpenApiContact
        {
            Name = "Real Estate Company",
            Email = "support@realestate.com"
        }
    });

    // Include XML comments for better documentation
    var xmlFile = $"{System.Reflection.Assembly.GetExecutingAssembly().GetName().Name}.xml";
    var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
    if (File.Exists(xmlPath))
    {
        options.IncludeXmlComments(xmlPath);
    }
});

// Add application services
builder.Services.AddApplicationServices();
builder.Services.AddInfrastructureServices(builder.Configuration);
builder.Services.AddCorsPolicies(builder.Configuration);
builder.Services.AddHealthCheckServices();

// Add Database Seeder only in development
if (builder.Environment.IsDevelopment())
{
    builder.Services.AddHostedService<DatabaseSeeder>();
}

// Add response compression
builder.Services.AddResponseCompression(options =>
{
    options.EnableForHttps = true;
});

var app = builder.Build();

// Log configuration on startup (helpful for debugging deployment issues)
app.Logger.LogInformation("Starting Real Estate API - Environment: {Environment}, Port: {Port}",
    app.Environment.EnvironmentName, port);
app.Logger.LogInformation("MongoDB Configuration - Connection: {Connection}, Database: {Database}",
    mongoConnectionString?.Split('@').LastOrDefault()?.Split('/').FirstOrDefault() ?? "localhost",
    mongoDatabaseName);

// Configure the HTTP request pipeline
app.UseSerilogRequestLogging();

// Error handling middleware should be first
app.UseMiddleware<ErrorHandlingMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Real Estate API V1");
        c.RoutePrefix = string.Empty; // Serve Swagger UI at root
    });
    app.UseCors("Development");
}
else
{
    app.UseCors("Production");
    app.UseHsts();

    // In production, still enable Swagger but on a different route
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Real Estate API V1");
        c.RoutePrefix = "api-docs";
    });
}

// Only use HTTPS redirection if not in container/Render environment
if (!builder.Environment.IsProduction() || Environment.GetEnvironmentVariable("FORCE_HTTPS") == "true")
{
    app.UseHttpsRedirection();
}

app.UseResponseCompression();
app.UseRouting();
app.UseAuthorization();

app.MapControllers();
app.MapHealthChecks("/health");
app.MapHealthChecks("/health/detailed", new Microsoft.AspNetCore.Diagnostics.HealthChecks.HealthCheckOptions
{
    ResponseWriter = async (context, report) =>
    {
        context.Response.ContentType = "application/json";
        var result = System.Text.Json.JsonSerializer.Serialize(new
        {
            status = report.Status.ToString(),
            checks = report.Entries.Select(e => new
            {
                name = e.Key,
                status = e.Value.Status.ToString(),
                description = e.Value.Description,
                duration = e.Value.Duration.ToString()
            }),
            totalDuration = report.TotalDuration.ToString()
        });
        await context.Response.WriteAsync(result);
    }
});

// Add a root endpoint for API information
app.MapGet("/", () => new
{
    service = "Real Estate API",
    version = "1.0.0",
    status = "Running",
    documentation = app.Environment.IsDevelopment() ? "/" : "/api-docs",
    health = "/health",
    timestamp = DateTime.UtcNow
});

try
{
    app.Logger.LogInformation("Real Estate API started successfully");
    await app.RunAsync();
}
catch (Exception ex)
{
    app.Logger.LogError(ex, "Application failed to start");
    throw new InvalidOperationException("Failed to start Real Estate API application", ex);
}
finally
{
    await Log.CloseAndFlushAsync();
}

// Make Program class accessible for integration tests
public partial class Program { }