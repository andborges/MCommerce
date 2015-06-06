using MCommerce.Application.Model;
using MCommerce.Domain;
using System.Collections.Generic;

namespace MCommerce.Application.Services
{
    public interface IProductService
    {
        IEnumerable<Product> Products(int storeId);

        IEnumerable<Product> Products(IEnumerable<int> products);

        Product Product(int id);

        Product Product(string code);

        Product Product(int storeId, string sku);

        ProductServiceResult Create(Product product);

        ProductServiceResult Update(Product product);

        ProductServiceResult Delete(Product product);
    }
}