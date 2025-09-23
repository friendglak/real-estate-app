# Real Estate API Backend

A modern, scalable .NET 8 Web API for managing real estate properties with MongoDB as the database. This backend provides a comprehensive REST API for property management with features like filtering, pagination, validation, and comprehensive logging.

## 🏗️ Architecture

This project follows Clean Architecture principles with clear separation of concerns:

- **RealEstate.API** - Web API layer with controllers, middleware, and configuration
- **RealEstate.Core** - Domain layer with entities, DTOs, interfaces, and business logic
- **RealEstate.Infrastructure** - Data access layer with MongoDB implementation
- **RealEstate.Tests** - Comprehensive test suite with unit and integration tests

## 🚀 Features

- **Property Management**: Full CRUD operations for real estate properties
- **Advanced Filtering**: Filter properties by type, price range, bedrooms, bathrooms, and more
- **Pagination**: Efficient data pagination for large datasets
- **Validation**: Comprehensive input validation using FluentValidation
- **Logging**: Structured logging with Serilog
- **Health Checks**: Built-in health monitoring endpoints
- **API Documentation**: Interactive Swagger/OpenAPI documentation
- **CORS Support**: Configurable CORS policies for frontend integration
- **Error Handling**: Global error handling middleware
- **Database Seeding**: Automatic sample data seeding in development

## 🛠️ Technology Stack

- **.NET 8** - Latest LTS version
- **ASP.NET Core Web API** - RESTful API framework
- **MongoDB** - NoSQL database with MongoDB.Driver
- **AutoMapper** - Object-to-object mapping
- **FluentValidation** - Input validation
- **Serilog** - Structured logging
- **Swagger/OpenAPI** - API documentation
- **xUnit** - Unit testing framework
- **Moq** - Mocking framework for tests

