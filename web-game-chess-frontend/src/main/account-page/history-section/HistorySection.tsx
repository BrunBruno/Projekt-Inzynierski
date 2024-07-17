import { PagedResult } from "../../../shared/utils/types/commonTypes";
import { GetTypeHistoryDto } from "../../../shared/utils/types/gameDtos";
import classes from "./HistorySection.module.scss";
import { LineChart } from "@mui/x-charts";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { mainColor } from "../../../shared/utils/enums/colorMaps";
import { formatDate } from "../../../shared/utils/functions/dateTimeRelated";
import TimingTypesIcons from "../../../shared/svgs/TimingTypesIcons";

type HistorySectionProps = {
  selectedType: string | null;
  typeHistory: PagedResult<GetTypeHistoryDto> | null;
};

function HistorySection({ selectedType, typeHistory }: HistorySectionProps) {
  const theme = createTheme({
    palette: {
      mode: "dark",
    },
  });

  const createChart = (history: GetTypeHistoryDto[]) => {
    type GroupedByCreatedAt = Record<string, GetTypeHistoryDto[]>;
    const groupedByCreatedAt: GroupedByCreatedAt = history.reduce(
      (acc, currentItem) => {
        const key = currentItem.createdAt.split("T")[0];
        if (!acc[key]) acc[key] = [];

        acc[key].push(currentItem);

        return acc;
      },
      {} as GroupedByCreatedAt
    );

    const dates: string[] = Object.keys(groupedByCreatedAt);
    const labels: Date[] = dates.map((date) => new Date(date));
    const values: number[] = dates.map((date) => {
      const group = groupedByCreatedAt[date];
      const sum = group.reduce((acc, item) => acc + item.prevElo, 0);
      return Math.round(sum / group.length);
    });

    return (
      <ThemeProvider theme={theme}>
        <LineChart
          xAxis={[
            {
              data: labels,
              scaleType: "time",
              valueFormatter: (date: Date) => formatDate(date),
            },
          ]}
          series={[
            {
              data: values,
              color: mainColor.c5,
              connectNulls: true,
              label: `${selectedType} elo:`,
              showMark: false,
            },
          ]}
          grid={{ vertical: false, horizontal: true }}
          slotProps={{
            legend: {
              hidden: true,
            },
          }}
        />
      </ThemeProvider>
    );
  };

  if (
    typeHistory === null ||
    selectedType === null ||
    typeHistory.items.length === 0
  ) {
    return (
      <div className={classes.empty}>
        <span>No games were found.</span> <span>Start playing now!</span>
      </div>
    );
  }

  return (
    <div className={classes.actions}>
      <h2>
        <TimingTypesIcons
          iconName={selectedType.toLocaleLowerCase()}
          iconClass={classes["type-icon"]}
        />{" "}
        {selectedType}
      </h2>

      <div className={classes.actions__chart}>
        {createChart(typeHistory.items)}
      </div>

      <div className={classes.actions__items}>
        {typeHistory.items.reverse().map((item, index) => (
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
            <span>{item.prevElo}</span>
            <span>{item.moves}</span>
            <span>{new Date(item.createdAt).toDateString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HistorySection;