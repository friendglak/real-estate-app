# Usar imagen base de ASP.NET Core runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app

# Usar imagen SDK para build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copiar archivos de proyecto primero para mejor caching
COPY ["RealEstate.API/RealEstate.API.csproj", "RealEstate.API/"]
COPY ["RealEstate.Core/RealEstate.Core.csproj", "RealEstate.Core/"]
COPY ["RealEstate.Infrastructure/RealEstate.Infrastructure.csproj", "RealEstate.Infrastructure/"]

# Restaurar dependencias
RUN dotnet restore "RealEstate.API/RealEstate.API.csproj"

# Copiar el resto del código
COPY . .

# Construir la aplicación
WORKDIR "/src/RealEstate.API"
RUN dotnet build "RealEstate.API.csproj" -c Release -o /app/build

# Publicar la aplicación
FROM build AS publish
RUN dotnet publish "RealEstate.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Imagen final
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .

# Exponer puerto dinámico para Render
EXPOSE $PORT

# Configurar variables de entorno
ENV ASPNETCORE_URLS=http://+:$PORT
ENV ASPNETCORE_ENVIRONMENT=Production

ENTRYPOINT ["dotnet", "RealEstate.API.dll"]