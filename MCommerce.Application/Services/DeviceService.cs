using MCommerce.Application.Model;
using MCommerce.Domain;
using MCommerce.Infra.Data;
using Ninject;

namespace MCommerce.Application.Services
{
    public class DeviceService : IDeviceService
    {
        [Inject]
        public IApplicationDbContext ApplicationDbContext { get; set; }

        public DeviceServiceResult Create(Device device)
        {
            ApplicationDbContext.Devices.Add(device);
            ApplicationDbContext.SaveChanges();
            
            return DeviceServiceResult.Success;
        }
    }
}