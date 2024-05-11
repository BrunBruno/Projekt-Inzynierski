import axios from "axios";
import classes from "./VsPlayerSearch.module.scss";
import {
    gameControllerPaths,
    getAuthorization,
} from "../../../../shared/utils/functions/apiFunctions";
import { timingTypes } from "../../../../shared/utils/enums/gameTimingEnum";
import { useEffect, useRef, useState } from "react";
import * as signalR from "@microsoft/signalr";
import { gameHubUrl } from "../../../../shared/utils/functions/signalRFunctions";
import { defaultTimeControls } from "./VsPlayerSearchObjects";
import { SearchGameDto } from "../../../../shared/utils/types/gameDtos";
import VsPlayerSearchIcons from "./VsPlayerSearchIcons";
import Searching from "../searching/Searching";

type VsPlayerSearchProps = {
    setInterfaceContent: React.Dispatch<React.SetStateAction<JSX.Element>>;
};

function VsPlayerSearch({ setInterfaceContent }: VsPlayerSearchProps) {
    const connectionRef = useRef<signalR.HubConnection | null>(null);

    const [searchIds, setSearchIds] = useState<SearchGameDto | null>(null);

    const [] = useState();

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

    const onSearchForGame = async (header: string, values: number[]) => {
        setInterfaceContent(<Searching />);

        const typeValue = timingTypes[header];

        const gameType = {
            type: typeValue,
            minutes: values[0],
            increment: values[1],
        };

        try {
            const searchGameResponse = await axios.post<SearchGameDto>(
                gameControllerPaths.startSearch,
                gameType,
                getAuthorization()
            );

            setSearchIds(searchGameResponse.data);

            if (connectionRef.current) {
                connectionRef.current.invoke(
                    "PlayerJoined",
                    searchGameResponse.data.timingId
                );
            }
        } catch (err) {
            console.log(err);
        }
    };

    const transformTag = (tag: string): JSX.Element => {
        const transformedTag: JSX.Element[] = [];

        for (let i = 0; i < tag.length; i++) {
            const char = tag[i];
            if (char === "|") {
                transformedTag.push(
                    <p key={`tag${i}`} className={classes.sep}>
                        {char}
                    </p>
                );
            } else if (!isNaN(parseInt(char))) {
                transformedTag.push(
                    <p key={`tag${i}`} className={classes.num}>
                        {char}
                    </p>
                );
            } else {
                transformedTag.push(
                    <p key={`tag${i}`} className={classes.char}>
                        {char}
                    </p>
                );
            }
        }

        return <div className={classes["timing-tag"]}>{transformedTag}</div>;
    };

    return (
        <div className={classes.search}>
            <div className={classes.search__grid}>
                <div className={classes.search__grid__header}>
                    <span>Select Time Control</span>
                </div>
                {defaultTimeControls.map((control, index) => (
                    <div key={index} className={classes.search__grid__row}>
                        <div className={classes.search__grid__row__header}>
                            <VsPlayerSearchIcons
                                iconName={control.header.toLocaleLowerCase()}
                            />
                            {control.header}
                        </div>
                        {control.tags.map((tag, i) => (
                            <div
                                key={i}
                                className={classes.search__grid__row__block}
                                onClick={() => {
                                    onSearchForGame(
                                        control.header,
                                        control.values[i]
                                    );
                                }}
                            >
                                {transformTag(tag)}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default VsPlayerSearch;
