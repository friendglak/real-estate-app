using FluentValidation;
using RealEstate.Application.DTOs;

namespace RealEstate.Application.Validators
{
    public class PropertyDtoValidator : AbstractValidator<PropertyDto>
    {
        public PropertyDtoValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("Property name is required")
                .Length(3, 100).WithMessage("Name must be between 3 and 100 characters");

            RuleFor(x => x.AddressProperty)
                .NotEmpty().WithMessage("Address is required")
                .Length(5, 200).WithMessage("Address must be between 5 and 200 characters");

            RuleFor(x => x.PriceProperty)
                .GreaterThan(0).WithMessage("Price must be greater than 0");

            RuleFor(x => x.ImageUrl)
                .NotEmpty().WithMessage("Image URL is required")
                .Must(BeAValidUrl).WithMessage("Invalid URL format");

            RuleFor(x => x.IdOwner)
                .NotEmpty().WithMessage("Owner ID is required");

            RuleFor(x => x.PropertyType)
                .Must(BeAValidPropertyType).WithMessage("Invalid property type");

            When(x => x.Bedrooms.HasValue, () =>
            {
                RuleFor(x => x.Bedrooms)
                    .InclusiveBetween(0, 50).WithMessage("Bedrooms must be between 0 and 50");
            });

            When(x => x.Bathrooms.HasValue, () =>
            {
                RuleFor(x => x.Bathrooms)
                    .InclusiveBetween(0, 20).WithMessage("Bathrooms must be between 0 and 20");
            });

            When(x => x.SquareMeters.HasValue, () =>
            {
                RuleFor(x => x.SquareMeters)
                    .GreaterThan(0).WithMessage("Square meters must be greater than 0");
            });
        }

        private static bool BeAValidUrl(string url)
        {
            return Uri.TryCreate(url, UriKind.Absolute, out var result) &&
                   (result.Scheme == Uri.UriSchemeHttp || result.Scheme == Uri.UriSchemeHttps);
        }

        private static bool BeAValidPropertyType(string propertyType)
        {
            return Enum.TryParse<Domain.Entities.PropertyType>(propertyType, out _);
        }
    }
}