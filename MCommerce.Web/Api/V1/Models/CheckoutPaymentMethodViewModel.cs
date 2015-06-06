using MCommerce.Domain;

namespace MCommerce.Web.Api.V1.Models
{
    public class CheckoutPaymentMethodViewModel
    {
        public CheckoutPaymentMethodViewModel(StorePaymentMethod storePaymentMethod, CustomerPaymentMethod customerPaymentMethod)
        {
            Type = (int) storePaymentMethod.Type;
            Brand = (int) storePaymentMethod.Brand;
            MaxParcels = storePaymentMethod.MaxParcels;

            if (customerPaymentMethod != null)
            {
                Name = customerPaymentMethod.Name;
                Enabled = true;
            }
            else
            {
                Enabled = false;
            }
        }

        public int Type { get; set; }

        public int Brand { get; set; }

        public int MaxParcels { get; set; }

        public string Name { get; set; }

        public bool Enabled { get; set; }
    }
}