using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace chess.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class fixSpelling : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "InvitorName",
                table: "Invitations",
                newName: "InviterName");

            migrationBuilder.RenameColumn(
                name: "InvitorId",
                table: "Invitations",
                newName: "InviterId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "InviterName",
                table: "Invitations",
                newName: "InvitorName");

            migrationBuilder.RenameColumn(
                name: "InviterId",
                table: "Invitations",
                newName: "InvitorId");
        }
    }
}
