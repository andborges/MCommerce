using MCommerce.Application.Model;
using MCommerce.Domain;
using MCommerce.Infra.Data;
using Ninject;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;

namespace MCommerce.Application.Services
{
    public class ProductService : IProductService
    {
        [Inject]
        public IApplicationDbContext ApplicationDbContext { get; set; }

        public IEnumerable<Product> Products(int storeId)
        {
            return ApplicationDbContext.Products.Include("Store").Where(p => p.StoreId == storeId);
        }

        public IEnumerable<Product> Products(IEnumerable<int> products)
        {
            return ApplicationDbContext.Products.Include("Store").Where(p => products.Contains(p.Id));
        }

        public Product Product(int id)
        {
            return ApplicationDbContext.Products.FirstOrDefault(p => p.Id == id);
        }

        public Product Product(string code)
        {
            return ApplicationDbContext.Products.FirstOrDefault(p => p.Code == code);
        }

        public Product Product(int storeId, string sku)
        {
            return ApplicationDbContext.Products.Include("Store").FirstOrDefault(p => p.StoreId == storeId && p.Sku == sku);
        }

        public ProductServiceResult Create(Product product)
        {
            ApplicationDbContext.Products.Add(product);
            ApplicationDbContext.SaveChanges();
            
            return ProductServiceResult.Success;
        }

        public ProductServiceResult Update(Product product)
        {
            ApplicationDbContext.SaveChanges();
            
            return ProductServiceResult.Success;
        }

        public ProductServiceResult Delete(Product product)
        {
            ApplicationDbContext.Products.Remove(product);
            ApplicationDbContext.SaveChanges();

            return ProductServiceResult.Success;
        }
    }
}
