using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace chess.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class FixGameTimingId : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Games_GameTimings_GameTimingId",
                table: "Games");

            migrationBuilder.DropForeignKey(
                name: "FK_Games_GameTimings_TimingId",
                table: "Games");

            migrationBuilder.DropIndex(
                name: "IX_Games_TimingId",
                table: "Games");

            migrationBuilder.DropColumn(
                name: "TimingId",
                table: "Games");

            migrationBuilder.AlterColumn<Guid>(
                name: "GameTimingId",
                table: "Games",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(Guid),
                oldType: "uuid",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Games_GameTimings_GameTimingId",
                table: "Games",
                column: "GameTimingId",
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

            migrationBuilder.AlterColumn<Guid>(
                name: "GameTimingId",
                table: "Games",
                type: "uuid",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uuid");

            migrationBuilder.AddColumn<Guid>(
                name: "TimingId",
                table: "Games",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

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
    }
}
