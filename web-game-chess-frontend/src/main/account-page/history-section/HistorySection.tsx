import { GetTypeHistoryDto } from "../../../shared/utils/types/webGameDtos";
import classes from "./HistorySection.module.scss";
import { LineChart } from "@mui/x-charts";
import { Theme, ThemeProvider, createTheme } from "@mui/material/styles";
import { mainColor } from "../../../shared/utils/objects/colorMaps";
import { formatDate } from "../../../shared/utils/functions/datetime";
import { PagedResult } from "../../../shared/utils/types/abstractDtosAndModels";
import IconCreator from "../../../shared/components/icon-creator/IconCreator";
import { timingTypeIcons } from "../../../shared/svgs/iconsMap/TimingTypeIcons";
import HistoryRecord from "./history-record/HistoryRecord";
import { TimingTypeName } from "../../../shared/utils/objects/constantLists";
import { useEffect, useState } from "react";
import HistoryEmpty from "./history-empty/HistoryEmpty";

type HistorySectionProps = {
  // game type name
  selectedType: TimingTypeName;
  // paged result of type history dtos
  typeHistory: PagedResult<GetTypeHistoryDto> | null;
};

function HistorySection({ selectedType, typeHistory }: HistorySectionProps) {
  ///

  // chart data
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
  const createChart = (history: GetTypeHistoryDto[]): JSX.Element => {
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

  // render placeholder
  if (!typeHistory || !selectedType || typeHistory.items.length === 0) {
    return <HistoryEmpty />;
  }

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
