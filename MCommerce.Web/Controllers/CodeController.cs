using System.Drawing.Imaging;
using System.IO;
using System.Web.Mvc;
using ZXing;
using ZXing.Common;

namespace MCommerce.Web.Controllers
{
    public class CodeController : Controller
    {
        // GET: /Product/
        public FileResult Index(string id)
        {
            var barcodeWriter = new BarcodeWriter
            {
                Format = BarcodeFormat.QR_CODE,
                Options = new EncodingOptions
                {
                    Height = 100,
                    Width = 100,
                    Margin = 0
                }
            };

            using (var bitmap = barcodeWriter.Write(id))
            {

                Stream memoryStream = new MemoryStream();
                bitmap.Save(memoryStream, ImageFormat.Png);

                // very important to reset memory stream to a starting position, otherwise you would get 0 bytes returned
                memoryStream.Position = 0;

                var resultStream = new FileStreamResult(memoryStream, "image/png")
                {
                    FileDownloadName = string.Format("{0}.png", id)
                };

                return resultStream;
            }
        }
    }
}