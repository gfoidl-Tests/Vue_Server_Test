using System;
using System.Diagnostics;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace Server
{
    public class MediatorDispatcher : IEventDispatcher
    {
        private static readonly bool s_simulateThreadPoolLoad = Environment.GetEnvironmentVariable("SIMULATE_THREADPOOL_LOAD")?.Length > 0;

        private readonly IMediator                   _mediator;
        private readonly IServiceScopeFactory        _serviceScopeFactory;
        private readonly ILogger<MediatorDispatcher> _logger;
        //---------------------------------------------------------------------
        public MediatorDispatcher(IMediator mediator, IServiceScopeFactory serviceScopeFactory, ILogger<MediatorDispatcher> logger)
        {
            _mediator            = mediator;
            _serviceScopeFactory = serviceScopeFactory;
            _logger              = logger;
        }
        //---------------------------------------------------------------------
        public Task<TResponse> Get<TResponse>(IQuery<TResponse> query, CancellationToken cancellationToken = default)
            => _mediator.Send(query, cancellationToken);
        //---------------------------------------------------------------------
        public Task<TResponse> Send<TResponse>(ICommand<TResponse> command, CancellationToken cancellationToken = default)
            => _mediator.Send(command, cancellationToken);
        //---------------------------------------------------------------------
        public async Task Publish<TNotification>(TNotification notification, CancellationToken cancellationToken = default)
            where TNotification : INotification
        {
            try
            {
                await _mediator.Publish(notification, cancellationToken);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ex.Message);
            }
        }
        //---------------------------------------------------------------------
        public Task PublishFireAndForget<TNotification>(TNotification notification, CancellationToken cancellationToken = default)
            where TNotification : INotification
        {
            // Queue work to the ThreadPool that we don't need to (a)wait as we want fire & forget

            FireAndForgetState state = new()
            {
                ServiceScopeFactory = _serviceScopeFactory,
                Notification        = notification,
                CancellationToken   = cancellationToken,
                Logger              = _logger
            };

            ThreadPool.UnsafeQueueUserWorkItem(static async state =>
            {
                if (s_simulateThreadPoolLoad)
                {
                    await Task.Delay(250);
                    state.Logger.LogTrace("PublishFireAndForget: simulated load on thread pool");
                }

                Debug.Assert(state.ServiceScopeFactory is not null);
                Debug.Assert(state.Notification        is not null);
                Debug.Assert(state.Logger              is not null);

                try
                {
                    using IServiceScope serviceScope = state.ServiceScopeFactory.CreateScope();
                    IMediator mediator               = serviceScope.ServiceProvider.GetRequiredService<IMediator>();

                    await mediator.Publish((TNotification)state.Notification, state.CancellationToken);

                    // Besides logging, the trace message is used in unit tests too.
                    // So if removed, etc. tests need to be updated.
                    state.Logger.LogTrace("Fire and forget done");
                }
                catch (Exception ex)
                {
                    state.Logger.LogError(ex, ex.Message);
                }
            }, state, preferLocal: false);

            return Task.CompletedTask;
        }
        //---------------------------------------------------------------------
        private struct FireAndForgetState
        {
            public IServiceScopeFactory? ServiceScopeFactory { get; set; }
            public object? Notification                      { get; set; }
            public CancellationToken CancellationToken       { get; set; }
            public ILogger? Logger                           { get; set; }
        }
    }
}
