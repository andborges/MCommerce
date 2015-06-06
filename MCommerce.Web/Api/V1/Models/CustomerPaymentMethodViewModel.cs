using MCommerce.Domain;
using MobileItFramework.Gateway.Common.Domain;
using MobileItFramework.Gateway.Payment.Domain;
using System.ComponentModel.DataAnnotations;

namespace MCommerce.Web.Api.V1.Models
{
    public class CustomerPaymentMethodViewModel
    {
        public CustomerPaymentMethodViewModel(CustomerPaymentMethod customerPaymentMethod)
        {
            Id = customerPaymentMethod.Id;
            Type = customerPaymentMethod.Type;
            Brand = customerPaymentMethod.Brand;
            Name = customerPaymentMethod.Name;
        }

        public int Id { get; set; }

        public PaymentMethodType Type { get; set; }

        public PaymentMethodBrand Brand { get; set; }

        [Required]
        [StringLength(100)]
        public string Name { get; set; }
    }
}