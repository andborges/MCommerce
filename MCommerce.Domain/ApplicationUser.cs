using Microsoft.AspNet.Identity.EntityFramework;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using MobileItFramework.Gateway.Payment.Domain;

namespace MCommerce.Domain
{
    public class ApplicationUser : IdentityUser
    {
        [Required]
        [StringLength(256)]
        public string Name { get; set; }

        [Required]
        [StringLength(256)]
        public string Identity { get; set; }

        public int? StoreId { get; set; }

        public Store Store { get; set; }

        public virtual ICollection<Device> Devices { get; set; }

        public virtual ICollection<Address> Addresses { get; set; }
        
        public virtual ICollection<CustomerPaymentMethod> PaymentMethods { get; set; }
    }
}