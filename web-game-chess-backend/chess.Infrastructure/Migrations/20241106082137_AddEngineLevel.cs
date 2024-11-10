using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace chess.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddEngineLevel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "IWinner",
                table: "EngineGames",
                newName: "IsWinner");

            migrationBuilder.AddColumn<int>(
                name: "EngineLevel",
                table: "EngineGames",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EngineLevel",
                table: "EngineGames");

            migrationBuilder.RenameColumn(
                name: "IsWinner",
                table: "EngineGames",
                newName: "IWinner");
        }
    }
}
