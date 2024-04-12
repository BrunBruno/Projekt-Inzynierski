
using AutoMapper;
using chess.Api.Models.UserModels;
using chess.Application.Requests.UserRequests.Register;

namespace chess.Api.MappingProfiles;

public class UserMappingProfile : Profile {
    public UserMappingProfile() {

        CreateMap<RegisterUserModel, RegisterUserRequest>();
    }
}
