using MCommerce.Application.Model;
using MCommerce.Application.Resources;
using MCommerce.Application.Services;
using MCommerce.Domain;
using MCommerce.Web.Api.V1.Models;
using Microsoft.AspNet.Identity;
using MobileItFramework.WebApi.Security;
using Ninject;
using System.Linq;
using System.Web.Http;

namespace MCommerce.Web.Api.V1.Controllers
{
    public class CustomerAuthController : ApiController
    {
        [Inject]
        public UserManager<ApplicationUser> UserManager { get; set; }

        [Inject]
        public ISessionManagement SessionManagement { get; set; }

        [Inject]
        public IDeviceService DeviceService { get; set; }

        [HttpGet]
        [Route("Api/V1/CustomerAuth/Login")]
        public IHttpActionResult Login(CustomerLoginViewModel customerLoginViewModel)
        {
            if (ModelState.IsValid)
            {
                var user = UserManager.Find(customerLoginViewModel.Email, customerLoginViewModel.Password);

                if (user == null || user.Roles.All(r => r.Role.Name != "Customer"))
                    return Ok(new JsonViewModel(false, Messages.LoginInvalid, null));

                if (user.Devices.All(d => d.Uuid != customerLoginViewModel.DeviceUuid))
                    return Ok(new JsonViewModel(false, Messages.DeviceInvalid, null));

                if (user.Devices.Any(d => d.Uuid == customerLoginViewModel.DeviceUuid && !d.Enabled))
                    return Ok(new JsonViewModel(false, Messages.DeviceBlocked, null));

                var token = SessionManagement.New(user.UserName, user.Name);

                var model = new
                {
                    Token = token,
                    DeviceName = user.Devices.First(d => d.Uuid == customerLoginViewModel.DeviceUuid).Name,
                    Addresses = user.Addresses.Select(a => new AddressViewModel(a)),
                    PaymentMethods = user.PaymentMethods.Select(p => new CustomerPaymentMethodViewModel(p))
                };

                return Ok(new JsonViewModel(true, null, model));
            }

            return BadRequest(ModelState);
        }

        [HttpGet]
        [Route("Api/V1/CustomerAuth/Register")]
        public IHttpActionResult Register(CustomerRegisterViewModel customerRegisterViewModel)
        {
            if (ModelState.IsValid)
            {
                var existingUser = UserManager.FindByName(customerRegisterViewModel.Email);

                if (existingUser != null)
                {
                    return Ok(new JsonViewModel(false, string.Format(Messages.RegisterAccountError, Messages.UsernameAlreadyExists), null));
                }

                UserManager.UserValidator = new UserValidator<ApplicationUser>(UserManager) { AllowOnlyAlphanumericUserNames = false };

                var user = new ApplicationUser { Name = customerRegisterViewModel.Name, UserName = customerRegisterViewModel.Email, Identity = customerRegisterViewModel.Identity };
                var userCreateResult = UserManager.Create(user, customerRegisterViewModel.Password);

                if (userCreateResult.Succeeded)
                {
                    var addRoleResult = UserManager.AddToRole(user.Id, "Customer");

                    var device = new Device { UserId = user.Id, Name = customerRegisterViewModel.DeviceName, Uuid = customerRegisterViewModel.DeviceUuid, Platform = customerRegisterViewModel.DevicePlatform };
                    var deviceCreateResult = DeviceService.Create(device);

                    if (addRoleResult.Succeeded && deviceCreateResult == DeviceServiceResult.Success)
                    {
                        var token = SessionManagement.New(user.UserName, user.Name);

                        return Ok(new JsonViewModel(true, Messages.RegisterAccountSuccess, token));
                    }
                }
            }

            return BadRequest(ModelState);
        }
    }
}