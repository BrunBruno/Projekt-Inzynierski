import { TimingType } from "../../shared/utils/objects/entitiesEnums";
import { AccountPageInterface } from "../../shared/utils/objects/interfacesEnums";

// function args for updating and deleting images
export type UpdateUserFunctionProps = {
  clearImage?: boolean;
  clearBackground?: boolean;
};

/* prop functions */
export type FetchDataFunc = () => void;
export type SetSelectedContentFunc = (interfaceId: AccountPageInterface, type?: TimingType) => void;

// from FriendsSection
export type ClearSelectionFunc = () => void;
