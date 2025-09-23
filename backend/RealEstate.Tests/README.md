# Real Estate API Tests

This directory contains comprehensive tests for the Real Estate API backend.

## Test Structure

### Unit Tests
- **Services/**: Tests for business logic services (PropertyService)
- **Controllers/**: Tests for API controllers (PropertiesController)
- **TestUtilities/**: Helper classes and test data builders

### Integration Tests
- **Integration/**: End-to-end API tests using WebApplicationFactory

## Running Tests

### Prerequisites
- .NET 8 SDK
- MongoDB running locally (for integration tests)
- Test database: `RealEstateDB_Test`

### Command Line

```bash
# Run all tests
dotnet test

# Run with detailed output
dotnet test --verbosity normal

# Run specific test category
dotnet test --filter "Category=Unit"
dotnet test --filter "Category=Integration"

# Run with coverage
dotnet test --collect:"XPlat Code Coverage"

# Run specific test class
dotnet test --filter "ClassName=PropertyServiceTests"
```

### Visual Studio / VS Code
- Use the Test Explorer to run individual tests or test classes
- Set breakpoints and debug tests
- View test results and coverage

## Test Categories

### Unit Tests
- **PropertyServiceTests**: Tests business logic
- **PropertiesControllerTests**: Tests API endpoints
- **BasicTests**: Framework validation tests

### Integration Tests
- **PropertiesControllerIntegrationTests**: Full API testing with HTTP client

## Test Data

Test data is generated using `TestDataBuilder` class:
- `CreateValidPropertyDto()`: Valid property DTO
- `CreateValidProperty()`: Valid property entity
- `CreateInvalidPropertyDto()`: Invalid property DTO for validation testing
- `CreatePropertyList()`: List of test properties

## Mocking

Tests use Moq for mocking dependencies:
- `IPropertyService`: Business logic service
- `IPropertyRepository`: Data access layer
- `IMapper`: Object mapping
- `ILogger`: Logging

## Configuration

Test configuration is in `appsettings.Test.json`:
- Uses test database: `RealEstateDB_Test`
- Separate collections for test data
- Minimal logging for performance

## Best Practices

1. **Arrange-Act-Assert**: Clear test structure
2. **Descriptive Names**: Test methods describe what they test
3. **Single Responsibility**: Each test verifies one behavior
4. **Mock External Dependencies**: Isolate units under test
5. **Test Data Builders**: Reusable test data creation
6. **FluentAssertions**: Readable assertions

## Coverage

Run tests with coverage to ensure comprehensive testing:
```bash
dotnet test --collect:"XPlat Code Coverage"
```

Coverage reports are generated in `TestResults/` directory.

## Continuous Integration

Tests are designed to run in CI/CD pipelines:
- No external dependencies for unit tests
- Integration tests use test database
- Fast execution with parallel test running
- Clear pass/fail indicators
