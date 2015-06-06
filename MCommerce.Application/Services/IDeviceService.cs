using MCommerce.Application.Model;
using MCommerce.Domain;

namespace MCommerce.Application.Services
{
    public interface IDeviceService
    {
        DeviceServiceResult Create(Device device);
    }
}