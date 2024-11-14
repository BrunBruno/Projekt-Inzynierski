using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace chess.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddToUserStats : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Wins",
                table: "UserStats",
                newName: "RapidGamesPlayed");

            migrationBuilder.RenameColumn(
                name: "Loses",
                table: "UserStats",
                newName: "OnlineWins");

            migrationBuilder.RenameColumn(
                name: "Draws",
                table: "UserStats",
                newName: "OnlineLoses");

            migrationBuilder.AddColumn<int>(
                name: "BlitzGamesPlayed",
                table: "UserStats",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "BulletGamesPlayed",
                table: "UserStats",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "ClassicGamesPlayed",
                table: "UserStats",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "DailyGamesPlayed",
                table: "UserStats",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "OfflineDraws",
                table: "UserStats",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "OfflineLoses",
                table: "UserStats",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "OfflineWins",
                table: "UserStats",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "OnlineDraws",
                table: "UserStats",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BlitzGamesPlayed",
                table: "UserStats");

            migrationBuilder.DropColumn(
                name: "BulletGamesPlayed",
                table: "UserStats");

            migrationBuilder.DropColumn(
                name: "ClassicGamesPlayed",
                table: "UserStats");

            migrationBuilder.DropColumn(
                name: "DailyGamesPlayed",
                table: "UserStats");

            migrationBuilder.DropColumn(
                name: "OfflineDraws",
                table: "UserStats");

            migrationBuilder.DropColumn(
                name: "OfflineLoses",
                table: "UserStats");

            migrationBuilder.DropColumn(
                name: "OfflineWins",
                table: "UserStats");

            migrationBuilder.DropColumn(
                name: "OnlineDraws",
                table: "UserStats");

            migrationBuilder.RenameColumn(
                name: "RapidGamesPlayed",
                table: "UserStats",
                newName: "Wins");

            migrationBuilder.RenameColumn(
                name: "OnlineWins",
                table: "UserStats",
                newName: "Loses");

            migrationBuilder.RenameColumn(
                name: "OnlineLoses",
                table: "UserStats",
                newName: "Draws");
        }
    }
}
