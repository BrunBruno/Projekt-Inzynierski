FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build

WORKDIR /app

COPY chess.Api/chess.Api.csproj ./chess.Api/

RUN dotnet restore ./chess.Api/chess.Api.csproj

COPY . ./

RUN dotnet publish ./chess.Api/chess.Api.csproj -c Release -o /app/out

FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS runtime

WORKDIR /app

COPY --from=build /app/out .

EXPOSE 80

ENTRYPOINT ["dotnet", "chess.Api.dll"]
