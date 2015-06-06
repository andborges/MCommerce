using MCommerce.Domain;
using Microsoft.AspNet.Identity.EntityFramework;
using MobileItFramework.Gateway.Payment.Domain;
using System.Data.Entity;

namespace MCommerce.Infra.Data
{
    public interface IApplicationDbContext
    {
        IDbSet<Store> Stores { get; set; }

        IDbSet<StorePaymentMethod> StorePaymentMethods { get; set; }

        IDbSet<Product> Products { get; set; }

        IDbSet<ApplicationUser> Users { get; set; }

        IDbSet<IdentityRole> Roles { get; set; }
        
        IDbSet<Device> Devices { get; set; }

        IDbSet<Address> Addresses { get; set; }

        IDbSet<Transaction> Transactions { get; set; }

        IDbSet<TransactionHistory> TransactionHistories { get; set; }

        int SaveChanges();
    }
}