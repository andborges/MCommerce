using MobileItFramework.Gateway.Common.Domain;
using MobileItFramework.Gateway.Payment.Domain;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MCommerce.Domain
{
    public class StorePaymentMethod
    {
        public int Id { get; set; }

        [Required]
        [Index("IX_StorePaymentMethod_StoreId_Type_Brand", 1, IsUnique = true)]
        public int StoreId { get; set; }

        public Store Store { get; set; }

        [Required]
        [Index("IX_StorePaymentMethod_StoreId_Type_Brand", 2, IsUnique = true)]
        public PaymentMethodType Type { get; set; }

        [Index("IX_StorePaymentMethod_StoreId_Type_Brand", 3, IsUnique = true)]
        public PaymentMethodBrand Brand { get; set; }

        [Required]
        public PaymentMethodServiceType ServiceType { get; set; }

        [Required]
        [StringLength(256)]
        public string AffiliationInfo { get; set; }

        [Required]
        public int MaxParcels { get; set; }
    }
}