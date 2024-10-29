
using AutoMapper;
using chess.Api.Models.UserModels;
using chess.Application.Requests.UserRequests.GetByEmail;
using chess.Application.Requests.UserRequests.GetRegisterConf;
using chess.Application.Requests.UserRequests.LogInUser;
using chess.Application.Requests.UserRequests.RegenerateCode;
using chess.Application.Requests.UserRequests.RegisterUser;
using chess.Application.Requests.UserRequests.ResetPassword;
using chess.Application.Requests.UserRequests.SendResetPasswordCode;
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
        CreateMap<ResetPasswordModel, ResetPasswordRequest>();
        CreateMap<SendResetPasswordCodeModel, SendResetPasswordCodeRequest>();
    }
}
