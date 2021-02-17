using System;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Microsoft.Extensions.Logging;

namespace Server
{
    public class MediatRBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
        where TRequest : IRequest<TResponse>
    {
        private readonly ILogger _logger;
        //---------------------------------------------------------------------
        public MediatRBehavior(ILogger<MediatRBehavior<TRequest, TResponse>> logger)
        {
            _logger = logger;
        }
        //---------------------------------------------------------------------
        public async Task<TResponse> Handle(TRequest request, CancellationToken cancellationToken, RequestHandlerDelegate<TResponse> next)
        {
            string requestName = request.GetRequestName();
            _logger.EventStart(requestName);

            try
            {
                TResponse response = await next();
                _logger.EventStop(requestName);

                return response;
            }
            catch (Exception ex) when (Log(ex))
            {
                throw;
            }

            bool Log(Exception ex)
            {
                _logger.EventFailed(requestName, ex);
                return false;
            }
        }
    }
    //-------------------------------------------------------------------------
    internal static class TypeExtensions
    {
        public static string GetRequestName(this IBaseRequest request) => request.GetType().Name;
    }
}
