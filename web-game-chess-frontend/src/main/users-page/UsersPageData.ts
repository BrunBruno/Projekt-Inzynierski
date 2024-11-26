import { GetFriendProfileDto } from "../../shared/utils/types/friendshipDtos";
import { GetOtherUserDto } from "../../shared/utils/types/userDtos";

/* prop functions */
export type CloseProfileFunc = () => void;
export type GetAllUsersFunc = () => Promise<void>;

export type SetNonFriendFunc = (user: GetOtherUserDto) => void;
export type SetFriendFunc = (friend: GetFriendProfileDto) => void;
