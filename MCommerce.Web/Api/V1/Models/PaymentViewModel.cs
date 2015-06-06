using MCommerce.Application;
using MobileItFramework.Gateway.Common.Domain;
using MobileItFramework.Gateway.Payment.Domain;
using MobileItFramework.WebApi.Security;
using System.Collections.Generic;
using System.Web.Http.ModelBinding;

namespace MCommerce.Web.Api.V1.Models
{
    [ModelBinder(typeof(EncryptedJsonModelBinder<PaymentViewModel, AppAesEncryptionInfo>))]
    public class PaymentViewModel
    {
        public int StoreId { get; set; }

        public int Parcels { get; set; }

        public int AddressId { get; set; }

        public PaymentMethodType PaymentMethodType { get; set; }

        public PaymentMethodBrand PaymentMethodBrand { get; set; }

        public IEnumerable<PaymentItemViewModel> Items { get; set; }
    }
}