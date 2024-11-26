import classes from "./HistoryEmpty.module.scss";
import { LineChart } from "@mui/x-charts";
import { Theme, ThemeProvider, createTheme } from "@mui/material/styles";
import { mainColor } from "../../../../shared/utils/objects/colorMaps";

type HistoryEmptyProps = {};

function HistoryEmpty({}: HistoryEmptyProps) {
  ///

  const theme: Theme = createTheme({
    palette: {
      mode: "dark",
    },
  });

  // render placeholder
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

export default HistoryEmpty;
