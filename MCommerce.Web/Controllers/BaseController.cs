using MCommerce.Application.Services;
using MCommerce.Domain;
using Ninject;
using System.Web.Mvc;

namespace MCommerce.Web.Controllers
{
    public class BaseController : Controller
    {
        [Inject]
        public ISessionService SessionService { get; set; }

        public ApplicationUser ApplicationUser
        {
            get
            {
                return SessionService.Get("ApplicationUser") as ApplicationUser;
            }
        }
    }
}