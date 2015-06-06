using MCommerce.Infra.Data;
using MobileItFramework.Gateway.Payment.Domain;
using MobileItFramework.Gateway.Payment.Services;
using Ninject;
using System.Linq;

namespace MCommerce.Application.Services
{
    public class StoreService : IStoreService
    {
        [Inject]
        public IApplicationDbContext ApplicationDbContext { get; set; }

        public Store Store(int id)
        {
            return ApplicationDbContext.Stores.FirstOrDefault(p => p.Id == id);
        }
    }
}