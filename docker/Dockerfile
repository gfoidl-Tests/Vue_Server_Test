FROM        mcr.microsoft.com/dotnet/aspnet:6.0

ENV         ASPNETCORE_URLS=https://+443;http://+:80

EXPOSE      443
EXPOSE      80

WORKDIR     /app
COPY        . ./

ENTRYPOINT  ["dotnet", "Server.dll"]
