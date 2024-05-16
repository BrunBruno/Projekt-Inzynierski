using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace chess.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddGameState : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "GameStateId",
                table: "Games",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<int>(
                name: "Round",
                table: "Games",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "GameStates",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    EnPassant = table.Column<string>(type: "text", nullable: true),
                    CanWhiteKingCastle = table.Column<bool>(type: "boolean", nullable: false),
                    CanWhiteShortRookCastle = table.Column<bool>(type: "boolean", nullable: false),
                    CanWhiteLongRookCastle = table.Column<bool>(type: "boolean", nullable: false),
                    CanBlackKingCastle = table.Column<bool>(type: "boolean", nullable: false),
                    CanBlackShortRookCastle = table.Column<bool>(type: "boolean", nullable: false),
                    CanBlackLongRookCastle = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GameStates", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Games_GameStateId",
                table: "Games",
                column: "GameStateId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Games_GameStates_GameStateId",
                table: "Games",
                column: "GameStateId",
                principalTable: "GameStates",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Games_GameStates_GameStateId",
                table: "Games");

            migrationBuilder.DropTable(
                name: "GameStates");

            migrationBuilder.DropIndex(
                name: "IX_Games_GameStateId",
                table: "Games");

            migrationBuilder.DropColumn(
                name: "GameStateId",
                table: "Games");

            migrationBuilder.DropColumn(
                name: "Round",
                table: "Games");
        }
    }
}
