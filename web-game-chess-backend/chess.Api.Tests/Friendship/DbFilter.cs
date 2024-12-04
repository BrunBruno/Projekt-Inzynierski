
using chess.Core.Entities;
using chess.Core.Enums;
using chess.Infrastructure.Contexts;

namespace chess.Api.Tests.Friendship;

internal static partial class DbFilter {

    /// <summary>
    /// To add both users for friendship
    /// </summary>
    /// <param name="dbContext"></param>
    /// <param name="friendId"></param>
    /// <returns></returns>
    internal static async Task AddUsers(this ChessAppDbContext dbContext, Guid friendId) {

        var requestor = new Core.Entities.User
        {
            Id = Guid.Parse(Constants.UserId),
            Email = "requestor@test.com",
            Username = "Requestor",
            PasswordHash = Constants.PasswordHash,

            Elo = new UserElo() {
                Id = Guid.NewGuid(),
                UserId = Guid.Parse(Constants.UserId),
            },
            Stats = new UserStats() {
                Id = Guid.NewGuid(),
                UserId = Guid.Parse(Constants.UserId),
            },
        };

        var receiver = new Core.Entities.User
        {
            Id = friendId,
            Email = "receiver@test.com",
            Username = "Receiver",
            PasswordHash = Constants.PasswordHash,

            Elo = new UserElo()
            {
                Id = Guid.NewGuid(),
                UserId = friendId,
            },
            Stats = new UserStats()
            {
                Id = Guid.NewGuid(),
                UserId = friendId,
            },
        };

        await dbContext.Users.AddAsync(requestor);
        await dbContext.Users.AddAsync(receiver);
        await dbContext.SaveChangesAsync();
    }

    /// <summary>
    /// To add friendship for selected users
    /// </summary>
    /// <param name="dbContext"></param>
    /// <param name="friendshipId"></param>
    /// <param name="requestorId"></param>
    /// <param name="receiverId"></param>
    /// <param name="status"></param>
    /// <returns></returns>
    internal static async Task AddFriendship(this ChessAppDbContext dbContext, Guid friendshipId, Guid requestorId, Guid receiverId, FriendshipStatus status) {

        var friendship = new Core.Entities.Friendship()
        {
            Id = friendshipId,
            Status = status,
            RequestorId = requestorId,
            ReceiverId = receiverId,
            Stats = new FriendshipStats(),
        };

        await dbContext.Friendships.AddAsync(friendship);
        await dbContext.SaveChangesAsync();
    }

    /// <summary>
    /// To add many friendships
    /// </summary>
    /// <param name="dbContext"></param>
    /// <returns></returns>
    internal static async Task AddUsersAndFriendships(this ChessAppDbContext dbContext) {

        var users = new List<Core.Entities.User>();
        var friendships = new List<Core.Entities.Friendship>();

        for (int i = 0; i < 20; i++) {

            Guid userId = Guid.NewGuid();

            users.Add(new Core.Entities.User()
            {
                Id = userId,
                Email = $"{RandomString(10)}@test.com",
                Username = i == 1 ? "friend" : RandomString(10), // for filtering with name
                PasswordHash = Constants.PasswordHash,
                JoinDate = DateTime.UtcNow,
                IsVerified = true,
                Elo = new UserElo(),
                Stats = new UserStats(),
                Settings = new UserSettings(),
            });

            if (i % 2 == 0) {
                friendships.Add(new Core.Entities.Friendship() { 
                    Id = Guid.NewGuid(),
                    ReceiverId = userId,
                    RequestorId = Guid.Parse(Constants.UserId),
                    Status = FriendshipStatus.Accepted,
                    Stats = new FriendshipStats(),
                });
            }

            if (i == 19) {
                friendships.Add(new Core.Entities.Friendship()
                {
                    Id = Guid.NewGuid(),
                    ReceiverId = userId,
                    RequestorId = Guid.Parse(Constants.UserId),
                    Status = FriendshipStatus.Rejected,
                    Stats = new FriendshipStats(),
                });
            }
        }

        await dbContext.Users.AddRangeAsync(users);
        await dbContext.Friendships.AddRangeAsync(friendships);
        await dbContext.SaveChangesAsync();
    }

    private static string RandomString(int length) {
        var random = new Random();

        const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

        return new string(Enumerable.Repeat(chars, length)
            .Select(s => s[random.Next(s.Length)]).ToArray());
    }
}
