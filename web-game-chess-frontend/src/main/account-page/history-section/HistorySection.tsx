import { GetTypeHistoryDto } from "../../../shared/utils/types/gameDtos";
import classes from "./HistorySection.module.scss";
import { LineChart } from "@mui/x-charts";
import { Theme, ThemeProvider, createTheme } from "@mui/material/styles";
import { mainColor } from "../../../shared/utils/objects/colorMaps";
import { formatDate } from "../../../shared/utils/functions/datetime";
import { PagedResult } from "../../../shared/utils/types/abstractDtosAndModels";
import IconCreator from "../../../shared/components/icon-creator/IconCreator";
import { timingTypeIcons } from "../../../shared/svgs/iconsMap/TimingTypeIcons";
import HistoryRecord from "./history-record/HistoryRecord";
import { TimingTypeName, timingTypeNames } from "../../../shared/utils/objects/constantLists";
import { useEffect, useState } from "react";

type HistorySectionProps = {
  // game type name
  selectedType: (typeof timingTypeNames)[number];
  // paged result of type history dtos
  typeHistory: PagedResult<GetTypeHistoryDto> | null;
};

function HistorySection({ selectedType, typeHistory }: HistorySectionProps) {
  ///

  const [data, setData] = useState<GetTypeHistoryDto[]>([]);

  useEffect(() => {
    if (!typeHistory) return;

    setData(typeHistory.items.reverse());
  }, [typeHistory]);

  const theme: Theme = createTheme({
    palette: {
      mode: "dark",
    },
  });

  // to create line chart for selected game timing type
  const createChart = (history: GetTypeHistoryDto[]) => {
    type GroupedByCreatedAt = Record<string, GetTypeHistoryDto[]>;

    const groupedByCreatedAt: GroupedByCreatedAt = history.reduce(
      (acc: Record<string, GetTypeHistoryDto[]>, currentItem: GetTypeHistoryDto) => {
        const key = currentItem.createdAt.toString().split("T")[0];
        if (!acc[key]) acc[key] = [];

        acc[key].push(currentItem);

        return acc;
      },
      {} as GroupedByCreatedAt
    );

    let dates: string[];
    let labels: Date[];
    let values: number[];

    if (Object.keys(groupedByCreatedAt).length === 1) {
      dates = history.map((hist) => hist.createdAt.toString());
      labels = history.map((hist) => new Date(hist.createdAt));
      values = history.map((hist) => hist.prevElo);
    } else {
      dates = Object.keys(groupedByCreatedAt);
      labels = dates.map((date: string) => new Date(date));

      values = dates.map((date: string) => {
        const group = groupedByCreatedAt[date];
        const sum = group.reduce((acc: number, item: GetTypeHistoryDto) => acc + item.prevElo, 0);

        return Math.round(sum / group.length);
      });
    }

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
    <div data-testid="account-page-history-section" className={classes.history}>
      <h2 className={classes["history-title"]}>
        <IconCreator
          icons={timingTypeIcons}
          iconName={selectedType.toLocaleLowerCase() as TimingTypeName}
          iconClass={classes["type-icon"]}
          color={mainColor.c0}
        />
        <span>{selectedType} timeline</span>
      </h2>

      <div className={classes.history__chart}>{createChart(typeHistory.items)}</div>

      <div className={classes.history__items}>
        <HistoryRecord item={null} />

        {data.map((item: GetTypeHistoryDto, index: number) => (
          <HistoryRecord key={`history-record-${index}`} item={item} />
        ))}
      </div>
    </div>
  );
}

export default HistorySection;
