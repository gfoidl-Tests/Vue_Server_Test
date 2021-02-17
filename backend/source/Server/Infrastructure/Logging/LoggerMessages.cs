using System;
using Microsoft.Extensions.Logging;

namespace Server
{
    internal static class LoggerMessages
    {
        private const int EventStartEventId = 1001;
        private const int EventStopEventId  = 1002;
        private const int EventFailedId     = 1003;

        private const int LiveHubConnectedEventId             = 2001;
        private const int LiveHubDisconnectedEventId          = 2002;
        private const int LiveHubDisconnectedWithErrorEventId = 2003;
        private const int LiveHubGroupJoinedEventId           = 2004;
        private const int LiveHubGroupLeftEventId             = 2005;
        //---------------------------------------------------------------------
        private static readonly Action<ILogger, string, Exception?> s_eventStart
            = LoggerMessage.Define<string>(
                LogLevel.Trace,
                EventStartEventId,
                "Event {event} starting");

        public static void EventStart(this ILogger logger, string eventName)
            => s_eventStart(logger, eventName, null);
        //---------------------------------------------------------------------
        private static readonly Action<ILogger, string, Exception?> s_eventStop
            = LoggerMessage.Define<string>(
                LogLevel.Trace,
                EventStopEventId,
                "Event {event} finished");

        public static void EventStop(this ILogger logger, string eventName)
            => s_eventStop(logger, eventName, null);
        //---------------------------------------------------------------------
        private static readonly Action<ILogger, string, Exception> s_eventFailed
            = LoggerMessage.Define<string>(
                LogLevel.Error,
                EventFailedId,
                "Event {event} failed");

        public static void EventFailed(this ILogger logger, string eventName, Exception ex)
            => s_eventFailed(logger, eventName, ex);
        //---------------------------------------------------------------------
        private static readonly Action<ILogger, string, Exception?> s_liveHubConnected
            = LoggerMessage.Define<string>(
                LogLevel.Information,
                LiveHubConnectedEventId,
                "Client {client} connected");

        public static void LiveHubConnected(this ILogger logger, string connectionId)
            => s_liveHubConnected(logger, connectionId, null);
        //---------------------------------------------------------------------
        private static readonly Action<ILogger, string, Exception?> s_liveHubDisconnected
            = LoggerMessage.Define<string>(
                LogLevel.Information,
                LiveHubDisconnectedEventId,
                "Client {client} disconnected");

        public static void LiveHubDisconnected(this ILogger logger, string connectionId)
            => s_liveHubDisconnected(logger, connectionId, null);
        //---------------------------------------------------------------------
        private static readonly Action<ILogger, string, Exception> s_liveHubDisconnectedWithError
            = LoggerMessage.Define<string>(
                LogLevel.Error,
                LiveHubDisconnectedWithErrorEventId,
                "Client {client} disconnected with error");

        public static void LiveHubDisconnectedWithError(this ILogger logger, string connectionId, Exception ex)
            => s_liveHubDisconnectedWithError(logger, connectionId, ex);
        //---------------------------------------------------------------------
        private static readonly Action<ILogger, string, string, Exception?> s_liveHubGroupJoined
            = LoggerMessage.Define<string, string>(
                LogLevel.Information,
                LiveHubGroupJoinedEventId,
                "Client {client} joined group {group}");

        public static void LiveHubGroupJoined(this ILogger logger, string connectionId, string groupName)
            => s_liveHubGroupJoined(logger, connectionId, groupName, null);
        //---------------------------------------------------------------------
        private static readonly Action<ILogger, string, string, Exception?> s_liveHubGroupLeft
            = LoggerMessage.Define<string, string>(
                LogLevel.Information,
                LiveHubGroupLeftEventId,
                "Client {client} left group {group}");

        public static void LiveHubGroupLeft(this ILogger logger, string connectionId, string groupName)
            => s_liveHubGroupLeft(logger, connectionId, groupName, null);
    }
}
