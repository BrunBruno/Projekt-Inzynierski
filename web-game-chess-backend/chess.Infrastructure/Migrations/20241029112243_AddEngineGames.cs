using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace chess.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddEngineGames : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "EngineGamePlayers",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Color = table.Column<int>(type: "integer", nullable: true),
                    TimeLeft = table.Column<double>(type: "double precision", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    GameId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EngineGamePlayers", x => x.Id);
                    table.ForeignKey(
                        name: "FK_EngineGamePlayers_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "EngineGames",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    FenPosition = table.Column<string>(type: "text", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Turn = table.Column<int>(type: "integer", nullable: false),
                    IWinner = table.Column<bool>(type: "boolean", nullable: true),
                    HasEnded = table.Column<bool>(type: "boolean", nullable: false),
                    PlayerId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EngineGames", x => x.Id);
                    table.ForeignKey(
                        name: "FK_EngineGames_EngineGamePlayers_PlayerId",
                        column: x => x.PlayerId,
                        principalTable: "EngineGamePlayers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "EngineGameMoves",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    DoneMove = table.Column<string>(type: "text", nullable: false),
                    OldCoordinates = table.Column<string>(type: "text", nullable: false),
                    NewCoordinates = table.Column<string>(type: "text", nullable: false),
                    Position = table.Column<string>(type: "text", nullable: false),
                    Turn = table.Column<int>(type: "integer", nullable: false),
                    CapturedPiece = table.Column<string>(type: "text", nullable: true),
                    WhiteTime = table.Column<double>(type: "double precision", nullable: false),
                    BlackTime = table.Column<double>(type: "double precision", nullable: false),
                    DoneAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    GameId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EngineGameMoves", x => x.Id);
                    table.ForeignKey(
                        name: "FK_EngineGameMoves_EngineGames_GameId",
                        column: x => x.GameId,
                        principalTable: "EngineGames",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_EngineGameMoves_GameId",
                table: "EngineGameMoves",
                column: "GameId");

            migrationBuilder.CreateIndex(
                name: "IX_EngineGamePlayers_UserId",
                table: "EngineGamePlayers",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_EngineGames_PlayerId",
                table: "EngineGames",
                column: "PlayerId",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "EngineGameMoves");

            migrationBuilder.DropTable(
                name: "EngineGames");

            migrationBuilder.DropTable(
                name: "EngineGamePlayers");
        }
    }
}
