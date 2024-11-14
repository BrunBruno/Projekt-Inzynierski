
using MediatR;
using Microsoft.AspNetCore.Http;

namespace chess.Application.Requests.UserRequests.UpdateProfile;

/// <summary>
/// Request to set data for current user
/// </summary>
public class UpdateProfileRequest : IRequest {

    /// <summary>
    /// Provide full name
    /// </summary>
    public string? Name { get; set; }

    /// <summary>
    /// Provided profile decryption/biography
    /// </summary>
    public string? Bio { get; set; }

    /// <summary>
    /// Property for force image delete
    /// </summary>
    public bool ClearImage { get; set; } = false;

    /// <summary>
    /// Provided profile picture
    /// </summary>
    public IFormFile? ImageFile { get; set; }

    /// <summary>
    /// Property for force image delete
    /// </summary>
    public bool ClearBackground { get; set; } = false;

    /// <summary>
    /// Provided background picture
    /// </summary>
    public IFormFile? BackgroundFile { get; set; }
}
