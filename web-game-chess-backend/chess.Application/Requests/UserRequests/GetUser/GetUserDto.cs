﻿
namespace chess.Application.Requests.UserRequests.GetUser; 

public class GetUserDto {
    public string Email { get; set; }
    public string UserName { get; set; }
    public string? ImageUrl { get; set; }
}
