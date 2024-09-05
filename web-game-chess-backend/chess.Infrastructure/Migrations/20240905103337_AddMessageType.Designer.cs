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
    [Migration("20240905103337_AddMessageType")]
    partial class AddMessageType
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "7.0.8")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            NpgsqlModelBuilderExtensions.UseIdentityByDefaultColumns(modelBuilder);

            modelBuilder.Entity("chess.Core.Entities.BannedUser", b =>
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

                    b.ToTable("BannedUsers");
                });

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

            modelBuilder.Entity("chess.Core.Entities.Elo", b =>
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

                    b.ToTable("Elos");
                });

            modelBuilder.Entity("chess.Core.Entities.EmailVerificationCode", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<string>("CodeHash")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<DateTime>("ExpirationDate")
                        .HasColumnType("timestamp with time zone");

                    b.Property<Guid>("UserId")
                        .HasColumnType("uuid");

                    b.HasKey("Id");

                    b.HasIndex("UserId")
                        .IsUnique();

                    b.ToTable("EmailVerificationCodes");
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

            modelBuilder.Entity("chess.Core.Entities.Game", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<Guid>("BlackPlayerId")
                        .HasColumnType("uuid");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("timestamp with time zone");

                    b.Property<int>("EloGain")
                        .HasColumnType("integer");

                    b.Property<int?>("EndGameType")
                        .HasColumnType("integer");

                    b.Property<DateTime?>("EndedAt")
                        .HasColumnType("timestamp with time zone");

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

                    b.Property<int?>("WinnerColor")
                        .HasColumnType("integer");

                    b.HasKey("Id");

                    b.HasIndex("BlackPlayerId")
                        .IsUnique();

                    b.HasIndex("GameTimingId");

                    b.HasIndex("WhitePlayerId")
                        .IsUnique();

                    b.ToTable("Games");
                });

            modelBuilder.Entity("chess.Core.Entities.GameState", b =>
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

                    b.HasKey("Id");

                    b.HasIndex("GameId")
                        .IsUnique();

                    b.ToTable("GameStates");
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

            modelBuilder.Entity("chess.Core.Entities.Invitation", b =>
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

                    b.ToTable("Invitations");
                });

            modelBuilder.Entity("chess.Core.Entities.Message", b =>
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

                    b.ToTable("Messages");
                });

            modelBuilder.Entity("chess.Core.Entities.Move", b =>
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

                    b.ToTable("Moves");
                });

            modelBuilder.Entity("chess.Core.Entities.Player", b =>
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

                    b.Property<string>("ImageUrl")
                        .HasColumnType("text");

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

                    b.ToTable("Players");
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

                    b.Property<string>("ImageUrl")
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

            modelBuilder.Entity("chess.Core.Entities.BannedUser", b =>
                {
                    b.HasOne("chess.Core.Entities.User", "User")
                        .WithOne()
                        .HasForeignKey("chess.Core.Entities.BannedUser", "UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("User");
                });

            modelBuilder.Entity("chess.Core.Entities.Elo", b =>
                {
                    b.HasOne("chess.Core.Entities.User", "User")
                        .WithOne("Elo")
                        .HasForeignKey("chess.Core.Entities.Elo", "UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("User");
                });

            modelBuilder.Entity("chess.Core.Entities.EmailVerificationCode", b =>
                {
                    b.HasOne("chess.Core.Entities.User", "User")
                        .WithOne()
                        .HasForeignKey("chess.Core.Entities.EmailVerificationCode", "UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("User");
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

            modelBuilder.Entity("chess.Core.Entities.Game", b =>
                {
                    b.HasOne("chess.Core.Entities.Player", "BlackPlayer")
                        .WithOne("BlackGame")
                        .HasForeignKey("chess.Core.Entities.Game", "BlackPlayerId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("chess.Core.Entities.GameTiming", "GameTiming")
                        .WithMany("Games")
                        .HasForeignKey("GameTimingId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("chess.Core.Entities.Player", "WhitePlayer")
                        .WithOne("WhiteGame")
                        .HasForeignKey("chess.Core.Entities.Game", "WhitePlayerId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("BlackPlayer");

                    b.Navigation("GameTiming");

                    b.Navigation("WhitePlayer");
                });

            modelBuilder.Entity("chess.Core.Entities.GameState", b =>
                {
                    b.HasOne("chess.Core.Entities.Game", "Game")
                        .WithOne("GameState")
                        .HasForeignKey("chess.Core.Entities.GameState", "GameId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Game");
                });

            modelBuilder.Entity("chess.Core.Entities.Invitation", b =>
                {
                    b.HasOne("chess.Core.Entities.Game", "Game")
                        .WithOne()
                        .HasForeignKey("chess.Core.Entities.Invitation", "GameId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Game");
                });

            modelBuilder.Entity("chess.Core.Entities.Message", b =>
                {
                    b.HasOne("chess.Core.Entities.Player", "Player")
                        .WithMany("Messages")
                        .HasForeignKey("PlayerId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Player");
                });

            modelBuilder.Entity("chess.Core.Entities.Move", b =>
                {
                    b.HasOne("chess.Core.Entities.Game", "Game")
                        .WithMany("Moves")
                        .HasForeignKey("GameId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Game");
                });

            modelBuilder.Entity("chess.Core.Entities.Player", b =>
                {
                    b.HasOne("chess.Core.Entities.User", "User")
                        .WithMany("Players")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("User");
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

            modelBuilder.Entity("chess.Core.Entities.UserStats", b =>
                {
                    b.HasOne("chess.Core.Entities.User", "User")
                        .WithOne("Stats")
                        .HasForeignKey("chess.Core.Entities.UserStats", "UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("User");
                });

            modelBuilder.Entity("chess.Core.Entities.Game", b =>
                {
                    b.Navigation("GameState")
                        .IsRequired();

                    b.Navigation("Moves");
                });

            modelBuilder.Entity("chess.Core.Entities.GameTiming", b =>
                {
                    b.Navigation("Games");
                });

            modelBuilder.Entity("chess.Core.Entities.Player", b =>
                {
                    b.Navigation("BlackGame")
                        .IsRequired();

                    b.Navigation("Messages");

                    b.Navigation("WhiteGame")
                        .IsRequired();
                });

            modelBuilder.Entity("chess.Core.Entities.User", b =>
                {
                    b.Navigation("Elo")
                        .IsRequired();

                    b.Navigation("Players");

                    b.Navigation("ReceivedFriendships");

                    b.Navigation("RequestedFriendships");

                    b.Navigation("Stats")
                        .IsRequired();
                });
#pragma warning restore 612, 618
        }
    }
}
