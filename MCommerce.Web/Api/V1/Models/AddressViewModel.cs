using MCommerce.Domain;
using System.ComponentModel.DataAnnotations;

namespace MCommerce.Web.Api.V1.Models
{
    public class AddressViewModel
    {
        public AddressViewModel(Address address)
        {
            Id = address.Id;
            Name = address.Name;
            Street = address.Street;
            Number = address.Number;
            Complement = address.Complement;
            Neighboorhood = address.Neighboorhood;
            City = address.City;
            State = address.State;
            Zipcode = address.Zipcode;
        }

        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string Name { get; set; }

        [Required]
        [StringLength(256)]
        public string Street { get; set; }

        [Required]
        [StringLength(100)]
        public string Number { get; set; }

        [StringLength(256)]
        public string Complement { get; set; }

        [Required]
        [StringLength(256)]
        public string Neighboorhood { get; set; }

        [Required]
        [StringLength(256)]
        public string City { get; set; }

        [Required]
        [StringLength(50)]
        public string State { get; set; }

        [Required]
        [StringLength(20)]
        public string Zipcode { get; set; }
    }
}