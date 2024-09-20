using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace chess.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddRegisterPlayer : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "BlackPlayerReqistered",
                table: "Games",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "WhitePlayerReqistered",
                table: "Games",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BlackPlayerReqistered",
                table: "Games");

            migrationBuilder.DropColumn(
                name: "WhitePlayerReqistered",
                table: "Games");
        }
    }
}
