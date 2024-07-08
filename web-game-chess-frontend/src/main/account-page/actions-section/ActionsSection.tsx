import { PagedResult } from "../../../shared/utils/types/commonTypes";
import { GetTypeHistoryDto } from "../../../shared/utils/types/gameDtos";
import classes from "./ActionsSection.module.scss";
import { LineChart } from "@mui/x-charts";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { mainColor } from "../../../shared/utils/enums/colorMaps";

type ActionsSectionProps = {
  typeHistory: PagedResult<GetTypeHistoryDto> | null;
};

function ActionsSection({ typeHistory }: ActionsSectionProps) {
  if (typeHistory !== null && typeHistory.items.length > 0) {
    const theme = createTheme({
      palette: {
        mode: "dark",
      },
    });

    const createChart = (history: GetTypeHistoryDto[]) => {
      type GroupedByCreatedAt = Record<string, GetTypeHistoryDto[]>;
      const groupedByCreatedAt: GroupedByCreatedAt = history.reduce(
        (acc, currentItem) => {
          const key = currentItem.createdAt.split("T")[1];
          if (!acc[key]) {
            acc[key] = [];
          }
          acc[key].push(currentItem);
          return acc;
        },
        {} as GroupedByCreatedAt
      );

      const dates: string[] = Object.keys(groupedByCreatedAt);
      const labels: number[] = dates.map((_, i) => i);
      const values: number[] = dates
        .map((date) => {
          const group = groupedByCreatedAt[date];
          const sum = group.reduce((acc, item) => acc + item.prevElo, 0);
          return Math.round(sum / group.length);
        })
        .reverse();

      return (
        <ThemeProvider theme={theme}>
          <LineChart
            xAxis={[{ data: labels }]}
            series={[{ data: values, color: mainColor.c5 }]}
            grid={{ vertical: true, horizontal: true }}
          />
        </ThemeProvider>
      );
    };

    return (
      <div className={classes.actions}>
        <div className={classes.actions__chart}>
          {createChart(typeHistory.items)}
        </div>

        <div className={classes.actions__items}>
          {typeHistory.items.map((item, index) => (
            <div
              key={index}
              className={`
              ${classes.actions__items__record}
              ${
                item.isWinner === null
                  ? ""
                  : item.isWinner === true
                  ? classes.win
                  : classes.lose
              }
              `}
            >
              <span>
                {item.whitePlayer} vs {item.blackPlayer}
              </span>
              <span>{item.moves}</span>
              <span>{item.prevElo}</span>
              <span>{new Date(item.createdAt).toDateString()}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return <div className={classes.actions}></div>;
}

export default ActionsSection;
