using MCommerce.Application.Model;
using MCommerce.Application.Resources;
using MCommerce.Application.Services;
using MCommerce.Domain;
using MCommerce.Web.Models;
using MobileItFramework.Encryption;
using Ninject;
using System.Linq;
using System.Web.Mvc;

namespace MCommerce.Web.Controllers
{
    [Authorize(Roles = "StoreManager")]
    public class ProductController : BaseController
    {
        [Inject]
        public IProductService ProductService { get; set; }

        // GET: /Product
        public ActionResult Index()
        {
            var products = ProductService.Products(ApplicationUser.StoreId.GetValueOrDefault()).Select(p => new ProductViewModel(p));

            return View(products);
        }

        // GET: /Product/Details
        public ActionResult Details(int id)
        {
            var product = new ProductViewModel(ProductService.Product(id));

            return View(product);
        }

        // GET: /Product/Create
        public ActionResult Create()
        {
            return View(new ProductViewModel());
        }

        // POST: /Product/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create(ProductViewModel productViewModel)
        {
            var storeId = ApplicationUser.StoreId.GetValueOrDefault();

            if (ProductService.Product(storeId, productViewModel.Sku) != null)
            {
                ModelState.AddModelError("Sku", Messages.SkuAlreadyExists);
            }

            if (ModelState.IsValid)
            {
                var product = new Product();
                productViewModel.Fill(product);
                product.StoreId = storeId;
                product.Code = string.Format("{0}_{1}", product.StoreId, product.Sku).Md5Hash();

                var productCreateResult = ProductService.Create(product);

                if (productCreateResult == ProductServiceResult.Success)
                {
                    return RedirectToAction("Index");
                }
            }

            return View(productViewModel);
        }

        // GET: /Product/Edit
        public ActionResult Edit(int id)
        {
            var product = new ProductViewModel(ProductService.Product(id));

            return View(product);
        }

        // POST: /Product/Edit
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit(ProductViewModel productViewModel)
        {
            var storeId = ApplicationUser.StoreId.GetValueOrDefault();
            var productSku = ProductService.Product(storeId, productViewModel.Sku);

            if (productSku != null && productSku.Id != productViewModel.Id)
            {
                ModelState.AddModelError("Sku", Messages.SkuAlreadyExists);
            }

            if (ModelState.IsValid)
            {
                var product = ProductService.Product(productViewModel.Id);
                productViewModel.Fill(product);

                var productUpdateResult = ProductService.Update(product);

                if (productUpdateResult == ProductServiceResult.Success)
                {
                    return RedirectToAction("Index");
                }
            }

            return View(productViewModel);
        }

        // POST: /Product/Delete
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Delete(int id)
        {
            if (ModelState.IsValid)
            {
                var product = ProductService.Product(id);

                var productDeleteResult = ProductService.Delete(product);

                if (productDeleteResult == ProductServiceResult.Success)
                {
                    return RedirectToAction("Index");
                }
            }

            return RedirectToAction("Index");
        }
	}
}