using API.DTOs;
using API.Entities;
using AutoMapper;

namespace API.RequestHelper;

public class MappingProfiles : Profile
{
    public MappingProfiles()
    {
        CreateMap<CreateProductDto, Product>();
        
        CreateMap<UpdateProductDto, Product>();
    }
}
