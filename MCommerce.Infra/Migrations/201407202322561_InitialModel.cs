namespace MCommerce.Infra.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class InitialModel : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Address",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        UserId = c.String(nullable: false, maxLength: 128),
                        Name = c.String(nullable: false, maxLength: 100),
                        Street = c.String(nullable: false, maxLength: 256),
                        Number = c.String(nullable: false, maxLength: 100),
                        Complement = c.String(maxLength: 256),
                        Neighboorhood = c.String(nullable: false, maxLength: 256),
                        City = c.String(nullable: false, maxLength: 256),
                        State = c.String(nullable: false, maxLength: 50),
                        Zipcode = c.String(nullable: false, maxLength: 20),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.AspNetUsers", t => t.UserId, cascadeDelete: true)
                .Index(t => new { t.UserId, t.Name }, unique: true, name: "IX_AddressCustomer_UserId_Name");
            
            CreateTable(
                "dbo.AspNetUsers",
                c => new
                    {
                        Id = c.String(nullable: false, maxLength: 128),
                        UserName = c.String(),
                        PasswordHash = c.String(),
                        SecurityStamp = c.String(),
                        Name = c.String(maxLength: 256),
                        Identity = c.String(maxLength: 256),
                        StoreId = c.Int(),
                        Discriminator = c.String(nullable: false, maxLength: 128),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Store", t => t.StoreId)
                .Index(t => t.StoreId);
            
            CreateTable(
                "dbo.AspNetUserClaims",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        ClaimType = c.String(),
                        ClaimValue = c.String(),
                        User_Id = c.String(nullable: false, maxLength: 128),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.AspNetUsers", t => t.User_Id, cascadeDelete: true)
                .Index(t => t.User_Id);
            
            CreateTable(
                "dbo.AspNetUserLogins",
                c => new
                    {
                        UserId = c.String(nullable: false, maxLength: 128),
                        LoginProvider = c.String(nullable: false, maxLength: 128),
                        ProviderKey = c.String(nullable: false, maxLength: 128),
                    })
                .PrimaryKey(t => new { t.UserId, t.LoginProvider, t.ProviderKey })
                .ForeignKey("dbo.AspNetUsers", t => t.UserId, cascadeDelete: true)
                .Index(t => t.UserId);
            
            CreateTable(
                "dbo.AspNetUserRoles",
                c => new
                    {
                        UserId = c.String(nullable: false, maxLength: 128),
                        RoleId = c.String(nullable: false, maxLength: 128),
                    })
                .PrimaryKey(t => new { t.UserId, t.RoleId })
                .ForeignKey("dbo.AspNetRoles", t => t.RoleId, cascadeDelete: true)
                .ForeignKey("dbo.AspNetUsers", t => t.UserId, cascadeDelete: true)
                .Index(t => t.UserId)
                .Index(t => t.RoleId);
            
            CreateTable(
                "dbo.AspNetRoles",
                c => new
                    {
                        Id = c.String(nullable: false, maxLength: 128),
                        Name = c.String(nullable: false),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.Device",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        UserId = c.String(nullable: false, maxLength: 128),
                        Uuid = c.String(nullable: false, maxLength: 100),
                        Platform = c.String(),
                        Name = c.String(nullable: false, maxLength: 100),
                        Enabled = c.Boolean(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.AspNetUsers", t => t.UserId, cascadeDelete: true)
                .Index(t => new { t.UserId, t.Name }, unique: true, name: "IX_Device_UserId_Name")
                .Index(t => new { t.UserId, t.Uuid }, unique: true, name: "IX_Device_UserId_Uuid");
            
            CreateTable(
                "dbo.CustomerPaymentMethod",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        UserId = c.String(nullable: false, maxLength: 128),
                        Type = c.Int(nullable: false),
                        Brand = c.Int(nullable: false),
                        Name = c.String(nullable: false, maxLength: 100),
                        SecurityInfoId = c.String(nullable: false, maxLength: 256),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.AspNetUsers", t => t.UserId, cascadeDelete: true)
                .Index(t => new { t.UserId, t.Name }, unique: true, name: "IX_CustomerPaymentMethod_UserId_Name");
            
            CreateTable(
                "dbo.Store",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        ClientApplicationId = c.Int(nullable: false),
                        Name = c.String(nullable: false, maxLength: 256),
                        Identity = c.String(nullable: false, maxLength: 256),
                        AppCode = c.String(maxLength: 256),
                        AppSecret = c.String(maxLength: 256),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.ClientApplication", t => t.ClientApplicationId, cascadeDelete: true)
                .Index(t => t.ClientApplicationId);
            
            CreateTable(
                "dbo.ClientApplication",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Name = c.String(),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.Product",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        StoreId = c.Int(nullable: false),
                        Code = c.String(nullable: false, maxLength: 100),
                        Sku = c.String(nullable: false, maxLength: 256),
                        Name = c.String(nullable: false, maxLength: 256),
                        Description = c.String(maxLength: 512),
                        Price = c.Decimal(nullable: false, precision: 18, scale: 2),
                        StartDate = c.DateTime(),
                        EndDate = c.DateTime(),
                        Active = c.Boolean(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Store", t => t.StoreId, cascadeDelete: true)
                .Index(t => t.StoreId)
                .Index(t => t.Code, unique: true);
            
            CreateTable(
                "dbo.StorePaymentMethod",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        StoreId = c.Int(nullable: false),
                        Type = c.Int(nullable: false),
                        Brand = c.Int(nullable: false),
                        ServiceType = c.Int(nullable: false),
                        AffiliationInfo = c.String(nullable: false, maxLength: 256),
                        MaxParcels = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Store", t => t.StoreId, cascadeDelete: true)
                .Index(t => new { t.StoreId, t.Type, t.Brand }, unique: true, name: "IX_StorePaymentMethod_StoreId_Type_Brand");
            
            CreateTable(
                "dbo.TransactionHistory",
                c => new
                    {
                        Id = c.Long(nullable: false, identity: true),
                        Event = c.Int(nullable: false),
                        TransactionId = c.Long(nullable: false),
                        Date = c.DateTime(nullable: false),
                        Message = c.String(maxLength: 512),
                        MessageSent = c.String(),
                        MessageReceived = c.String(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Transaction", t => t.TransactionId, cascadeDelete: true)
                .Index(t => t.TransactionId);
            
            CreateTable(
                "dbo.Transaction",
                c => new
                    {
                        Id = c.Long(nullable: false, identity: true),
                        PaymentMethodServiceType = c.Int(nullable: false),
                        PaymentMethodType = c.Int(nullable: false),
                        PaymentMethodBrand = c.Int(),
                        StoreId = c.Int(nullable: false),
                        StoreAffiliationInfo = c.String(nullable: false, maxLength: 256),
                        CustomerIdentity = c.String(nullable: false, maxLength: 256),
                        CustomerSecurityInfoId = c.String(nullable: false, maxLength: 256),
                        Amount = c.Int(nullable: false),
                        Parcels = c.Int(nullable: false),
                        Currency = c.String(nullable: false, maxLength: 3),
                        Country = c.String(nullable: false, maxLength: 3),
                        Status = c.Int(nullable: false),
                        OperatorTransactionIdentifier = c.String(maxLength: 512),
                        ApprovalCode = c.String(maxLength: 512),
                        ApprovalMessage = c.String(maxLength: 1024),
                        ErrorCode = c.String(maxLength: 512),
                        ErrorMessage = c.String(maxLength: 1024),
                        DateCreated = c.DateTime(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Store", t => t.StoreId, cascadeDelete: true)
                .Index(t => t.StoreId);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.TransactionHistory", "TransactionId", "dbo.Transaction");
            DropForeignKey("dbo.Transaction", "StoreId", "dbo.Store");
            DropForeignKey("dbo.StorePaymentMethod", "StoreId", "dbo.Store");
            DropForeignKey("dbo.Product", "StoreId", "dbo.Store");
            DropForeignKey("dbo.AspNetUsers", "StoreId", "dbo.Store");
            DropForeignKey("dbo.Store", "ClientApplicationId", "dbo.ClientApplication");
            DropForeignKey("dbo.CustomerPaymentMethod", "UserId", "dbo.AspNetUsers");
            DropForeignKey("dbo.Device", "UserId", "dbo.AspNetUsers");
            DropForeignKey("dbo.AspNetUserClaims", "User_Id", "dbo.AspNetUsers");
            DropForeignKey("dbo.AspNetUserRoles", "UserId", "dbo.AspNetUsers");
            DropForeignKey("dbo.AspNetUserRoles", "RoleId", "dbo.AspNetRoles");
            DropForeignKey("dbo.AspNetUserLogins", "UserId", "dbo.AspNetUsers");
            DropForeignKey("dbo.Address", "UserId", "dbo.AspNetUsers");
            DropIndex("dbo.Transaction", new[] { "StoreId" });
            DropIndex("dbo.TransactionHistory", new[] { "TransactionId" });
            DropIndex("dbo.StorePaymentMethod", "IX_StorePaymentMethod_StoreId_Type_Brand");
            DropIndex("dbo.Product", new[] { "Code" });
            DropIndex("dbo.Product", new[] { "StoreId" });
            DropIndex("dbo.Store", new[] { "ClientApplicationId" });
            DropIndex("dbo.CustomerPaymentMethod", "IX_CustomerPaymentMethod_UserId_Name");
            DropIndex("dbo.Device", "IX_Device_UserId_Uuid");
            DropIndex("dbo.Device", "IX_Device_UserId_Name");
            DropIndex("dbo.AspNetUserRoles", new[] { "RoleId" });
            DropIndex("dbo.AspNetUserRoles", new[] { "UserId" });
            DropIndex("dbo.AspNetUserLogins", new[] { "UserId" });
            DropIndex("dbo.AspNetUserClaims", new[] { "User_Id" });
            DropIndex("dbo.AspNetUsers", new[] { "StoreId" });
            DropIndex("dbo.Address", "IX_AddressCustomer_UserId_Name");
            DropTable("dbo.Transaction");
            DropTable("dbo.TransactionHistory");
            DropTable("dbo.StorePaymentMethod");
            DropTable("dbo.Product");
            DropTable("dbo.ClientApplication");
            DropTable("dbo.Store");
            DropTable("dbo.CustomerPaymentMethod");
            DropTable("dbo.Device");
            DropTable("dbo.AspNetRoles");
            DropTable("dbo.AspNetUserRoles");
            DropTable("dbo.AspNetUserLogins");
            DropTable("dbo.AspNetUserClaims");
            DropTable("dbo.AspNetUsers");
            DropTable("dbo.Address");
        }
    }
}
