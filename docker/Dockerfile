FROM        mcr.microsoft.com/dotnet/aspnet:5.0-focal

ENV         ASPNETCORE_URLS=https://+443;http://+:80

EXPOSE      443
EXPOSE      80

WORKDIR     /app
COPY        . ./

ENTRYPOINT  ["dotnet", "Server.dll"]
