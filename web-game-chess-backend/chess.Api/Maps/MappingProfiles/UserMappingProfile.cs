﻿
using AutoMapper;
using chess.Api.Models.UserModels;
using chess.Application.Requests.UserRequests.BanUser;
using chess.Application.Requests.UserRequests.LogIn;
using chess.Application.Requests.UserRequests.Register;
using chess.Application.Requests.UserRequests.VerifyEmail;

namespace chess.Api.Maps.MappingProfiles;

public class UserMappingProfile : Profile {
    public UserMappingProfile() {

        CreateMap<RegisterUserModel, RegisterUserRequest>();
        CreateMap<LogInUserModel, LogInUserRequest>();
        CreateMap<VerifyEmailModel, VerifyEmailRequest>();
        CreateMap<BanUserModel, BanUserRequest>();
    }
}
