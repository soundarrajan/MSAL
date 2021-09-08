namespace Inatech.Shared.Infrastructure.Cqs
{
    public interface IBaseConversionRequest : IBaseRequest
    {
        int UomId { get; set; }
        int CurrencyId { get; set; }
    }

    public abstract class BaseConversionRequest : BaseRequest, IBaseConversionRequest
    {
        public int UomId { get; set; }
        public int CurrencyId { get; set; }
    }
}
