import { useEffect, useRef, useState } from "react";
import classes from "./GameSection.module.scss";
import VsPlayerSearch from "./vs-player-search/VsPlayerSearch";
import RoundArrowSvg from "../../../shared/svgs/RoundArrowSvg";
import { greyColor } from "../../../shared/utils/enums/colorMaps";
import * as signalR from "@microsoft/signalr";
import { gameHubUrl } from "../../../shared/utils/functions/signalRFunctions";
import axios from "axios";
import {
    gameControllerPaths,
    getAuthorization,
} from "../../../shared/utils/functions/apiFunctions";
import { gameSearchInterface } from "../../../shared/utils/enums/gameSeachEnum";
import {
    CheckIfInGameDto,
    SearchGameDto,
} from "../../../shared/utils/types/gameDtos";
import Searching from "./searching/Searching";
import { useNavigate } from "react-router-dom";

function GameSection() {
    const navigate = useNavigate();

    const connectionRef = useRef<signalR.HubConnection | null>(null);

    const [interfaceContent, setInterfaceContent] = useState<JSX.Element>(
        <></>
    );
    const [searchIds, setSearchIds] = useState<SearchGameDto | null>(null);

    const connectionInit = async () => {
        const builder = new signalR.HubConnectionBuilder().withUrl(gameHubUrl, {
            skipNegotiation: true,
            transport: signalR.HttpTransportType.WebSockets,
        });

        const connection = builder.build();

        connectionRef.current = connection;

        await connection.start();
    };

    useEffect(() => {
        connectionInit();
    }, []);

    const setInterfaceById = (interfaceId: number) => {
        switch (interfaceId) {
            case gameSearchInterface.vsPlayer:
                setInterfaceContent(
                    <VsPlayerSearch
                        connection={connectionRef.current}
                        setSearchIds={setSearchIds}
                    />
                );
                break;
            case gameSearchInterface.vsComputer:
                setInterfaceContent(<></>);
                break;
            case gameSearchInterface.vsFriend:
                setInterfaceContent(<></>);
                break;
            case gameSearchInterface.searching:
                setInterfaceContent(
                    <Searching
                        connection={connectionRef.current}
                        setInterfaceById={setInterfaceById}
                        searchIds={searchIds}
                        setSearchIds={setSearchIds}
                    />
                );
                break;
        }
    };

    useEffect(() => {
        const handleGamesChanged = async () => {
            console.log("GamesChanged");

            if (searchIds !== null) {
                const isInGameResponse = await axios.get<CheckIfInGameDto>(
                    gameControllerPaths.checkIfInGame(searchIds.playerId),
                    getAuthorization()
                );

                console.log(isInGameResponse.data);

                if (isInGameResponse.data.isInGame) {
                    navigate(`game/${isInGameResponse.data.gameId}`);
                }
            }
        };

        if (searchIds !== null) {
            setInterfaceById(gameSearchInterface.searching);
        }

        if (connectionRef.current) {
            connectionRef.current.on("GamesChanged", handleGamesChanged);
        }

        return () => {
            if (connectionRef.current) {
                connectionRef.current.off("GamesChanged", handleGamesChanged);
            }
        };
    }, [searchIds]);

    return (
        <section className={classes.game}>
            <div className={classes.game__content}>
                <div className={classes.game__content__col}>
                    <div className={classes["game-interface"]}>
                        {interfaceContent}
                    </div>
                </div>
                <div className={classes.game__content__col}>
                    <div className={classes["game-buttons"]}>
                        <button
                            onClick={() => {
                                setInterfaceById(gameSearchInterface.vsPlayer);
                            }}
                        >
                            <RoundArrowSvg
                                color={greyColor.c0}
                                iconClass={classes["button-icon"]}
                            />
                            <span>Play vs Player</span>
                        </button>
                        <button
                            onClick={() => {
                                setInterfaceById(
                                    gameSearchInterface.vsComputer
                                );
                            }}
                        >
                            <RoundArrowSvg
                                color={greyColor.c0}
                                iconClass={classes["button-icon"]}
                            />
                            <span>Play vs Computer</span>
                        </button>
                        <button
                            onClick={() => {
                                setInterfaceById(gameSearchInterface.vsFriend);
                            }}
                        >
                            <RoundArrowSvg
                                color={greyColor.c0}
                                iconClass={classes["button-icon"]}
                            />
                            <span>Play vs Friend</span>
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default GameSection;
