using MCommerce.Application;
using MobileItFramework.WebApi.Security;
using System.ComponentModel.DataAnnotations;
using System.Web.Http.ModelBinding;

namespace MCommerce.Web.Api.V1.Models
{
    [ModelBinder(typeof(EncryptedJsonModelBinder<CustomerLoginViewModel, AppAesEncryptionInfo>))]
    public class CustomerLoginViewModel
    {
        [Required]
        public string Email { get; set; }

        [Required]
        public string Password { get; set; }

        [Required]
        public string DeviceUuid { get; set; }
    }
}