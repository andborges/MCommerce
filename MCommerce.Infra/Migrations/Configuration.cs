using MCommerce.Domain;
using MCommerce.Infra.Data;
using Microsoft.AspNet.Identity.EntityFramework;
using MobileItFramework.Gateway.Common.Domain;
using MobileItFramework.Gateway.Payment.Domain;
using System;
using System.Data.Entity.Migrations;
using System.Linq;

namespace MCommerce.Infra.Migrations
{
    internal sealed class Configuration : DbMigrationsConfiguration<ApplicationDbContext>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = false;
        }

        protected override void Seed(ApplicationDbContext context)
        {
            context.Set<ClientApplication>().AddOrUpdate(
                m => m.Name,
                new ClientApplication { Name = "MCommerce" }
            );

            context.Set<Store>().AddOrUpdate(
                m => m.Name,
                new Store
                {
                    Name = "Test Store",
                    Identity = "46418647000139",
                    AppCode = "000000000001",
                    AppSecret = "000000000001",
                    ClientApplicationId = context.Set<ClientApplication>().Local.First(u => u.Name == "MCommerce").Id
                }
            );

            context.Set<StorePaymentMethod>().AddOrUpdate(
                r => new { r.StoreId, r.Type, r.Brand },
                new[]
                {
                    new StorePaymentMethod
                    {
                        StoreId = context.Stores.Local.First(u => u.AppCode == "000000000001").Id,
                        Type = PaymentMethodType.CreditCard,
                        Brand = PaymentMethodBrand.Visa,
                        ServiceType = PaymentMethodServiceType.CreditCardMock,
                        AffiliationInfo = "AffiliationCode|AffiliationKey",
                        MaxParcels = 12
                    },
                    new StorePaymentMethod
                    {
                        StoreId = context.Stores.Local.First(u => u.AppCode == "000000000001").Id,
                        Type = PaymentMethodType.CreditCard,
                        Brand = PaymentMethodBrand.Master,
                        ServiceType = PaymentMethodServiceType.CreditCardMock,
                        AffiliationInfo = "AffiliationCode|AffiliationKey",
                        MaxParcels = 8
                    }
                }
            );

            context.Set<Product>().AddOrUpdate(
                r => new { r.StoreId, r.Sku },
                new[]
                {
                    new Product
                    {
                        StoreId = context.Stores.Local.First(u => u.AppCode == "000000000001").Id,
                        Sku = "123456",
                        Name = "Camisa Pólo com o nome bem grande para testar",
                        Description = "Camisa Pólo com o nome bem grande para testar Camisa Pólo com o nome bem grande para testar",
                        Code = "dbb44a586922cfab228c497fdb681bd4",
                        Price = 27.35m,
                        Active = true
                    },
                    new Product
                    {
                        StoreId = context.Stores.Local.First(u => u.AppCode == "000000000001").Id,
                        Sku = "123457",
                        Name = "Calça Jeans com o nome bem grande para testar",
                        Description = "Calça Jeans com o nome bem grande para testar Calça Jeans com o nome bem grande para testar",
                        Code = "dbb44a586922cfab228c497fdb681bd5",
                        Price = 35.85m,
                        Active = true
                    }
                }
            );

            context.Set<IdentityRole>().AddOrUpdate(
                r => r.Name,
                new [] {
                    new IdentityRole { Name = "Administrator" },
                    new IdentityRole { Name = "StoreManager" },
                    new IdentityRole { Name = "Customer" }
                }
            );

            context.Set<ApplicationUser>().AddOrUpdate(
                r => r.UserName,
                new [] {
                    new ApplicationUser
                    {
                        Name = "Administrator",
                        Identity = "admin",
                        UserName = "admin",
                        PasswordHash = "AKFcDNoNPfcsSXe5ADKgQOqhDP/hyLKLc7oT/mcQ1S+98AaHD+l9KGLB8jLWQiN+Iw==",
                        SecurityStamp = "3b6636a8-341e-4952-9bf2-816cc62ba9c0"
                    },
                    new ApplicationUser
                    {
                        Name = "Test Store Manager",
                        Identity = "41873710526",
                        UserName = "store@test.com",
                        PasswordHash = "AIPPcWlKwyekcr3YsecbDQY4MBGIuCA89ALxPcySk0toWqJdWOXjwIF1PBWgQKHw1Q==",
                        SecurityStamp = "8dbd6f60-ca2d-48e6-ac3d-c910e2679028",
                        StoreId = context.Stores.Local.First(u => u.AppCode == "000000000001").Id
                    },
                    new ApplicationUser
                    {
                        Name = "Test Customer",
                        Identity = "25497611460",
                        UserName = "customer@test.com",
                        PasswordHash = "AIPPcWlKwyekcr3YsecbDQY4MBGIuCA89ALxPcySk0toWqJdWOXjwIF1PBWgQKHw1Q==",
                        SecurityStamp = "8dbd6f60-ca2d-48e6-ac3d-c910e2679028"
                    }
                }
            );

            context.Set<IdentityUserRole>().AddOrUpdate(
                r => new { r.UserId, r.RoleId },
                new[] {
                    new IdentityUserRole
                    {
                        UserId = context.Set<ApplicationUser>().Local.First(u => u.UserName == "admin").Id,
                        RoleId = context.Set<IdentityRole>().Local.First(u => u.Name == "Administrator").Id
                    },
                    new IdentityUserRole
                    {
                        UserId = context.Set<ApplicationUser>().Local.First(u => u.UserName == "store@test.com").Id,
                        RoleId = context.Set<IdentityRole>().Local.First(u => u.Name == "StoreManager").Id
                    },
                    new IdentityUserRole
                    {
                        UserId = context.Set<ApplicationUser>().Local.First(u => u.UserName == "customer@test.com").Id,
                        RoleId = context.Set<IdentityRole>().Local.First(u => u.Name == "Customer").Id
                    }
                }
            );

            context.Set<Device>().AddOrUpdate(
                r => r.Uuid,
                new Device
                {
                    UserId = context.Set<ApplicationUser>().Local.First(u => u.UserName == "customer@test.com").Id,
                    Name = "Simulator",
                    Platform = "Android",
                    Uuid = "DC46B660-EF6F-46D4-AC24-85CFAB0C7694",
                    Enabled = true
                }
            );

            context.Set<Address>().AddOrUpdate(
                r => new { r.UserId, r.Name },
                new[]
                {
                    new Address{
                        UserId = context.Set<ApplicationUser>().Local.First(u => u.UserName == "customer@test.com").Id,
                        Name = "Casa",
                        Street = "Rua Nosssa Senhora das Mercês",
                        Number = "104",
                        Complement = "303",
                        Neighboorhood = "Fonseca",
                        City = "Niterói",
                        State = "RJ",
                        Zipcode = "24130050"
                    },
                    new Address{
                        UserId = context.Set<ApplicationUser>().Local.First(u => u.UserName == "customer@test.com").Id,
                        Name = "Trabalho",
                        Street = "Av. Rio Branco",
                        Number = "250",
                        Complement = "1202",
                        Neighboorhood = "Centro",
                        City = "Rio de Janeiro",
                        State = "RJ",
                        Zipcode = "25130180"
                    }
                }
            );

            context.Set<CustomerPaymentMethod>().AddOrUpdate(
                r => new { r.UserId, r.Name },
                new [] {
                    new CustomerPaymentMethod
                    {
                        UserId = context.Set<ApplicationUser>().Local.First(u => u.UserName == "customer@test.com").Id,
                        Name = "Cartão Visa final 0001",
                        Brand = PaymentMethodBrand.Visa,
                        Type = PaymentMethodType.CreditCard,
                        SecurityInfoId = string.Format("{0}|{1}", Guid.NewGuid(), "HolderName=Teste&CardNumber=4000000000000001&ExpirationDate=052016")
                    },
                    new CustomerPaymentMethod
                    {
                        UserId = context.Set<ApplicationUser>().Local.First(u => u.UserName == "customer@test.com").Id,
                        Name = "Cartão Master final 0001",
                        Brand = PaymentMethodBrand.Master,
                        Type = PaymentMethodType.CreditCard,
                        SecurityInfoId = string.Format("{0}|{1}", Guid.NewGuid(), "HolderName=Teste&CardNumber=5000000000000001&ExpirationDate=102018")
                    }
                }
            );
        }
    }
}
