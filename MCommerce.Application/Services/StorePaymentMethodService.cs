using MCommerce.Domain;
using MCommerce.Infra.Data;
using MobileItFramework.Gateway.Common.Domain;
using MobileItFramework.Gateway.Payment.Domain;
using Ninject;
using System.Collections.Generic;
using System.Linq;

namespace MCommerce.Application.Services
{
    public class StorePaymentMethodService : IStorePaymentMethodService
    {
        [Inject]
        public IApplicationDbContext ApplicationDbContext { get; set; }

        public StorePaymentMethod StorePaymentMethod(int storeId, PaymentMethodType paymentMethodType, PaymentMethodBrand paymentMethodBrand)
        {
            return ApplicationDbContext.StorePaymentMethods.FirstOrDefault(p => p.StoreId == storeId && p.Type == paymentMethodType && p.Brand == paymentMethodBrand);
        }

        public IEnumerable<StorePaymentMethod> StorePaymentMethods(int storeId)
        {
            return ApplicationDbContext.StorePaymentMethods.Where(p => p.StoreId == storeId);
        }
    }
}