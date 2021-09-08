using System.Data;

namespace Inatech.Shared.Infrastructure.Cqs
{
    public interface ITransactionalQuery : IQuery
    {
        IDbTransaction Transaction { get; }
    }

    public interface IQuery
    {
        string ConnectionString { get; }
    }
}