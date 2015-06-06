using MobileItFramework.Gateway.Common.Domain;
using MobileItFramework.Gateway.Payment.Domain;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MCommerce.Domain
{
    public class CustomerPaymentMethod
    {
        public int Id { get; set; }

        [Required]
        [Index("IX_CustomerPaymentMethod_UserId_Name", 1, IsUnique = true)]
        public string UserId { get; set; }

        public ApplicationUser User { get; set; }

        public PaymentMethodType Type { get; set; }

        public PaymentMethodBrand Brand { get; set; }

        [Required]
        [StringLength(100)]
        [Index("IX_CustomerPaymentMethod_UserId_Name", 2, IsUnique = true)]
        public string Name { get; set; }

        [Required]
        [StringLength(256)]
        public string SecurityInfoId { get; set; }
    }
}