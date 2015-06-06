using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MCommerce.Domain
{
    public class Address
    {
        public int Id { get; set; }

        [Required]
        [Index("IX_AddressCustomer_UserId_Name", 1, IsUnique = true)]
        public string UserId { get; set; }

        public ApplicationUser User { get; set; }

        [Required]
        [StringLength(100)]
        [Index("IX_AddressCustomer_UserId_Name", 2, IsUnique = true)]
        public string Name { get; set; }

        [Required]
        [StringLength(256)]
        public string Street { get; set; }

        [Required]
        [StringLength(100)]
        public string Number { get; set; }

        [StringLength(256)]
        public string Complement { get; set; }

        [Required]
        [StringLength(256)]
        public string Neighboorhood { get; set; }

        [Required]
        [StringLength(256)]
        public string City { get; set; }

        [Required]
        [StringLength(50)]
        public string State { get; set; }

        [Required]
        [StringLength(20)]
        public string Zipcode { get; set; }
    }

    public class Order
    {
        
    }

    public class OrderItem
    {
        
    }
}