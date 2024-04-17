
namespace chess.Core.Entities; 

public class PasswordConfiguration {
    public int Id { get; set; }
    public int? MinLength { get; set; }
    public int? MaxLength { get; set; }
    public bool RequireUppercase {  get; set; }
    public bool RequireLowercase { get; set; }
    public bool RequireDigit { get; set; }
    public bool RequireSpecialChar { get; set; }

}
