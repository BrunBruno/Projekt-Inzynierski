import { useState } from "react";
import classes from "./GameSection.module.scss";
import VsPlayerSearch from "./vs-player-search/VsPlayerSearch";
import RoundArrowSvg from "../../../shared/svgs/RoundArrowSvg";
import { greyColor } from "../../../shared/utils/enums/colorMaps";

function GameSection() {
    const [interfaceContent, setInterfaceContent] = useState<JSX.Element>(
        <></>
    );

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
                                setInterfaceContent(
                                    <VsPlayerSearch
                                        setInterfaceContent={
                                            setInterfaceContent
                                        }
                                    />
                                );
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
                                setInterfaceContent(<></>);
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
                                setInterfaceContent(<></>);
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
