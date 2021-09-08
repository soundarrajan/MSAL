using System.Data;

namespace Inatech.Shared.Infrastructure.Cqs
{
    public interface ICommand
    {
        string ConnectionString { get; }
    }

    public interface ITransactionalCommand : ICommand
    {
        IDbTransaction Transaction { get; }

    }
}