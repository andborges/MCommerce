using MCommerce.Application.Services;
using MCommerce.Domain;
using MCommerce.Infra.Data;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using MobileItFramework.Gateway.Payment.Services;
using MobileItFramework.Gateway.SecurityInfo.Services;
using MobileItFramework.WebApi.Security;
using Ninject;
using Ninject.Web.Common;

namespace MCommerce.Application
{
    public class NinjectKernel
    {
        public static void RegisterServices(IKernel kernel)
        {
            kernel.Bind<IApplicationDbContext>().To<ApplicationDbContext>().InRequestScope();
            kernel.Bind<ISessionService>().To<SessionService>();
            kernel.Bind<ISessionManagement>().To<MemorySessionManagement>();

            kernel.Bind<UserManager<ApplicationUser>>().ToMethod(u => new UserManager<ApplicationUser>(new UserStore<ApplicationUser>(new ApplicationDbContext())));
            kernel.Bind<IStoreService>().To<StoreService>();
            kernel.Bind<IStorePaymentMethodService>().To<StorePaymentMethodService>();
            kernel.Bind<IProductService>().To<ProductService>();
            kernel.Bind<IDeviceService>().To<DeviceService>();
            kernel.Bind<ITransactionService>().To<TransactionService>();
            kernel.Bind<ISecurityInfoServiceFactory>().To<SecurityInfoServiceFactory>();
        }
    }
}
