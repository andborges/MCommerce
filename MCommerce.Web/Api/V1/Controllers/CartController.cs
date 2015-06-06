using MCommerce.Application.Services;
using MCommerce.Web.Api.V1.Models;
using Ninject;
using System.Web.Http;

namespace MCommerce.Web.Api.V1.Controllers
{
    public class CartController : ApiController
    {
        [Inject]
        public IProductService ProductService { get; set; }

        [HttpGet]
        [Route("Api/V1/Cart/Product/{id}")]
        public IHttpActionResult Product(string id)
        {
            var product = new ProductViewModel(ProductService.Product(id));

            return Ok(new JsonViewModel(true, null, product));
        }
    }
}
