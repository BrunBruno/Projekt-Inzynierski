import { useEffect, useState } from "react";
import classes from "./Searching.module.scss";
import SearchingPawn from "./SearchingPawn";
import axios from "axios";
import {
    gameControllerPaths,
    getAuthorization,
} from "../../../../shared/utils/functions/apiFunctions";
import { SearchGameDto } from "../../../../shared/utils/types/gameDtos";
import { gameSearchInterface } from "../../../../shared/utils/enums/gameSeachEnum";

const numOfPawns = 8;

type SearchingProps = {
    connection: signalR.HubConnection | null;
    setInterfaceById: (interfaceId: number) => void;
    searchIds: SearchGameDto | null;
    setSearchIds: React.Dispatch<React.SetStateAction<SearchGameDto | null>>;
};

function Searching({
    connection,
    setInterfaceById,
    searchIds,
    setSearchIds,
}: SearchingProps) {
    const [activeIndex, setActiveIndex] = useState<number>(0);
    const [pause, setPause] = useState<boolean>(false);

    useEffect(() => {
        const delay = 100;
        const firstintervalId = setInterval(() => {
            setActiveIndex((prevIndex) => (prevIndex + 1) % numOfPawns);
        }, delay);

        setTimeout(() => {
            setPause(true);

            clearInterval(firstintervalId);
        }, delay * numOfPawns);

        const intervalId = setInterval(
            () => {
                setPause(false);
                const innerintervalId = setInterval(() => {
                    setActiveIndex((prevIndex) => (prevIndex + 1) % numOfPawns);
                }, delay);
                setTimeout(() => {
                    setPause(true);
                    clearInterval(innerintervalId);
                }, delay * numOfPawns);
            },
            1000 + delay * numOfPawns
        );

        return () => {
            clearInterval(firstintervalId);
            clearInterval(intervalId);
        };
    }, []);

    useEffect(() => {
        return () => {
            // add here onCancelSearch when not strick mode
            // onCancelSearch();
        };
    }, []);

    const onCancelSearch = async () => {
        if (!searchIds || !connection) {
            return;
        }

        try {
            await axios.delete(
                gameControllerPaths.abortSearch(searchIds.playerId),
                getAuthorization()
            );

            connection.invoke("PlayerLeaved", searchIds.timingId);

            setSearchIds(null);

            setInterfaceById(gameSearchInterface.vsPlayer);
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className={classes.searching}>
            <div className={classes.searching__content}>
                <div className={classes.searching__content__text}>
                    <h1>Searching for Game</h1>
                </div>
                <div className={classes.searching__content__indicator}>
                    {Array.from({ length: numOfPawns }).map((_, index) => (
                        <SearchingPawn
                            key={index}
                            active={index === activeIndex && !pause}
                        />
                    ))}
                </div>
                <button
                    className={classes.cancel}
                    onClick={() => {
                        onCancelSearch();
                    }}
                >
                    Cancel
                </button>
            </div>
        </div>
    );
}

export default Searching;
