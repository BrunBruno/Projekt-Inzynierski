﻿
using chess.Application.Repositories;
using chess.Core.Entities;
using chess.Core.Enums;
using chess.Infrastructure.Contexts;
using Microsoft.EntityFrameworkCore;

namespace chess.Infrastructure.Repositories;

public class FriendshipRepository : IFriendshipRepository {

    private readonly ChessAppDbContext _dbContext;

    public FriendshipRepository(ChessAppDbContext dbContext) {
        _dbContext = dbContext;
    }

    ///<inheritdoc/>
    public async Task<List<Friendship>> GetAllForUserByStatus(Guid userId, FriendshipStatus status)
        => await _dbContext.Friendships
                    .Where(f => (f.RequestorId == userId || f.ReceiverId == userId) && f.Status == status)
                    .ToListAsync();

    ///<inheritdoc/>
    public async Task<List<Guid>> GetAllFriendIds(Guid userId) 
        => await _dbContext.Friendships
                    .Where(f => f.RequestorId == userId || f.ReceiverId == userId)
                    .Select(f => f.RequestorId == userId ? f.ReceiverId : f.RequestorId)
                    .ToListAsync();

    ///<inheritdoc/>
    public async Task<Friendship?> GetById(Guid friendshipId)
        => await _dbContext.Friendships
                    .FirstOrDefaultAsync(f => f.Id == friendshipId);

    ///<inheritdoc/>
    public async Task Create(Friendship friendship) {
        await _dbContext.Friendships.AddAsync(friendship);
        await _dbContext.SaveChangesAsync();
    }

    ///<inheritdoc/>
    public async Task Update(Friendship friendship) {
        _dbContext.Friendships.Update(friendship);
        await _dbContext.SaveChangesAsync();
    }

    public async Task Delete(Friendship friendship) {
        _dbContext.Friendships.Remove(friendship);
        await _dbContext.SaveChangesAsync();
    }
}
