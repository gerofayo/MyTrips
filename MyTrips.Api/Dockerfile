ARG DOTNET_VERSION=10.0-preview

FROM mcr.microsoft.com/dotnet/sdk:${DOTNET_VERSION} AS build
WORKDIR /src

COPY MyTrips.Api.csproj .
RUN dotnet restore MyTrips.Api.csproj

COPY . .
RUN dotnet publish MyTrips.Api.csproj -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:${DOTNET_VERSION}
WORKDIR /app

COPY --from=build /app/publish .

ENV ASPNETCORE_URLS=http://0.0.0.0:8080
EXPOSE 8080

ENTRYPOINT ["dotnet", "MyTrips.Api.dll"]