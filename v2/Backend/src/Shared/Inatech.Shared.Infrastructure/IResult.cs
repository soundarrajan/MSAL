namespace Inatech.Shared.Infrastructure
{
    public interface IResult
    {
        bool IsSuccess { get; }

        bool IsFailure { get; }
    }
}