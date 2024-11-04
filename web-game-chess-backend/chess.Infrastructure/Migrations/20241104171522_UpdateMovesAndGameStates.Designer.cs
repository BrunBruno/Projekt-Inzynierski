﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;
using chess.Infrastructure.Contexts;

#nullable disable

namespace chess.Infrastructure.Migrations
{
    [DbContext(typeof(ChessAppDbContext))]
    [Migration("20241104171522_UpdateMovesAndGameStates")]
    partial class UpdateMovesAndGameStates
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "7.0.8")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            NpgsqlModelBuilderExtensions.UseIdentityByDefaultColumns(modelBuilder);

            modelBuilder.Entity("chess.Core.Entities.DataConfiguration", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<int?>("MaxLength")
                        .HasColumnType("integer");

                    b.Property<int?>("MinLength")
                        .HasColumnType("integer");

                    b.Property<bool>("RequireDigit")
                        .HasColumnType("boolean");

                    b.Property<bool>("RequireLowercase")
                        .HasColumnType("boolean");

                    b.Property<bool>("RequireSpecialChar")
                        .HasColumnType("boolean");

                    b.Property<bool>("RequireUppercase")
                        .HasColumnType("boolean");

                    b.HasKey("Id");

                    b.ToTable("DataConfigurations");

                    b.HasData(
                        new
                        {
                            Id = 1,
                            MinLength = 5,
                            RequireDigit = false,
                            RequireLowercase = false,
                            RequireSpecialChar = false,
                            RequireUppercase = false
                        },
                        new
                        {
                            Id = 2,
                            MaxLength = 30,
                            MinLength = 5,
                            RequireDigit = false,
                            RequireLowercase = false,
                            RequireSpecialChar = false,
                            RequireUppercase = false
                        });
                });

            modelBuilder.Entity("chess.Core.Entities.EngineGame", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("timestamp with time zone");

                    b.Property<DateTime?>("EndedAt")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("FenPosition")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<Guid?>("GameTimingId")
                        .HasColumnType("uuid");

                    b.Property<bool>("HasEnded")
                        .HasColumnType("boolean");

                    b.Property<bool?>("IWinner")
                        .HasColumnType("boolean");

                    b.Property<Guid>("PlayerId")
                        .HasColumnType("uuid");

                    b.Property<string>("Position")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<int>("Round")
                        .HasColumnType("integer");

                    b.Property<DateTime?>("StartedAt")
                        .HasColumnType("timestamp with time zone");

                    b.Property<int>("TimingType")
                        .HasColumnType("integer");

                    b.Property<int>("Turn")
                        .HasColumnType("integer");

                    b.Property<int?>("WinnerColor")
                        .HasColumnType("integer");

                    b.HasKey("Id");

                    b.HasIndex("GameTimingId");

                    b.HasIndex("PlayerId")
                        .IsUnique();

                    b.ToTable("EngineGames");
                });

            modelBuilder.Entity("chess.Core.Entities.EngineGameMove", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<double>("BlackTime")
                        .HasColumnType("double precision");

                    b.Property<string>("CapturedPiece")
                        .HasColumnType("text");

                    b.Property<DateTime>("DoneAt")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("DoneMove")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("FenMove")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<Guid>("GameId")
                        .HasColumnType("uuid");

                    b.Property<string>("NewCoordinates")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("OldCoordinates")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Position")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<int>("Turn")
                        .HasColumnType("integer");

                    b.Property<double>("WhiteTime")
                        .HasColumnType("double precision");

                    b.HasKey("Id");

                    b.HasIndex("GameId");

                    b.ToTable("EngineGameMoves");
                });

            modelBuilder.Entity("chess.Core.Entities.EngineGamePlayer", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<int?>("Color")
                        .HasColumnType("integer");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("timestamp with time zone");

                    b.Property<Guid>("GameId")
                        .HasColumnType("uuid");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<double>("TimeLeft")
                        .HasColumnType("double precision");

                    b.Property<Guid>("UserId")
                        .HasColumnType("uuid");

                    b.HasKey("Id");

                    b.HasIndex("UserId");

                    b.ToTable("EngineGamePlayers");
                });

            modelBuilder.Entity("chess.Core.Entities.EngineGameState", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<bool>("CanBlackKingCastle")
                        .HasColumnType("boolean");

                    b.Property<bool>("CanBlackLongRookCastle")
                        .HasColumnType("boolean");

                    b.Property<bool>("CanBlackShortRookCastle")
                        .HasColumnType("boolean");

                    b.Property<bool>("CanWhiteKingCastle")
                        .HasColumnType("boolean");

                    b.Property<bool>("CanWhiteLongRookCastle")
                        .HasColumnType("boolean");

                    b.Property<bool>("CanWhiteShortRookCastle")
                        .HasColumnType("boolean");

                    b.Property<string>("EnPassant")
                        .HasColumnType("text");

                    b.Property<Guid>("GameId")
                        .HasColumnType("uuid");

                    b.Property<int>("HalfMove")
                        .HasColumnType("integer");

                    b.HasKey("Id");

                    b.HasIndex("GameId")
                        .IsUnique();

                    b.ToTable("EngineGameStates");
                });

            modelBuilder.Entity("chess.Core.Entities.Friendship", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<Guid>("ReceiverId")
                        .HasColumnType("uuid");

                    b.Property<DateTime>("RequestCreatedAt")
                        .HasColumnType("timestamp with time zone");

                    b.Property<DateTime?>("RequestRespondedAt")
                        .HasColumnType("timestamp with time zone");

                    b.Property<int>("RequestorDraws")
                        .HasColumnType("integer");

                    b.Property<Guid>("RequestorId")
                        .HasColumnType("uuid");

                    b.Property<int>("RequestorLoses")
                        .HasColumnType("integer");

                    b.Property<int>("RequestorWins")
                        .HasColumnType("integer");

                    b.Property<int>("Status")
                        .HasColumnType("integer");

                    b.HasKey("Id");

                    b.HasIndex("ReceiverId");

                    b.HasIndex("RequestorId");

                    b.ToTable("Friendships");
                });

            modelBuilder.Entity("chess.Core.Entities.GameTiming", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<int>("Increment")
                        .HasColumnType("integer");

                    b.Property<int>("Seconds")
                        .HasColumnType("integer");

                    b.Property<int>("Type")
                        .HasColumnType("integer");

                    b.HasKey("Id");

                    b.ToTable("GameTimings");
                });

            modelBuilder.Entity("chess.Core.Entities.Role", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.ToTable("Roles");

                    b.HasData(
                        new
                        {
                            Id = 2,
                            Name = "User"
                        },
                        new
                        {
                            Id = 1,
                            Name = "Admin"
                        });
                });

            modelBuilder.Entity("chess.Core.Entities.User", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<string>("Bio")
                        .HasColumnType("text");

                    b.Property<string>("Country")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<bool>("IsPrivate")
                        .HasColumnType("boolean");

                    b.Property<bool>("IsVerified")
                        .HasColumnType("boolean");

                    b.Property<DateTime>("JoinDate")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("Name")
                        .HasColumnType("text");

                    b.Property<string>("PasswordHash")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<int>("RoleId")
                        .HasColumnType("integer");

                    b.Property<string>("Username")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.HasIndex("RoleId");

                    b.ToTable("Users");
                });

            modelBuilder.Entity("chess.Core.Entities.UserBan", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<TimeSpan?>("Duration")
                        .HasColumnType("interval");

                    b.Property<bool>("IsForEver")
                        .HasColumnType("boolean");

                    b.Property<string>("Reason")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<Guid>("UserId")
                        .HasColumnType("uuid");

                    b.HasKey("Id");

                    b.HasIndex("UserId")
                        .IsUnique();

                    b.ToTable("UserBans");
                });

            modelBuilder.Entity("chess.Core.Entities.UserElo", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<int>("Blitz")
                        .HasColumnType("integer");

                    b.Property<int>("Bullet")
                        .HasColumnType("integer");

                    b.Property<int>("Classic")
                        .HasColumnType("integer");

                    b.Property<int>("Daily")
                        .HasColumnType("integer");

                    b.Property<int>("Rapid")
                        .HasColumnType("integer");

                    b.Property<Guid>("UserId")
                        .HasColumnType("uuid");

                    b.HasKey("Id");

                    b.HasIndex("UserId")
                        .IsUnique();

                    b.ToTable("UserElos");
                });

            modelBuilder.Entity("chess.Core.Entities.UserImage", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<string>("ContentType")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<byte[]>("Data")
                        .IsRequired()
                        .HasColumnType("bytea");

                    b.Property<Guid>("UserId")
                        .HasColumnType("uuid");

                    b.HasKey("Id");

                    b.HasIndex("UserId")
                        .IsUnique();

                    b.ToTable("UserImages");
                });

            modelBuilder.Entity("chess.Core.Entities.UserStats", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<int>("Draws")
                        .HasColumnType("integer");

                    b.Property<int>("Loses")
                        .HasColumnType("integer");

                    b.Property<int>("LosesByCheckMate")
                        .HasColumnType("integer");

                    b.Property<int>("LosesByResignation")
                        .HasColumnType("integer");

                    b.Property<int>("LosesByTimeout")
                        .HasColumnType("integer");

                    b.Property<Guid>("UserId")
                        .HasColumnType("uuid");

                    b.Property<int>("Wins")
                        .HasColumnType("integer");

                    b.Property<int>("WinsByCheckMate")
                        .HasColumnType("integer");

                    b.Property<int>("WinsByResignation")
                        .HasColumnType("integer");

                    b.Property<int>("WinsByTimeout")
                        .HasColumnType("integer");

                    b.HasKey("Id");

                    b.HasIndex("UserId")
                        .IsUnique();

                    b.ToTable("UserStats");
                });

            modelBuilder.Entity("chess.Core.Entities.UserVerificationCode", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<string>("CodeHash")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<DateTime>("ExpirationDate")
                        .HasColumnType("timestamp with time zone");

                    b.Property<int>("Type")
                        .HasColumnType("integer");

                    b.Property<Guid>("UserId")
                        .HasColumnType("uuid");

                    b.HasKey("Id");

                    b.HasIndex("UserId")
                        .IsUnique();

                    b.ToTable("UserVerificationCodes");
                });

            modelBuilder.Entity("chess.Core.Entities.WebGame", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<Guid>("BlackPlayerId")
                        .HasColumnType("uuid");

                    b.Property<bool>("BlackPlayerRegistered")
                        .HasColumnType("boolean");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("timestamp with time zone");

                    b.Property<int>("EloGain")
                        .HasColumnType("integer");

                    b.Property<int?>("EndGameType")
                        .HasColumnType("integer");

                    b.Property<DateTime?>("EndedAt")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("FenPosition")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<Guid>("GameTimingId")
                        .HasColumnType("uuid");

                    b.Property<bool>("HasEnded")
                        .HasColumnType("boolean");

                    b.Property<bool>("IsPrivate")
                        .HasColumnType("boolean");

                    b.Property<string>("Position")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<int>("Round")
                        .HasColumnType("integer");

                    b.Property<DateTime?>("StartedAt")
                        .HasColumnType("timestamp with time zone");

                    b.Property<int>("TimingType")
                        .HasColumnType("integer");

                    b.Property<int>("Turn")
                        .HasColumnType("integer");

                    b.Property<Guid>("WhitePlayerId")
                        .HasColumnType("uuid");

                    b.Property<bool>("WhitePlayerRegistered")
                        .HasColumnType("boolean");

                    b.Property<int?>("WinnerColor")
                        .HasColumnType("integer");

                    b.HasKey("Id");

                    b.HasIndex("BlackPlayerId")
                        .IsUnique();

                    b.HasIndex("GameTimingId");

                    b.HasIndex("WhitePlayerId")
                        .IsUnique();

                    b.ToTable("WebGames");
                });

            modelBuilder.Entity("chess.Core.Entities.WebGameInvitation", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("timestamp with time zone");

                    b.Property<Guid>("GameId")
                        .HasColumnType("uuid");

                    b.Property<Guid>("InviteeId")
                        .HasColumnType("uuid");

                    b.Property<string>("InviteeName")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<Guid>("InviterId")
                        .HasColumnType("uuid");

                    b.Property<string>("InviterName")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<bool>("IsAccepted")
                        .HasColumnType("boolean");

                    b.Property<int>("Type")
                        .HasColumnType("integer");

                    b.HasKey("Id");

                    b.HasIndex("GameId")
                        .IsUnique();

                    b.ToTable("WebGameInvitations");
                });

            modelBuilder.Entity("chess.Core.Entities.WebGameMessage", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<string>("Content")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<Guid>("GameId")
                        .HasColumnType("uuid");

                    b.Property<string>("RequestorName")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<DateTime>("SentAt")
                        .HasColumnType("timestamp with time zone");

                    b.Property<int>("Type")
                        .HasColumnType("integer");

                    b.HasKey("Id");

                    b.HasIndex("GameId");

                    b.ToTable("WebGameMessages");
                });

            modelBuilder.Entity("chess.Core.Entities.WebGameMove", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<double>("BlackTime")
                        .HasColumnType("double precision");

                    b.Property<string>("CapturedPiece")
                        .HasColumnType("text");

                    b.Property<DateTime>("DoneAt")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("DoneMove")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("FenMove")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<Guid>("GameId")
                        .HasColumnType("uuid");

                    b.Property<string>("NewCoordinates")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("OldCoordinates")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Position")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<int>("Turn")
                        .HasColumnType("integer");

                    b.Property<double>("WhiteTime")
                        .HasColumnType("double precision");

                    b.HasKey("Id");

                    b.HasIndex("GameId");

                    b.ToTable("WebGameMoves");
                });

            modelBuilder.Entity("chess.Core.Entities.WebGamePlayer", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<int?>("Color")
                        .HasColumnType("integer");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("timestamp with time zone");

                    b.Property<int>("Elo")
                        .HasColumnType("integer");

                    b.Property<bool>("FinishedGame")
                        .HasColumnType("boolean");

                    b.Property<Guid>("GameId")
                        .HasColumnType("uuid");

                    b.Property<bool>("IsPlaying")
                        .HasColumnType("boolean");

                    b.Property<bool>("IsPrivate")
                        .HasColumnType("boolean");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<double>("TimeLeft")
                        .HasColumnType("double precision");

                    b.Property<Guid>("TimingId")
                        .HasColumnType("uuid");

                    b.Property<Guid>("UserId")
                        .HasColumnType("uuid");

                    b.HasKey("Id");

                    b.HasIndex("UserId");

                    b.ToTable("WebGamePlayers");
                });

            modelBuilder.Entity("chess.Core.Entities.WebGamePlayerMessage", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<string>("Content")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<Guid>("PlayerId")
                        .HasColumnType("uuid");

                    b.Property<DateTime>("SentAt")
                        .HasColumnType("timestamp with time zone");

                    b.Property<int>("Type")
                        .HasColumnType("integer");

                    b.HasKey("Id");

                    b.HasIndex("PlayerId");

                    b.ToTable("WebGamePlayerMessages");
                });

            modelBuilder.Entity("chess.Core.Entities.WebGameState", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<bool>("CanBlackKingCastle")
                        .HasColumnType("boolean");

                    b.Property<bool>("CanBlackLongRookCastle")
                        .HasColumnType("boolean");

                    b.Property<bool>("CanBlackShortRookCastle")
                        .HasColumnType("boolean");

                    b.Property<bool>("CanWhiteKingCastle")
                        .HasColumnType("boolean");

                    b.Property<bool>("CanWhiteLongRookCastle")
                        .HasColumnType("boolean");

                    b.Property<bool>("CanWhiteShortRookCastle")
                        .HasColumnType("boolean");

                    b.Property<string>("EnPassant")
                        .HasColumnType("text");

                    b.Property<Guid>("GameId")
                        .HasColumnType("uuid");

                    b.Property<int>("HalfMove")
                        .HasColumnType("integer");

                    b.HasKey("Id");

                    b.HasIndex("GameId")
                        .IsUnique();

                    b.ToTable("WebGameStates");
                });

            modelBuilder.Entity("chess.Core.Entities.EngineGame", b =>
                {
                    b.HasOne("chess.Core.Entities.GameTiming", null)
                        .WithMany("EngineGames")
                        .HasForeignKey("GameTimingId");

                    b.HasOne("chess.Core.Entities.EngineGamePlayer", "Player")
                        .WithOne("Game")
                        .HasForeignKey("chess.Core.Entities.EngineGame", "PlayerId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Player");
                });

            modelBuilder.Entity("chess.Core.Entities.EngineGameMove", b =>
                {
                    b.HasOne("chess.Core.Entities.EngineGame", "Game")
                        .WithMany("Moves")
                        .HasForeignKey("GameId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Game");
                });

            modelBuilder.Entity("chess.Core.Entities.EngineGamePlayer", b =>
                {
                    b.HasOne("chess.Core.Entities.User", "User")
                        .WithMany("EngineGamePlayers")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("User");
                });

            modelBuilder.Entity("chess.Core.Entities.EngineGameState", b =>
                {
                    b.HasOne("chess.Core.Entities.EngineGame", "Game")
                        .WithOne("CurrentState")
                        .HasForeignKey("chess.Core.Entities.EngineGameState", "GameId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Game");
                });

            modelBuilder.Entity("chess.Core.Entities.Friendship", b =>
                {
                    b.HasOne("chess.Core.Entities.User", "Receiver")
                        .WithMany("ReceivedFriendships")
                        .HasForeignKey("ReceiverId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("chess.Core.Entities.User", "Requestor")
                        .WithMany("RequestedFriendships")
                        .HasForeignKey("RequestorId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Receiver");

                    b.Navigation("Requestor");
                });

            modelBuilder.Entity("chess.Core.Entities.User", b =>
                {
                    b.HasOne("chess.Core.Entities.Role", "Role")
                        .WithMany()
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Role");
                });

            modelBuilder.Entity("chess.Core.Entities.UserBan", b =>
                {
                    b.HasOne("chess.Core.Entities.User", "User")
                        .WithOne()
                        .HasForeignKey("chess.Core.Entities.UserBan", "UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("User");
                });

            modelBuilder.Entity("chess.Core.Entities.UserElo", b =>
                {
                    b.HasOne("chess.Core.Entities.User", "User")
                        .WithOne("Elo")
                        .HasForeignKey("chess.Core.Entities.UserElo", "UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("User");
                });

            modelBuilder.Entity("chess.Core.Entities.UserImage", b =>
                {
                    b.HasOne("chess.Core.Entities.User", "User")
                        .WithOne("Image")
                        .HasForeignKey("chess.Core.Entities.UserImage", "UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("User");
                });

            modelBuilder.Entity("chess.Core.Entities.UserStats", b =>
                {
                    b.HasOne("chess.Core.Entities.User", "User")
                        .WithOne("Stats")
                        .HasForeignKey("chess.Core.Entities.UserStats", "UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("User");
                });

            modelBuilder.Entity("chess.Core.Entities.UserVerificationCode", b =>
                {
                    b.HasOne("chess.Core.Entities.User", "User")
                        .WithOne()
                        .HasForeignKey("chess.Core.Entities.UserVerificationCode", "UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("User");
                });

            modelBuilder.Entity("chess.Core.Entities.WebGame", b =>
                {
                    b.HasOne("chess.Core.Entities.WebGamePlayer", "BlackPlayer")
                        .WithOne("BlackGame")
                        .HasForeignKey("chess.Core.Entities.WebGame", "BlackPlayerId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("chess.Core.Entities.GameTiming", "GameTiming")
                        .WithMany("WebGames")
                        .HasForeignKey("GameTimingId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("chess.Core.Entities.WebGamePlayer", "WhitePlayer")
                        .WithOne("WhiteGame")
                        .HasForeignKey("chess.Core.Entities.WebGame", "WhitePlayerId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("BlackPlayer");

                    b.Navigation("GameTiming");

                    b.Navigation("WhitePlayer");
                });

            modelBuilder.Entity("chess.Core.Entities.WebGameInvitation", b =>
                {
                    b.HasOne("chess.Core.Entities.WebGame", "Game")
                        .WithOne()
                        .HasForeignKey("chess.Core.Entities.WebGameInvitation", "GameId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Game");
                });

            modelBuilder.Entity("chess.Core.Entities.WebGameMessage", b =>
                {
                    b.HasOne("chess.Core.Entities.WebGame", "Game")
                        .WithMany("Messages")
                        .HasForeignKey("GameId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Game");
                });

            modelBuilder.Entity("chess.Core.Entities.WebGameMove", b =>
                {
                    b.HasOne("chess.Core.Entities.WebGame", "Game")
                        .WithMany("Moves")
                        .HasForeignKey("GameId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Game");
                });

            modelBuilder.Entity("chess.Core.Entities.WebGamePlayer", b =>
                {
                    b.HasOne("chess.Core.Entities.User", "User")
                        .WithMany("Players")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("User");
                });

            modelBuilder.Entity("chess.Core.Entities.WebGamePlayerMessage", b =>
                {
                    b.HasOne("chess.Core.Entities.WebGamePlayer", "Player")
                        .WithMany("Messages")
                        .HasForeignKey("PlayerId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Player");
                });

            modelBuilder.Entity("chess.Core.Entities.WebGameState", b =>
                {
                    b.HasOne("chess.Core.Entities.WebGame", "Game")
                        .WithOne("CurrentState")
                        .HasForeignKey("chess.Core.Entities.WebGameState", "GameId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Game");
                });

            modelBuilder.Entity("chess.Core.Entities.EngineGame", b =>
                {
                    b.Navigation("CurrentState")
                        .IsRequired();

                    b.Navigation("Moves");
                });

            modelBuilder.Entity("chess.Core.Entities.EngineGamePlayer", b =>
                {
                    b.Navigation("Game")
                        .IsRequired();
                });

            modelBuilder.Entity("chess.Core.Entities.GameTiming", b =>
                {
                    b.Navigation("EngineGames");

                    b.Navigation("WebGames");
                });

            modelBuilder.Entity("chess.Core.Entities.User", b =>
                {
                    b.Navigation("Elo")
                        .IsRequired();

                    b.Navigation("EngineGamePlayers");

                    b.Navigation("Image");

                    b.Navigation("Players");

                    b.Navigation("ReceivedFriendships");

                    b.Navigation("RequestedFriendships");

                    b.Navigation("Stats")
                        .IsRequired();
                });

            modelBuilder.Entity("chess.Core.Entities.WebGame", b =>
                {
                    b.Navigation("CurrentState")
                        .IsRequired();

                    b.Navigation("Messages");

                    b.Navigation("Moves");
                });

            modelBuilder.Entity("chess.Core.Entities.WebGamePlayer", b =>
                {
                    b.Navigation("BlackGame");

                    b.Navigation("Messages");

                    b.Navigation("WhiteGame");
                });
#pragma warning restore 612, 618
        }
    }
}
