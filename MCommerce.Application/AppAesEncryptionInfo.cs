using MobileItFramework.Encryption;

namespace MCommerce.Application
{
    public class AppAesEncryptionInfo : AesEncryptionInfo
    {
        public override string Password
        {
            get { return "PafM48eqPZnbhFdgR"; }
        }

        public override string Salt
        {
            get { return "MCommerceComponentFramework"; }
        }

        public override int PasswordIterations
        {
            get { return 2; }
        }

        public override string InitialVector
        {
            get { return "ADGyi14x#nfq75mK"; }
        }

        public override int KeySize
        {
            get { return 256; }
        }
    }
}