import { useEffect, useState } from "react";
import classes from "./Searching.module.scss";
import SearchingPawn from "./SearchingPawn";

const numOfPawns = 8;

function Searching() {
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
            </div>
        </div>
    );
}

export default Searching;
