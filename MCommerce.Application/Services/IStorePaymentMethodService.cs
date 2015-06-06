using MCommerce.Domain;
using MobileItFramework.Gateway.Common.Domain;
using MobileItFramework.Gateway.Payment.Domain;
using System.Collections.Generic;

namespace MCommerce.Application.Services
{
    public interface IStorePaymentMethodService
    {
        StorePaymentMethod StorePaymentMethod(int storeId, PaymentMethodType paymentMethodType, PaymentMethodBrand paymentMethodBrand);

        IEnumerable<StorePaymentMethod> StorePaymentMethods(int storeId);
    }
}