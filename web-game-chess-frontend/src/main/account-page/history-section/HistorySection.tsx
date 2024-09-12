import { GetTypeHistoryDto } from "../../../shared/utils/types/gameDtos";
import classes from "./HistorySection.module.scss";
import { LineChart } from "@mui/x-charts";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { mainColor } from "../../../shared/utils/enums/colorMaps";
import { formatDate } from "../../../shared/utils/functions/dateTimeRelated";
import { PagedResult } from "../../../shared/utils/types/abstractDtosAndModels";
import IconCreator from "../../../shared/components/icon-creator/IconCreator";
import { timingTypesIcons } from "../../../shared/svgs/iconsMap/TimingTypesIcons";
import HistoryRecord from "./history-record/HistoryRecord";

type HistorySectionProps = {
  // game type name
  selectedType: string | null;
  // paged result of type history dtos
  typeHistory: PagedResult<GetTypeHistoryDto> | null;
};

function HistorySection({ selectedType, typeHistory }: HistorySectionProps) {
  ///

  const theme = createTheme({
    palette: {
      mode: "dark",
    },
  });

  // to create line chart for selected game timing type
  const createChart = (history: GetTypeHistoryDto[]) => {
    type GroupedByCreatedAt = Record<string, GetTypeHistoryDto[]>;
    const groupedByCreatedAt: GroupedByCreatedAt = history.reduce((acc, currentItem) => {
      const key = currentItem.createdAt.toString().split("T")[0];
      if (!acc[key]) acc[key] = [];

      acc[key].push(currentItem);

      return acc;
    }, {} as GroupedByCreatedAt);

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
  //*/

  // render placeholder
  if (typeHistory === null || selectedType === null || typeHistory.items.length === 0) {
    return (
      <div className={classes.empty}>
        <div className={classes.empty__chart}>
          <ThemeProvider theme={theme}>
            <LineChart
              xAxis={[
                {
                  data: [0, 1, 2, 3, 4],
                },
              ]}
              series={[
                {
                  data: [1000, 1200, 800, 1400, 1700],
                  area: true,
                  color: mainColor.c5,
                  connectNulls: true,
                  showMark: false,
                },
              ]}
              grid={{ vertical: true, horizontal: true }}
              slotProps={{
                legend: {
                  hidden: true,
                },
              }}
            />
          </ThemeProvider>
        </div>

        <div className={classes.empty__text}>
          <span>No games found.</span>
          <span>Play one now!</span>
        </div>
      </div>
    );
  }
  //*/

  return (
    <div className={classes.actions}>
      <h2 className={classes["history-title"]}>
        <IconCreator
          icons={timingTypesIcons}
          iconName={selectedType.toLocaleLowerCase()}
          iconClass={classes["type-icon"]}
        />
        <span>{selectedType}</span>
      </h2>

      <div className={classes.actions__chart}>{createChart(typeHistory.items)}</div>

      <div className={classes.actions__items}>
        {typeHistory.items.reverse().map((item, index) => (
          <HistoryRecord key={index} item={item} />
        ))}
      </div>
    </div>
  );
}

export default HistorySection;
