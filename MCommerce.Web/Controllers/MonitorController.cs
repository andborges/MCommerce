using MobileItFramework.WebApi.Monitoring;
using System.Web.Http;

namespace MCommerce.Web.Controllers
{
    public class MonitorController : ApiController, IMonitorController
    {
        [HttpGet]
        public IHttpActionResult Get()
        {
            var frameworkVersion = System.Reflection.Assembly.GetAssembly(typeof(MonitorInfo)).GetName().Version.ToString();
            var applicationVersion = System.Reflection.Assembly.GetAssembly(typeof(MonitorController)).GetName().Version.ToString();

            return Ok(new MonitorInfo("Mobile It!", "MCommerce", applicationVersion, frameworkVersion, true, null));
        }
    }
}
