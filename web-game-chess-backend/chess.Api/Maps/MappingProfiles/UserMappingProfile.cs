
using AutoMapper;
using chess.Api.Models.UserModels;
using chess.Application.Requests.UserRequests.CheckIfEmailExists;
using chess.Application.Requests.UserRequests.GetOtherUser;
using chess.Application.Requests.UserRequests.GetRegisterConf;
using chess.Application.Requests.UserRequests.LogInUser;
using chess.Application.Requests.UserRequests.RegenerateCode;
using chess.Application.Requests.UserRequests.RegisterUser;
using chess.Application.Requests.UserRequests.UpdateProfile;
using chess.Application.Requests.UserRequests.VerifyEmail;

namespace chess.Api.Maps.MappingProfiles;

/// <summary>
/// User controller models to requests maps
/// </summary>
public class UserMappingProfile : Profile {
    public UserMappingProfile() {

        CreateMap<RegisterUserModel, RegisterUserRequest>();
        CreateMap<LogInUserModel, LogInUserRequest>();
        CreateMap<VerifyEmailModel, VerifyEmailRequest>();
        CreateMap<GetRegisterConfModel, GetRegisterConfRequest>();
        CreateMap<RegenerateCodeModel, RegenerateCodeRequest>();
        CreateMap<UpdateProfileModel, UpdateProfileRequest>();
        CreateMap<GetByEmailModel, GetByEmailRequest>();
        CreateMap<GetOtherUserModel, GetOtherUserRequest>();
    }
}
