namespace RealEstate.Infrastructure.Settings
{
    public class MongoDbSettings
    {
        public string ConnectionString { get; set; } = string.Empty;
        public string DatabaseName { get; set; } = string.Empty;
        public string PropertiesCollectionName { get; set; } = "properties";
        public string OwnersCollectionName { get; set; } = "owners";
    }
}