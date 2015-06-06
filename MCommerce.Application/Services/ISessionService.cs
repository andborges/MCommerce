namespace MCommerce.Application.Services
{
    public interface ISessionService
    {
        void Add(string key, object value);

        void Set(string key, object value);

        object Get(string key);

        void Remove(string key);

        string GetSessionId();
    }
}