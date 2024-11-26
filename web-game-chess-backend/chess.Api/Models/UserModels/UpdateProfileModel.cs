
namespace chess.Api.Models.UserModels;

public class UpdateProfileModel {
    public string? Name { get; set; }
    public string? Bio { get; set; }
    public bool ClearImage { get; set; } = false;
    public IFormFile? ImageFile { get; set; }
    public bool ClearBackground { get; set; } = false;
    public IFormFile? BackgroundFile { get; set; }
}
