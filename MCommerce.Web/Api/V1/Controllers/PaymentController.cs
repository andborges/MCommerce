using MCommerce.Application.Resources;
using MCommerce.Application.Services;
using MCommerce.Domain;
using MCommerce.Web.Api.V1.Models;
using Microsoft.AspNet.Identity;
using MobileItFramework.Gateway.Common.Domain;
using MobileItFramework.Gateway.Payment.Domain;
using MobileItFramework.Gateway.Payment.Services;
using MobileItFramework.Gateway.SecurityInfo.Domain;
using MobileItFramework.Gateway.SecurityInfo.Services;
using MobileItFramework.WebApi.Security;
using Ninject;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Web.Http;

namespace MCommerce.Web.Api.V1.Controllers
{
    public class PaymentController : ApiController
    {
        [Inject]
        public UserManager<ApplicationUser> UserManager { get; set; }

        [Inject]
        public ISessionManagement SessionManagement { get; set; }

        [Inject]
        public ITransactionService TransactionService { get; set; }

        [Inject]
        public IStorePaymentMethodService StorePaymentMethodService { get; set; }

        [Inject]
        public IProductService ProductService { get; set; }

        [HttpGet]
        [Route("Api/V1/Payment/PaymentMethods")]
        [RequireTokenMemorySession]
        public IHttpActionResult PaymentMethods(string sessionId, int storeId)
        {
            if (ModelState.IsValid)
            {
                // Customer
                var username = SessionManagement.Username(sessionId);
                var user = UserManager.FindByName(username);

                // Store
                var storePaymentMethods = StorePaymentMethodService.StorePaymentMethods(storeId);
                var paymentMethods = new List<CheckoutPaymentMethodViewModel>();

                foreach (var storePaymentMethod in storePaymentMethods)
                {
                    var customerPaymentMethod = user.PaymentMethods.FirstOrDefault(p => p.Type == storePaymentMethod.Type && p.Brand == storePaymentMethod.Brand);
                    paymentMethods.Add(new CheckoutPaymentMethodViewModel(storePaymentMethod, customerPaymentMethod));
                }

                return Ok(new JsonViewModel(true, null, paymentMethods));
            }

            return BadRequest(ModelState);
        }

        [HttpGet]
        [Route("Api/V1/Payment")]
        [RequireTokenMemorySession]
        public IHttpActionResult Payment(PaymentViewModel paymentViewModel)
        {
            if (ModelState.IsValid)
            {
                var storePaymentMethod = StorePaymentMethodService.StorePaymentMethod(paymentViewModel.StoreId, paymentViewModel.PaymentMethodType, paymentViewModel.PaymentMethodBrand);

                var user = GetCustomerUser();
                var customerPaymentMethod = user.PaymentMethods.First(p => p.Type == paymentViewModel.PaymentMethodType && p.Brand == paymentViewModel.PaymentMethodBrand);

                IPaymentMethodServiceFactory paymentMethodServiceFactory = new PaymentMethodServiceFactory();
                var paymentMethodService = paymentMethodServiceFactory.GetPaymentMethodService(storePaymentMethod.ServiceType);

                var transaction = paymentMethodService.CreateTransaction();
                transaction.PaymentMethodBrand = storePaymentMethod.Brand;
                transaction.StoreId = paymentViewModel.StoreId;
                transaction.StoreAffiliationInfo = storePaymentMethod.AffiliationInfo;
                transaction.CustomerIdentity = user.Identity;
                transaction.CustomerSecurityInfoId = customerPaymentMethod.SecurityInfoId;
                transaction.Parcels = paymentViewModel.Parcels;
                transaction.Amount = GetPaymentAmount(paymentViewModel);

                var authorizeResult = AuthorizationWorkflow(paymentMethodService, transaction);

                if (authorizeResult.Success)
                {
                    return Ok(new JsonViewModel(true, Messages.PaymentSuccess, null));
                }

                // TODO: Tratar erros de autorização
                return Ok(new JsonViewModel(false, null, null));
            }

            return BadRequest(ModelState);
        }

        private ApplicationUser GetCustomerUser()
        {
            var sessionId = Request.GetQueryNameValuePairs().FirstOrDefault(q => q.Key == "sessionId");
            var username = SessionManagement.Username(sessionId.Value);
            var user = UserManager.FindByName(username);

            return user;
        }

        private int GetPaymentAmount(PaymentViewModel paymentViewModel)
        {
            var amount = 0;
            var products = ProductService.Products(paymentViewModel.Items.Select(i => i.ProductId)).ToList();

            foreach (var item in paymentViewModel.Items)
            {
                var product = products.First(p => p.Id == item.ProductId);
                var price = Convert.ToInt32(product.Price*100);

                amount += item.Quantity*price;
            }

            return amount;
        }

        private PaymentMethodServiceResult AuthorizationWorkflow(IPaymentMethodService paymentMethodService, Transaction transaction)
        {
            var customerSecurityInfo = GetCustomerSecurityInfo(transaction.PaymentMethodType, transaction.CustomerSecurityInfoId);

            // TODO: Salvar order e orderitems

            TransactionService.Create(transaction);

            var transactionHistory = new TransactionHistory(transaction, TransactionHistoryEvent.Authorize);
            TransactionService.CreateHistory(transactionHistory);

            var authorizeResult = paymentMethodService.Authorize(transaction, transactionHistory, customerSecurityInfo);

            TransactionService.Update(transaction);

            return authorizeResult;
        }

        private static Info GetCustomerSecurityInfo(PaymentMethodType paymentMethodType, string customerSecurityInfoId)
        {
            ISecurityInfoServiceFactory securityInfoServiceFactory = new SecurityInfoServiceFactory();

            var securityInfoService = securityInfoServiceFactory.GetSecurityInfoService(paymentMethodType);
            var securityInfo = securityInfoService.Get(customerSecurityInfoId);

            return securityInfo;
        }
    }
}
