using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace chess.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class FixPasswordConfiguration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_RegisterConfigurations",
                table: "RegisterConfigurations");

            migrationBuilder.RenameTable(
                name: "RegisterConfigurations",
                newName: "PasswordConfigurations");

            migrationBuilder.AddPrimaryKey(
                name: "PK_PasswordConfigurations",
                table: "PasswordConfigurations",
                column: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_PasswordConfigurations",
                table: "PasswordConfigurations");

            migrationBuilder.RenameTable(
                name: "PasswordConfigurations",
                newName: "RegisterConfigurations");

            migrationBuilder.AddPrimaryKey(
                name: "PK_RegisterConfigurations",
                table: "RegisterConfigurations",
                column: "Id");
        }
    }
}
