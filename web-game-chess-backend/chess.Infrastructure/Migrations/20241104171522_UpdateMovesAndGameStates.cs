using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace chess.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class UpdateMovesAndGameStates : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "HalfMove",
                table: "WebGameStates",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "FenMove",
                table: "WebGameMoves",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "HalfMove",
                table: "EngineGameStates",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "FenMove",
                table: "EngineGameMoves",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "HalfMove",
                table: "WebGameStates");

            migrationBuilder.DropColumn(
                name: "FenMove",
                table: "WebGameMoves");

            migrationBuilder.DropColumn(
                name: "HalfMove",
                table: "EngineGameStates");

            migrationBuilder.DropColumn(
                name: "FenMove",
                table: "EngineGameMoves");
        }
    }
}
