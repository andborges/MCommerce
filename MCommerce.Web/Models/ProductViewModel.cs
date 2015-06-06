using MCommerce.Application.Resources;
using MCommerce.Domain;
using System;
using System.ComponentModel.DataAnnotations;

namespace MCommerce.Web.Models
{
    public class ProductViewModel
    {
        public ProductViewModel()
        {
        }

        public ProductViewModel(Product product)
        {
            Id = product.Id;
            StoreId = product.Store.Id;
            StoreName = product.Store.Name;
            Code = product.Code;
            Sku = product.Sku;
            Name = product.Name;
            Description = product.Description;
            Price = product.Price;
            StartDate = product.StartDate;
            EndDate = product.EndDate;
            Active = product.Active;
        }

        public void Fill(Product product)
        {
            product.Sku = Sku;
            product.Name = Name;
            product.Description = Description;
            product.Price = Price;
            product.StartDate = StartDate;
            product.EndDate = EndDate;
            product.Active = Active;
        }

        public int Id { get; set; }

        public int StoreId { get; set; }

        public string StoreName { get; set; }

        [Display(ResourceType = typeof(Labels), Name = "QRCode")]
        public string Code { get; set; }

        [Required]
        [StringLength(256)]
        [Display(ResourceType = typeof(Labels), Name = "Sku")]
        public string Sku { get; set; }

        [Required]
        [StringLength(256)]
        [Display(ResourceType = typeof(Labels), Name = "Name")]
        public string Name { get; set; }

        [StringLength(512)]
        [Display(ResourceType = typeof(Labels), Name = "Description")]
        public string Description { get; set; }

        [Display(ResourceType = typeof(Labels), Name = "Price")]
        public decimal Price { get; set; }

        [Display(ResourceType = typeof(Labels), Name = "StartDate")]
        public DateTime? StartDate { get; set; }

        [Display(ResourceType = typeof(Labels), Name = "EndDate")]
        public DateTime? EndDate { get; set; }

        [Display(ResourceType = typeof(Labels), Name = "Active")]
        public bool Active { get; set; }
    }
}
