using System;
using System.Diagnostics;
using System.Diagnostics.CodeAnalysis;
using System.Web;

namespace MCommerce.Application.Services
{
    [ExcludeFromCodeCoverage]
    public class SessionService : ISessionService
    {
        public virtual void Add(string key, object value)
        {
            try
            {
                HttpContext.Current.Session.Add(key, value);
            }
            catch (Exception ex)
            {
                Trace.TraceError("SessionService.Add: " + ex.Message);
            }           
        }

        public virtual void Set(string key, object value)
        {
            if (Get(key) == null)
                Add(key, value);
            else
                HttpContext.Current.Session[key] = value;
        }

        public virtual object Get(string key)
        {
            try
            {
                return HttpContext.Current.Session[key];
            }
            catch (Exception ex)
            {
                Trace.TraceError("SessionService.Get: " + ex.Message);
                return null;
            }
        }

        public virtual void Remove(string key)
        {
            try
            {
                HttpContext.Current.Session.Remove(key);
            }
            catch (Exception ex)
            {
                Trace.TraceError("SessionService.Remove: " + ex.Message);
            }         
        }

        public string GetSessionId()
        {
            return HttpContext.Current.Session.SessionID;
        }
    }
}