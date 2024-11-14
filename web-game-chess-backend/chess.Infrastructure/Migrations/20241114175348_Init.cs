using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace chess.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class Init : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "DataConfigurations",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    MinLength = table.Column<int>(type: "integer", nullable: true),
                    MaxLength = table.Column<int>(type: "integer", nullable: true),
                    RequireUppercase = table.Column<bool>(type: "boolean", nullable: false),
                    RequireLowercase = table.Column<bool>(type: "boolean", nullable: false),
                    RequireDigit = table.Column<bool>(type: "boolean", nullable: false),
                    RequireSpecialChar = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DataConfigurations", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "GameTimings",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Type = table.Column<int>(type: "integer", nullable: false),
                    Seconds = table.Column<int>(type: "integer", nullable: false),
                    Increment = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GameTimings", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Roles",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Roles", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Email = table.Column<string>(type: "text", nullable: false),
                    Username = table.Column<string>(type: "text", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: true),
                    PasswordHash = table.Column<string>(type: "text", nullable: false),
                    JoinDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    IsVerified = table.Column<bool>(type: "boolean", nullable: false),
                    Country = table.Column<string>(type: "text", nullable: false),
                    Bio = table.Column<string>(type: "text", nullable: true),
                    IsPrivate = table.Column<bool>(type: "boolean", nullable: false),
                    RoleId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Users_Roles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "Roles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "EngineGamePlayers",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    GameId = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Color = table.Column<int>(type: "integer", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    TimeLeft = table.Column<double>(type: "double precision", nullable: false)
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
                name: "Friendships",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    RequestCreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    RequestRespondedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    RequestorWins = table.Column<int>(type: "integer", nullable: false),
                    RequestorLoses = table.Column<int>(type: "integer", nullable: false),
                    RequestorDraws = table.Column<int>(type: "integer", nullable: false),
                    RequestorId = table.Column<Guid>(type: "uuid", nullable: false),
                    ReceiverId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Friendships", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Friendships_Users_ReceiverId",
                        column: x => x.ReceiverId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Friendships_Users_RequestorId",
                        column: x => x.RequestorId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UserBackgroundImages",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    Data = table.Column<byte[]>(type: "bytea", nullable: false),
                    ContentType = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserBackgroundImages", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserBackgroundImages_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UserBans",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Reason = table.Column<string>(type: "text", nullable: false),
                    IsForEver = table.Column<bool>(type: "boolean", nullable: false),
                    Duration = table.Column<TimeSpan>(type: "interval", nullable: true),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserBans", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserBans_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UserElos",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Bullet = table.Column<int>(type: "integer", nullable: false),
                    Blitz = table.Column<int>(type: "integer", nullable: false),
                    Rapid = table.Column<int>(type: "integer", nullable: false),
                    Classic = table.Column<int>(type: "integer", nullable: false),
                    Daily = table.Column<int>(type: "integer", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserElos", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserElos_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UserProfileImages",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    Data = table.Column<byte[]>(type: "bytea", nullable: false),
                    ContentType = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserProfileImages", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserProfileImages_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UserSettings",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    AppearanceOfPieces = table.Column<int>(type: "integer", nullable: false),
                    AppearanceOfBoard = table.Column<int>(type: "integer", nullable: false),
                    AppearanceOfGamePage = table.Column<int>(type: "integer", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserSettings", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserSettings_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UserStats",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    OnlineWins = table.Column<int>(type: "integer", nullable: false),
                    OnlineDraws = table.Column<int>(type: "integer", nullable: false),
                    OnlineLoses = table.Column<int>(type: "integer", nullable: false),
                    BulletGamesPlayed = table.Column<int>(type: "integer", nullable: false),
                    BlitzGamesPlayed = table.Column<int>(type: "integer", nullable: false),
                    RapidGamesPlayed = table.Column<int>(type: "integer", nullable: false),
                    ClassicGamesPlayed = table.Column<int>(type: "integer", nullable: false),
                    DailyGamesPlayed = table.Column<int>(type: "integer", nullable: false),
                    WinsByCheckMate = table.Column<int>(type: "integer", nullable: false),
                    WinsByTimeout = table.Column<int>(type: "integer", nullable: false),
                    WinsByResignation = table.Column<int>(type: "integer", nullable: false),
                    LosesByCheckMate = table.Column<int>(type: "integer", nullable: false),
                    LosesByTimeout = table.Column<int>(type: "integer", nullable: false),
                    LosesByResignation = table.Column<int>(type: "integer", nullable: false),
                    OfflineWins = table.Column<int>(type: "integer", nullable: false),
                    OfflineDraws = table.Column<int>(type: "integer", nullable: false),
                    OfflineLoses = table.Column<int>(type: "integer", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserStats", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserStats_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UserVerificationCodes",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    CodeHash = table.Column<string>(type: "text", nullable: false),
                    ExpirationDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Type = table.Column<int>(type: "integer", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserVerificationCodes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserVerificationCodes_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "WebGamePlayers",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Elo = table.Column<int>(type: "integer", nullable: false),
                    IsPrivate = table.Column<bool>(type: "boolean", nullable: false),
                    IsPlaying = table.Column<bool>(type: "boolean", nullable: false),
                    FinishedGame = table.Column<bool>(type: "boolean", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    GameId = table.Column<Guid>(type: "uuid", nullable: false),
                    TimingId = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Color = table.Column<int>(type: "integer", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    TimeLeft = table.Column<double>(type: "double precision", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WebGamePlayers", x => x.Id);
                    table.ForeignKey(
                        name: "FK_WebGamePlayers_Users_UserId",
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
                    IsWinner = table.Column<bool>(type: "boolean", nullable: true),
                    TimingType = table.Column<int>(type: "integer", nullable: true),
                    EngineLevel = table.Column<int>(type: "integer", nullable: false),
                    AllowUndo = table.Column<bool>(type: "boolean", nullable: false),
                    PlayerId = table.Column<Guid>(type: "uuid", nullable: false),
                    GameTimingId = table.Column<Guid>(type: "uuid", nullable: true),
                    Position = table.Column<string>(type: "text", nullable: false),
                    FenPosition = table.Column<string>(type: "text", nullable: false),
                    HasEnded = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    StartedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    EndedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    Turn = table.Column<int>(type: "integer", nullable: false),
                    Round = table.Column<int>(type: "integer", nullable: false),
                    WinnerColor = table.Column<int>(type: "integer", nullable: true)
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
                    table.ForeignKey(
                        name: "FK_EngineGames_GameTimings_GameTimingId",
                        column: x => x.GameTimingId,
                        principalTable: "GameTimings",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "WebGamePlayerMessages",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    PlayerId = table.Column<Guid>(type: "uuid", nullable: false),
                    Content = table.Column<string>(type: "text", nullable: false),
                    SentAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Type = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WebGamePlayerMessages", x => x.Id);
                    table.ForeignKey(
                        name: "FK_WebGamePlayerMessages_WebGamePlayers_PlayerId",
                        column: x => x.PlayerId,
                        principalTable: "WebGamePlayers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "WebGames",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    IsPrivate = table.Column<bool>(type: "boolean", nullable: false),
                    TimingType = table.Column<int>(type: "integer", nullable: false),
                    EndGameType = table.Column<int>(type: "integer", nullable: true),
                    EloGain = table.Column<int>(type: "integer", nullable: false),
                    WhitePlayerId = table.Column<Guid>(type: "uuid", nullable: false),
                    WhitePlayerRegistered = table.Column<bool>(type: "boolean", nullable: false),
                    BlackPlayerId = table.Column<Guid>(type: "uuid", nullable: false),
                    BlackPlayerRegistered = table.Column<bool>(type: "boolean", nullable: false),
                    GameTimingId = table.Column<Guid>(type: "uuid", nullable: false),
                    Position = table.Column<string>(type: "text", nullable: false),
                    FenPosition = table.Column<string>(type: "text", nullable: false),
                    HasEnded = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    StartedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    EndedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    Turn = table.Column<int>(type: "integer", nullable: false),
                    Round = table.Column<int>(type: "integer", nullable: false),
                    WinnerColor = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WebGames", x => x.Id);
                    table.ForeignKey(
                        name: "FK_WebGames_GameTimings_GameTimingId",
                        column: x => x.GameTimingId,
                        principalTable: "GameTimings",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_WebGames_WebGamePlayers_BlackPlayerId",
                        column: x => x.BlackPlayerId,
                        principalTable: "WebGamePlayers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_WebGames_WebGamePlayers_WhitePlayerId",
                        column: x => x.WhitePlayerId,
                        principalTable: "WebGamePlayers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "EngineGameMessages",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    RequestorName = table.Column<string>(type: "text", nullable: false),
                    GameId = table.Column<Guid>(type: "uuid", nullable: false),
                    Content = table.Column<string>(type: "text", nullable: false),
                    SentAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Type = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EngineGameMessages", x => x.Id);
                    table.ForeignKey(
                        name: "FK_EngineGameMessages_EngineGames_GameId",
                        column: x => x.GameId,
                        principalTable: "EngineGames",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "EngineGameMoves",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    WhiteTime = table.Column<double>(type: "double precision", nullable: false),
                    BlackTime = table.Column<double>(type: "double precision", nullable: false),
                    GameId = table.Column<Guid>(type: "uuid", nullable: false),
                    DoneMove = table.Column<string>(type: "text", nullable: false),
                    FenMove = table.Column<string>(type: "text", nullable: false),
                    OldCoordinates = table.Column<string>(type: "text", nullable: false),
                    NewCoordinates = table.Column<string>(type: "text", nullable: false),
                    Position = table.Column<string>(type: "text", nullable: false),
                    Turn = table.Column<int>(type: "integer", nullable: false),
                    CapturedPiece = table.Column<string>(type: "text", nullable: true),
                    DoneAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
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

            migrationBuilder.CreateTable(
                name: "EngineGameStates",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    GameId = table.Column<Guid>(type: "uuid", nullable: false),
                    EnPassant = table.Column<string>(type: "text", nullable: true),
                    CanWhiteKingCastle = table.Column<bool>(type: "boolean", nullable: false),
                    CanWhiteShortRookCastle = table.Column<bool>(type: "boolean", nullable: false),
                    CanWhiteLongRookCastle = table.Column<bool>(type: "boolean", nullable: false),
                    CanBlackKingCastle = table.Column<bool>(type: "boolean", nullable: false),
                    CanBlackShortRookCastle = table.Column<bool>(type: "boolean", nullable: false),
                    CanBlackLongRookCastle = table.Column<bool>(type: "boolean", nullable: false),
                    HalfMove = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EngineGameStates", x => x.Id);
                    table.ForeignKey(
                        name: "FK_EngineGameStates_EngineGames_GameId",
                        column: x => x.GameId,
                        principalTable: "EngineGames",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "WebGameInvitations",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    InviterId = table.Column<Guid>(type: "uuid", nullable: false),
                    InviterName = table.Column<string>(type: "text", nullable: false),
                    InviteeId = table.Column<Guid>(type: "uuid", nullable: false),
                    InviteeName = table.Column<string>(type: "text", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Type = table.Column<int>(type: "integer", nullable: false),
                    IsAccepted = table.Column<bool>(type: "boolean", nullable: false),
                    GameId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WebGameInvitations", x => x.Id);
                    table.ForeignKey(
                        name: "FK_WebGameInvitations_WebGames_GameId",
                        column: x => x.GameId,
                        principalTable: "WebGames",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "WebGameMessages",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    RequestorName = table.Column<string>(type: "text", nullable: false),
                    GameId = table.Column<Guid>(type: "uuid", nullable: false),
                    Content = table.Column<string>(type: "text", nullable: false),
                    SentAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Type = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WebGameMessages", x => x.Id);
                    table.ForeignKey(
                        name: "FK_WebGameMessages_WebGames_GameId",
                        column: x => x.GameId,
                        principalTable: "WebGames",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "WebGameMoves",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    WhiteTime = table.Column<double>(type: "double precision", nullable: false),
                    BlackTime = table.Column<double>(type: "double precision", nullable: false),
                    GameId = table.Column<Guid>(type: "uuid", nullable: false),
                    DoneMove = table.Column<string>(type: "text", nullable: false),
                    FenMove = table.Column<string>(type: "text", nullable: false),
                    OldCoordinates = table.Column<string>(type: "text", nullable: false),
                    NewCoordinates = table.Column<string>(type: "text", nullable: false),
                    Position = table.Column<string>(type: "text", nullable: false),
                    Turn = table.Column<int>(type: "integer", nullable: false),
                    CapturedPiece = table.Column<string>(type: "text", nullable: true),
                    DoneAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WebGameMoves", x => x.Id);
                    table.ForeignKey(
                        name: "FK_WebGameMoves_WebGames_GameId",
                        column: x => x.GameId,
                        principalTable: "WebGames",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "WebGameStates",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    GameId = table.Column<Guid>(type: "uuid", nullable: false),
                    EnPassant = table.Column<string>(type: "text", nullable: true),
                    CanWhiteKingCastle = table.Column<bool>(type: "boolean", nullable: false),
                    CanWhiteShortRookCastle = table.Column<bool>(type: "boolean", nullable: false),
                    CanWhiteLongRookCastle = table.Column<bool>(type: "boolean", nullable: false),
                    CanBlackKingCastle = table.Column<bool>(type: "boolean", nullable: false),
                    CanBlackShortRookCastle = table.Column<bool>(type: "boolean", nullable: false),
                    CanBlackLongRookCastle = table.Column<bool>(type: "boolean", nullable: false),
                    HalfMove = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WebGameStates", x => x.Id);
                    table.ForeignKey(
                        name: "FK_WebGameStates_WebGames_GameId",
                        column: x => x.GameId,
                        principalTable: "WebGames",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "DataConfigurations",
                columns: new[] { "Id", "MaxLength", "MinLength", "RequireDigit", "RequireLowercase", "RequireSpecialChar", "RequireUppercase" },
                values: new object[,]
                {
                    { 1, null, 5, false, false, false, false },
                    { 2, 30, 5, false, false, false, false }
                });

            migrationBuilder.InsertData(
                table: "Roles",
                columns: new[] { "Id", "Name" },
                values: new object[,]
                {
                    { 1, "Admin" },
                    { 2, "User" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_EngineGameMessages_GameId",
                table: "EngineGameMessages",
                column: "GameId");

            migrationBuilder.CreateIndex(
                name: "IX_EngineGameMoves_GameId",
                table: "EngineGameMoves",
                column: "GameId");

            migrationBuilder.CreateIndex(
                name: "IX_EngineGamePlayers_UserId",
                table: "EngineGamePlayers",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_EngineGames_GameTimingId",
                table: "EngineGames",
                column: "GameTimingId");

            migrationBuilder.CreateIndex(
                name: "IX_EngineGames_PlayerId",
                table: "EngineGames",
                column: "PlayerId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_EngineGameStates_GameId",
                table: "EngineGameStates",
                column: "GameId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Friendships_ReceiverId",
                table: "Friendships",
                column: "ReceiverId");

            migrationBuilder.CreateIndex(
                name: "IX_Friendships_RequestorId",
                table: "Friendships",
                column: "RequestorId");

            migrationBuilder.CreateIndex(
                name: "IX_UserBackgroundImages_UserId",
                table: "UserBackgroundImages",
                column: "UserId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_UserBans_UserId",
                table: "UserBans",
                column: "UserId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_UserElos_UserId",
                table: "UserElos",
                column: "UserId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_UserProfileImages_UserId",
                table: "UserProfileImages",
                column: "UserId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Users_RoleId",
                table: "Users",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "IX_UserSettings_UserId",
                table: "UserSettings",
                column: "UserId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_UserStats_UserId",
                table: "UserStats",
                column: "UserId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_UserVerificationCodes_UserId",
                table: "UserVerificationCodes",
                column: "UserId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_WebGameInvitations_GameId",
                table: "WebGameInvitations",
                column: "GameId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_WebGameMessages_GameId",
                table: "WebGameMessages",
                column: "GameId");

            migrationBuilder.CreateIndex(
                name: "IX_WebGameMoves_GameId",
                table: "WebGameMoves",
                column: "GameId");

            migrationBuilder.CreateIndex(
                name: "IX_WebGamePlayerMessages_PlayerId",
                table: "WebGamePlayerMessages",
                column: "PlayerId");

            migrationBuilder.CreateIndex(
                name: "IX_WebGamePlayers_UserId",
                table: "WebGamePlayers",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_WebGames_BlackPlayerId",
                table: "WebGames",
                column: "BlackPlayerId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_WebGames_GameTimingId",
                table: "WebGames",
                column: "GameTimingId");

            migrationBuilder.CreateIndex(
                name: "IX_WebGames_WhitePlayerId",
                table: "WebGames",
                column: "WhitePlayerId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_WebGameStates_GameId",
                table: "WebGameStates",
                column: "GameId",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DataConfigurations");

            migrationBuilder.DropTable(
                name: "EngineGameMessages");

            migrationBuilder.DropTable(
                name: "EngineGameMoves");

            migrationBuilder.DropTable(
                name: "EngineGameStates");

            migrationBuilder.DropTable(
                name: "Friendships");

            migrationBuilder.DropTable(
                name: "UserBackgroundImages");

            migrationBuilder.DropTable(
                name: "UserBans");

            migrationBuilder.DropTable(
                name: "UserElos");

            migrationBuilder.DropTable(
                name: "UserProfileImages");

            migrationBuilder.DropTable(
                name: "UserSettings");

            migrationBuilder.DropTable(
                name: "UserStats");

            migrationBuilder.DropTable(
                name: "UserVerificationCodes");

            migrationBuilder.DropTable(
                name: "WebGameInvitations");

            migrationBuilder.DropTable(
                name: "WebGameMessages");

            migrationBuilder.DropTable(
                name: "WebGameMoves");

            migrationBuilder.DropTable(
                name: "WebGamePlayerMessages");

            migrationBuilder.DropTable(
                name: "WebGameStates");

            migrationBuilder.DropTable(
                name: "EngineGames");

            migrationBuilder.DropTable(
                name: "WebGames");

            migrationBuilder.DropTable(
                name: "EngineGamePlayers");

            migrationBuilder.DropTable(
                name: "GameTimings");

            migrationBuilder.DropTable(
                name: "WebGamePlayers");

            migrationBuilder.DropTable(
                name: "Users");

            migrationBuilder.DropTable(
                name: "Roles");
        }
    }
}
