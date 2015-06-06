using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MCommerce.Domain
{
    public class Device
    {
        public int Id { get; set; }

        [Required]
        [Index("IX_Device_UserId_Uuid", 1, IsUnique = true)]
        [Index("IX_Device_UserId_Name", 1, IsUnique = true)]
        public string UserId { get; set; }

        public ApplicationUser User { get; set; }

        [Required]
        [StringLength(100)]
        [Index("IX_Device_UserId_Uuid", 2, IsUnique = true)]
        public string Uuid { get; set; }

        public string Platform { get; set; }

        [Required]
        [StringLength(100)]
        [Index("IX_Device_UserId_Name", 2, IsUnique = true)]
        public string Name { get; set; }

        public bool Enabled { get; set; }
    }
}
