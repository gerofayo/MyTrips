# Build stage
FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src

# Copy project file and restore dependencies
COPY MyTrips.Api.csproj .
RUN dotnet restore MyTrips.Api.csproj

# Copy remaining files and build
COPY . .
WORKDIR /src
RUN dotnet publish MyTrips.Api/MyTrips.Api.csproj --no-restore -c Release -o /app/publish

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "MyTrips.Api.dll"]

