using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace chess.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class ChangeMinutesToSeconds : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Minutes",
                table: "GameTimings");

            migrationBuilder.AddColumn<double>(
                name: "Seconds",
                table: "GameTimings",
                type: "double precision",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.UpdateData(
                table: "DataConfigurations",
                keyColumn: "Id",
                keyValue: 1,
                column: "RequireDigit",
                value: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Seconds",
                table: "GameTimings");

            migrationBuilder.AddColumn<int>(
                name: "Minutes",
                table: "GameTimings",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.UpdateData(
                table: "DataConfigurations",
                keyColumn: "Id",
                keyValue: 1,
                column: "RequireDigit",
                value: true);
        }
    }
}
