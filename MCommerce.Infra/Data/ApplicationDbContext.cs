using MCommerce.Domain;
using Microsoft.AspNet.Identity.EntityFramework;
using MobileItFramework.Gateway.Payment.Domain;
using System.Data.Entity;
using System.Data.Entity.ModelConfiguration.Conventions;

namespace MCommerce.Infra.Data
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>, IApplicationDbContext
    {
        public ApplicationDbContext() : base("DefaultConnection")
        {
        }

        public IDbSet<Store> Stores { get; set; }

        public IDbSet<StorePaymentMethod> StorePaymentMethods { get; set; }

        public IDbSet<Product> Products { get; set; }

        public IDbSet<Device> Devices { get; set; }

        public IDbSet<Address> Addresses { get; set; }
        
        public IDbSet<Transaction> Transactions { get; set; }
        
        public IDbSet<TransactionHistory> TransactionHistories { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            Database.SetInitializer<ApplicationDbContext>(null);
            modelBuilder.Conventions.Remove<PluralizingTableNameConvention>();
        }
    }
}