using System.Diagnostics;
using System.Threading;
using System.Threading.Tasks;
using MediatR;

namespace Server
{
    public class MediatorDispatcher : IEventDispatcher
    {
        private readonly IMediator _mediator;
        //---------------------------------------------------------------------
        public MediatorDispatcher(IMediator? mediator)
        {
            Debug.Assert(mediator != null);

            _mediator = mediator;
        }
        //---------------------------------------------------------------------
        public Task<TResponse> Get<TResponse>(IQuery<TResponse> query, CancellationToken cancellationToken = default)
        {
            return _mediator.Send(query, cancellationToken);
        }
        //---------------------------------------------------------------------
        public Task<TResponse> Send<TResponse>(ICommand<TResponse> command, CancellationToken cancellationToken = default)
        {
            return _mediator.Send(command, cancellationToken);
        }
        //---------------------------------------------------------------------
        public Task Handle(IRequest request, CancellationToken cancellationToken = default)
        {
            return _mediator.Send(request, cancellationToken);
        }
        //---------------------------------------------------------------------
        public Task Publish<TNotification>(TNotification notification, CancellationToken cancellationToken = default)
            where TNotification : INotification
        {
            return _mediator.Publish(notification, cancellationToken);
        }
        //---------------------------------------------------------------------
        public Task PublishFireAndForget<TNotification>(TNotification notification, CancellationToken cancellationToken = default)
            where TNotification : INotification
        {
            _ = _mediator.Publish(notification, cancellationToken);
            return Task.CompletedTask;
        }
    }
}