## 📋 Prerequisites

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [MongoDB](https://www.mongodb.com/try/download/community) (local installation) or MongoDB Atlas account
- [Visual Studio 2022](https://visualstudio.microsoft.com/) or [VS Code](https://code.visualstudio.com/) (recommended)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd real-estate-app/backend
```

### 2. Install Dependencies

```bash
dotnet restore
```

### 3. Configure MongoDB

#### Option A: Local MongoDB

1. Install MongoDB locally
2. Start MongoDB service
3. The default connection string `mongodb://localhost:27017` should work

#### Option B: MongoDB Atlas (Cloud)

1. Create a MongoDB Atlas account
2. Create a new cluster
3. Get your connection string
4. Update `appsettings.json` or set environment variables

### 4. Configure Environment Variables (Optional)

For production or custom configurations, set these environment variables:

```bash
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017
MONGODB_DATABASE=RealEstateDB

# Server Configuration
PORT=5000
ASPNETCORE_ENVIRONMENT=Development
```

### 5. Run the Application

```bash
dotnet run --project RealEstate.API
```

The API will be available at:

- **API Base URL**: `http://localhost:5000`
- **Swagger Documentation**: `http://localhost:5000` (Development) or `http://localhost:5000/api-docs` (Production)
- **Health Check**: `http://localhost:5000/health`

## 📚 API Documentation

### Base Endpoints

| Method | Endpoint           | Description                             |
| ------ | ------------------ | --------------------------------------- |
| GET    | `/`                | API information and status              |
| GET    | `/health`          | Basic health check                      |
| GET    | `/health/detailed` | Detailed health check with dependencies |

### Properties Endpoints

| Method | Endpoint               | Description                           |
| ------ | ---------------------- | ------------------------------------- |
| GET    | `/api/properties`      | Get filtered and paginated properties |
| GET    | `/api/properties/{id}` | Get property by ID                    |
| POST   | `/api/properties`      | Create new property                   |
| PUT    | `/api/properties/{id}` | Update existing property              |
| DELETE | `/api/properties/{id}` | Delete property                       |

### Query Parameters for GET /api/properties

| Parameter      | Type    | Description                  | Example               |
| -------------- | ------- | ---------------------------- | --------------------- |
| `page`         | int     | Page number (default: 1)     | `?page=2`             |
| `pageSize`     | int     | Items per page (default: 10) | `?pageSize=20`        |
| `propertyType` | string  | Filter by property type      | `?propertyType=House` |
| `minPrice`     | decimal | Minimum price filter         | `?minPrice=100000`    |
| `maxPrice`     | decimal | Maximum price filter         | `?maxPrice=500000`    |
| `bedrooms`     | int     | Number of bedrooms           | `?bedrooms=3`         |
| `bathrooms`    | int     | Number of bathrooms          | `?bathrooms=2`        |
| `isAvailable`  | bool    | Availability filter          | `?isAvailable=true`   |

### Property Types

- `House`
- `Apartment`
- `Condo`
- `Townhouse`
- `Land`
- `Commercial`

## 📝 Example API Usage

### Create a Property

```bash
curl -X POST "http://localhost:5000/api/properties" \
  -H "Content-Type: application/json" \
  -d '{
    "idOwner": "507f1f77bcf86cd799439011",
    "name": "Beautiful Family Home",
    "addressProperty": "123 Main St, City, State 12345",
    "priceProperty": 350000,
    "imageUrl": "https://example.com/image.jpg",
    "description": "A beautiful family home with modern amenities",
    "bedrooms": 4,
    "bathrooms": 3,
    "squareMeters": 200,
    "propertyType": "House",
    "isAvailable": true
  }'
```

### Get Properties with Filtering

```bash
curl "http://localhost:5000/api/properties?propertyType=House&minPrice=200000&maxPrice=500000&bedrooms=3&page=1&pageSize=10"
```

### Get Property by ID

```bash
curl "http://localhost:5000/api/properties/507f1f77bcf86cd799439011"
```

## 🧪 Testing

### Run All Tests

```bash
dotnet test
```

### Run Tests with Coverage

```bash
dotnet test --collect:"XPlat Code Coverage"
```

### Test Categories

- **Unit Tests**: Test individual components in isolation
- **Integration Tests**: Test API endpoints with real database
- **Controller Tests**: Test API controllers with mocked dependencies

## 🏗️ Project Structure

```bash
backend/
├── RealEstate.API/                 # Web API layer
│   ├── Controllers/               # API controllers
│   ├── Middleware/               # Custom middleware
│   ├── Extensions/               # Service configuration
│   └── Program.cs                # Application entry point
├── RealEstate.Core/              # Domain layer
│   ├── Entities/                 # Domain entities
│   ├── DTOs/                     # Data transfer objects
│   ├── Interfaces/               # Service interfaces
│   ├── Services/                 # Business logic
│   ├── Validators/               # Input validation
│   └── Mappings/                 # AutoMapper profiles
├── RealEstate.Infrastructure/    # Data access layer
│   ├── Context/                  # Database context
│   ├── Repositories/             # Data repositories
│   ├── Settings/                 # Configuration settings
│   └── SeedData/                 # Database seeding
├── RealEstate.Tests/             # Test project
│   ├── Controllers/              # Controller tests
│   ├── Services/                 # Service tests
│   ├── Integration/              # Integration tests
│   └── TestUtilities/            # Test helpers
└── RealEstate.sln               # Solution file
```

## 🔧 Configuration

### appsettings.json

```json
{
  "MongoDbSettings": {
    "ConnectionString": "mongodb://localhost:27017",
    "DatabaseName": "RealEstateDB",
    "PropertiesCollectionName": "properties",
    "OwnersCollectionName": "owners"
  },
  "AllowedOrigins": ["http://localhost:3000", "https://localhost:3000"],
  "Serilog": {
    "MinimumLevel": {
      "Default": "Information",
      "Override": {
        "Microsoft": "Warning",
        "System": "Warning"
      }
    }
  }
}
```

### Environment-Specific Settings

- `appsettings.Development.json` - Development configuration
- `appsettings.Production.json` - Production configuration

## 🚀 Deployment

### Docker Deployment

```dockerfile
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["RealEstate.API/RealEstate.API.csproj", "RealEstate.API/"]
COPY ["RealEstate.Core/RealEstate.Core.csproj", "RealEstate.Core/"]
COPY ["RealEstate.Infrastructure/RealEstate.Infrastructure.csproj", "RealEstate.Infrastructure/"]
RUN dotnet restore "RealEstate.API/RealEstate.API.csproj"
COPY . .
WORKDIR "/src/RealEstate.API"
RUN dotnet build "RealEstate.API.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "RealEstate.API.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "RealEstate.API.dll"]
```

### Environment Variables for Production

```bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/
MONGODB_DATABASE=RealEstateDB
ASPNETCORE_ENVIRONMENT=Production
PORT=80
```

## 📊 Monitoring and Logging

### Health Checks

- **Basic Health Check**: `GET /health`
- **Detailed Health Check**: `GET /health/detailed`

### Logging

- **Console Logging**: Structured logging to console
- **File Logging**: Daily rolling log files in `logs/` directory
- **Log Levels**: Configurable per namespace

### Log Files

Logs are stored in the `logs/` directory with daily rotation:

- `realestateapi-YYYY-MM-DD.txt`
