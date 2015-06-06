using MCommerce.Application;
using MobileItFramework.WebApi.Security;
using System.ComponentModel.DataAnnotations;
using System.Web.Http.ModelBinding;

namespace MCommerce.Web.Api.V1.Models
{
    [ModelBinder(typeof(EncryptedJsonModelBinder<CustomerRegisterViewModel, AppAesEncryptionInfo>))]
    public class CustomerRegisterViewModel
    {
        [Required]
        public string Name { get; set; }

        [Required]
        public string Email { get; set; }

        [Required]
        public string Identity { get; set; }

        [Required]
        public string Password { get; set; }

        [Required]
        public string DeviceUuid { get; set; }

        [Required]
        public string DevicePlatform { get; set; }

        [Required]
        public string DeviceName { get; set; }
    }
}