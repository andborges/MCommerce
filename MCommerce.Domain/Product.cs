using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using MobileItFramework.Gateway.Payment.Domain;

namespace MCommerce.Domain
{
    public class Product
    {
        public int Id { get; set; }

        [Required]
        public int StoreId { get; set; }

        public virtual Store Store { get; set; }

        [Required]
        [StringLength(100)]
        [Index(IsUnique = true)]
        public string Code { get; set; }

        [Required]
        [StringLength(256)]
        public string Sku { get; set; }

        [Required]
        [StringLength(256)]
        public string Name { get; set; }

        [StringLength(512)]
        public string Description { get; set; }

        [Required]
        public decimal Price { get; set; }

        public DateTime? StartDate { get; set; }

        public DateTime? EndDate { get; set; }

        public bool Active { get; set; }
    }
}