FROM        mcr.microsoft.com/dotnet/aspnet:6.0

LABEL       org.opencontainers.image.source https://github.com/gfoidl-Tests/Vue_Server_Test

ENV         ASPNETCORE_URLS=https://+443;http://+:80

EXPOSE      443
EXPOSE      80

WORKDIR     /app
COPY        . ./

ENTRYPOINT  ["dotnet", "Server.dll"]
