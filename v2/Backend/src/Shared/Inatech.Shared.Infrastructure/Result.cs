using System;

namespace Inatech.Shared.Infrastructure
{
    public sealed class Result<TSuccess, TFailure> : IResult
    {
        private Result()
        {
        }

        private bool IsSuccessful { get; set; }

        public TSuccess Success { get; private set; }

        public TFailure Failure { get; private set; }

        public bool IsSuccess => IsSuccessful;

        public bool IsFailure => !IsSuccessful;

        public static Result<TSuccess, TFailure> Succeeded(TSuccess success)
        {
            if (success == null) throw new ArgumentNullException(nameof(success));

            return new Result<TSuccess, TFailure>() { IsSuccessful = true, Success = success };
        }

        public static Result<TSuccess, TFailure> Failed(TFailure failure)
        {
            if (failure == null) throw new ArgumentNullException(nameof(failure));

            return new Result<TSuccess, TFailure>() { IsSuccessful = false, Failure = failure };
        }

        public static implicit operator Result<TSuccess, TFailure>(TSuccess result) => Succeeded(result);

        public static implicit operator TSuccess(Result<TSuccess, TFailure> result)
        {
            if (result.IsFailure)
                throw new InvalidOperationException("Cannot cast TFailure to TSuccess");

            return result.Success;
        }
    }

    public interface IFailure
    {
        string Message { get; }
        Exception Exception { get; }
    }
    public interface ISuccess<out T>
    {
        T Value { get; }
    }

}
