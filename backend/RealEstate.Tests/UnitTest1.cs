namespace RealEstate.Tests;

[TestFixture]
public class BasicTests
{
    [SetUp]
    public void Setup()
    {
    }

    [Test]
    public void BasicTest_ShouldPass()
    {
        // This is a basic test to ensure the test framework is working
        Assert.That(1 + 1, Is.EqualTo(2));
    }

    [Test]
    public void TestEnvironment_ShouldBeConfigured()
    {
        // Verify that the test environment is properly configured
        var testEnvironment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");
        Assert.That(testEnvironment, Is.Not.Null);
    }
}