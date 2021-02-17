using System.Threading;
using System.Threading.Tasks;
using MediatR;

namespace Server
{
    public interface IQuery<out TResponse> : IRequest<TResponse> { }
    public interface ICommand<out TResponse> : IRequest<TResponse> { }
    //-------------------------------------------------------------------------
    public interface IQueryHandler<in TRequest, TResponse> : IRequestHandler<TRequest, TResponse>
        where TRequest : IQuery<TResponse>
    { }
    //-------------------------------------------------------------------------
    public interface ICommandHandler<in TRequest, TResponse> : IRequestHandler<TRequest, TResponse>
        where TRequest : ICommand<TResponse>
    { }
    //-------------------------------------------------------------------------
    public interface IEventDispatcher
    {
        Task<TResponse> Get<TResponse>(IQuery<TResponse> query, CancellationToken cancellationToken = default);
        Task<TResponse> Send<TResponse>(ICommand<TResponse> command, CancellationToken cancellationToken = default);
        //---------------------------------------------------------------------
        Task Publish<TNotification>(TNotification notification, CancellationToken cancellationToken = default) where TNotification : INotification;
        Task PublishFireAndForget<TNotification>(TNotification notification, CancellationToken cancellationToken = default) where TNotification : INotification;
    }
}
