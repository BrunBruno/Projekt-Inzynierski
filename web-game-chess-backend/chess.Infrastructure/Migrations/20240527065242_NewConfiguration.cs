using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace chess.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class NewConfiguration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Games_GameStates_GameStateId",
                table: "Games");

            migrationBuilder.DropIndex(
                name: "IX_Games_GameStateId",
                table: "Games");

            migrationBuilder.DropColumn(
                name: "GameStateId",
                table: "Games");

            migrationBuilder.AddColumn<Guid>(
                name: "GameId",
                table: "GameStates",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AlterColumn<int>(
                name: "EndGameType",
                table: "Games",
                type: "integer",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.CreateIndex(
                name: "IX_GameStates_GameId",
                table: "GameStates",
                column: "GameId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_GameStates_Games_GameId",
                table: "GameStates",
                column: "GameId",
                principalTable: "Games",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_GameStates_Games_GameId",
                table: "GameStates");

            migrationBuilder.DropIndex(
                name: "IX_GameStates_GameId",
                table: "GameStates");

            migrationBuilder.DropColumn(
                name: "GameId",
                table: "GameStates");

            migrationBuilder.AlterColumn<int>(
                name: "EndGameType",
                table: "Games",
                type: "integer",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "GameStateId",
                table: "Games",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

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
    }
}
