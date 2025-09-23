using AutoMapper;
using RealEstate.Domain.Entities;
using RealEstate.Application.DTOs;

namespace RealEstate.Application.Mappings
{
    public class PropertyMappingProfile : Profile
    {
        public PropertyMappingProfile()
        {
            CreateMap<Property, PropertyDto>()
                .ForMember(dest => dest.PropertyType,
                    opt => opt.MapFrom(src => src.PropertyType.ToString()));

            CreateMap<PropertyDto, Property>()
                .ForMember(dest => dest.PropertyType,
                    opt => opt.MapFrom(src => Enum.Parse<PropertyType>(src.PropertyType)));

            CreateMap<Property, PropertyListDto>()
                .ForMember(dest => dest.PropertyType,
                    opt => opt.MapFrom(src => src.PropertyType.ToString()));
        }
    }
}