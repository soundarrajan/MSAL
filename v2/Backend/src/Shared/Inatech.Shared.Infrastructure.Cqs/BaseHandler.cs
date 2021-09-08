using System;

namespace Inatech.Shared.Infrastructure.Cqs
{
    public class BaseHandler
    {
        protected virtual void EnsureRequest<T>(T request) where T : IBaseRequest
        {
            EnsureTenantRequest(request);

            // TODO: Create Common Exceptions in Shared.Exceptions project: TenantException.InvalidId, see also Constants.KnownErrorCodes
            if (request.UserId <= 0)
                throw new ArgumentException($"Invalid request user id: {request.UserId}.");
        }

        protected void EnsureTenantRequest<T>(T request) where T : IBaseRequest
        {
            // TODO: Create Common Exceptions in Shared.Exceptions project: TenantException.InvalidId, see also Constants.KnownErrorCodes
            if (request == null)
                throw new ArgumentNullException(nameof(request));

            if (request.TenantId <= 0)
                throw new ArgumentException($"Invalid request tenant id: {request.TenantId}.");
        }

        protected void EnsureConversionRequest<T>(T request) where T : IBaseConversionRequest
        {
            if (request.UomId <= 0)
                throw new ArgumentException($"Invalid request uom id: {request.UomId}.");

            if (request.CurrencyId <= 0)
                throw new ArgumentException($"Invalid request currency id: {request.CurrencyId}.");
        }
    }
}