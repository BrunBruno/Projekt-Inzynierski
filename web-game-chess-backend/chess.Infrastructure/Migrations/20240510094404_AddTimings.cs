using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace chess.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddTimings : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "TimingId",
                table: "Players",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<Guid>(
                name: "GameTimingId",
                table: "Games",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "TimingId",
                table: "Games",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateTable(
                name: "GameTimings",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Type = table.Column<int>(type: "integer", nullable: false),
                    Minutes = table.Column<int>(type: "integer", nullable: false),
                    Increment = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GameTimings", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Games_GameTimingId",
                table: "Games",
                column: "GameTimingId");

            migrationBuilder.CreateIndex(
                name: "IX_Games_TimingId",
                table: "Games",
                column: "TimingId");

            migrationBuilder.AddForeignKey(
                name: "FK_Games_GameTimings_GameTimingId",
                table: "Games",
                column: "GameTimingId",
                principalTable: "GameTimings",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Games_GameTimings_TimingId",
                table: "Games",
                column: "TimingId",
                principalTable: "GameTimings",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Games_GameTimings_GameTimingId",
                table: "Games");

            migrationBuilder.DropForeignKey(
                name: "FK_Games_GameTimings_TimingId",
                table: "Games");

            migrationBuilder.DropTable(
                name: "GameTimings");

            migrationBuilder.DropIndex(
                name: "IX_Games_GameTimingId",
                table: "Games");

            migrationBuilder.DropIndex(
                name: "IX_Games_TimingId",
                table: "Games");

            migrationBuilder.DropColumn(
                name: "TimingId",
                table: "Players");

            migrationBuilder.DropColumn(
                name: "GameTimingId",
                table: "Games");

            migrationBuilder.DropColumn(
                name: "TimingId",
                table: "Games");
        }
    }
}
