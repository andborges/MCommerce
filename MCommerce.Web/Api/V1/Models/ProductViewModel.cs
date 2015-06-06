using MCommerce.Domain;

namespace MCommerce.Web.Api.V1.Models
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
        }

        public int Id { get; set; }

        public int StoreId { get; set; }

        public string StoreName { get; set; }

        public string Code { get; set; }

        public string Sku { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }

        public decimal Price { get; set; }
    }
}
