# STAGE 1: Build the C# application using the heavy SDK
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build-env
WORKDIR /source

# Copy the backend code into the container
COPY . ./
RUN dotnet restore

# Compile release binaries and drop them into the /app directory
RUN dotnet publish -c Release -o /app

# STAGE 2: Spin up the slim production runtime
FROM mcr.microsoft.com/dotnet/aspnet:10.0
WORKDIR /app

# Copy the compiled binaries from STAGE 1
COPY --from=build-env /app .

# Expose port 5000 internally inside the container environment
EXPOSE 5000

# Run the .NET API
ENTRYPOINT ["dotnet", "backend.dll"] 