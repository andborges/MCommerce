using FizzWare.NBuilder;
using MCommerce.Application.Services;
using MCommerce.Domain;
using MCommerce.Web.Api.V1.Controllers;
using MCommerce.Web.Api.V1.Models;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using MobileItFramework.Gateway.Common.Domain;
using MobileItFramework.Gateway.Payment.Domain;
using MobileItFramework.Gateway.Payment.Services;
using Moq;
using System.Collections.Generic;
using System.Web.Http.Results;

namespace MCommerce.Test.UnitTest.Web
{
    [TestClass]
    public class PaymentControllerTests
    {
        private PaymentController _paymentController;

        private Mock<ITransactionService> _transactionServiceMock;

        private Mock<IProductService> _productServiceMock;

        [TestInitialize]
        public void TestInitialize()
        {
            _transactionServiceMock = new Mock<ITransactionService>();
            _transactionServiceMock.Setup(m => m.Create(It.IsAny<Transaction>())).Callback<Transaction>(t => t.Id = int.MaxValue);

            _productServiceMock = new Mock<IProductService>();

            _paymentController = new PaymentController
            {
                TransactionService = _transactionServiceMock.Object,
                ProductService = _productServiceMock.Object
            };
        }

        [TestMethod]
        public void Get_WithTransactionAuthorized_ReturnsOk()
        {
            // Arrange
            _productServiceMock.Setup(m => m.Products(new List<int> { 1, 2, 3 })).Returns(Builder<Product>.CreateListOfSize(3).Build());

            // Act
            var paymentViewModel = new PaymentViewModel
            {
                AddressId = 1,
                PaymentMethodType = PaymentMethodType.CreditCard,
                PaymentMethodBrand = PaymentMethodBrand.Visa,
                Parcels = 12,
                Items = new List<PaymentItemViewModel>
                {
                    new PaymentItemViewModel { ProductId = 1, Quantity = 2 },
                    new PaymentItemViewModel { ProductId = 2, Quantity = 5 },
                    new PaymentItemViewModel { ProductId = 3, Quantity = 10 }
                }
            };

            var result = _paymentController.Payment(paymentViewModel) as OkNegotiatedContentResult<JsonViewModel>;

            // Assert
            Assert.IsNotNull(result);
            Assert.IsTrue(result.Content.Success);

            _transactionServiceMock.Verify(m => m.Create(It.Is<Transaction>(t => t.Amount == 4200 && t.Parcels == 12)), Times.Once);
            _transactionServiceMock.Verify(m => m.Update(It.Is<Transaction>(t => t.Amount == 4200 && t.Parcels == 12)), Times.Once);
            _transactionServiceMock.Verify(m => m.CreateHistory(It.IsAny<IEnumerable<TransactionHistory>>()), Times.Once);
        }
    }
}
