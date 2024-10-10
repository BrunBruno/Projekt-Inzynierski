// mockServer.ts
import { setupServer } from "msw/node";
import { rest } from "msw";
import { friendshipControllerPaths, gameControllerPaths, userControllerPaths } from "./ApiService";
import { PagedResult } from "../types/abstractDtosAndModels";
import { GetAllFriendsByStatusDto } from "../types/friendshipDtos";
import { GetEloDto, GetFullUserDto } from "../types/userDtos";
import { GetTypeHistoryDto } from "../types/gameDtos";

type CreateMockServerParams = {
  getEloDto?: GetEloDto;
  getFullUserDto?: GetFullUserDto;
  getAllFriendsByStatusDto?: GetAllFriendsByStatusDto;
  getAllFriendsByStatusDtoList?: GetAllFriendsByStatusDto[];
  getTypeHistoryDtoList?: GetTypeHistoryDto[];
};

// Function to create a mock server
export const createMockServer = (mockResult: CreateMockServerParams) => {
  return setupServer(
    rest.get(userControllerPaths.getFullUser, (_, res, ctx) => {
      if (!mockResult.getFullUserDto) return res(ctx.status(500), ctx.json(null));

      return res(ctx.status(200), ctx.json(mockResult.getFullUserDto));
    }),

    rest.get(userControllerPaths.getElo, (_, res, ctx) => {
      if (!mockResult.getFullUserDto) return res(ctx.status(500), ctx.json(null));

      return res(ctx.status(200), ctx.json(mockResult.getEloDto));
    }),

    rest.get(gameControllerPaths.getTypeHistory, (_, res, ctx) => {
      if (!mockResult.getTypeHistoryDtoList) return res(ctx.status(500), ctx.json(null));

      const response: PagedResult<GetTypeHistoryDto> = {
        items: mockResult.getTypeHistoryDtoList,
        totalPages: 1,
        itemsFrom: 1,
        itemsTo: mockResult.getTypeHistoryDtoList.length,
        totalItemsCount: mockResult.getTypeHistoryDtoList.length,
      };

      return res(ctx.status(200), ctx.json(response));
    }),

    rest.get(friendshipControllerPaths.getAllFriendsByStatus, (_, res, ctx) => {
      if (!mockResult.getAllFriendsByStatusDtoList) return res(ctx.status(500), ctx.json(null));

      const response: PagedResult<GetAllFriendsByStatusDto> = {
        items: mockResult.getAllFriendsByStatusDtoList,
        totalPages: 1,
        itemsFrom: 1,
        itemsTo: mockResult.getAllFriendsByStatusDtoList.length,
        totalItemsCount: mockResult.getAllFriendsByStatusDtoList.length,
      };

      return res(ctx.status(200), ctx.json(response));
    })
  );
};
