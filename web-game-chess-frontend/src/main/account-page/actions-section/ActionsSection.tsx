import { PagedResult } from "../../../shared/utils/types/commonTypes";
import { GetTypeHistoryDto } from "../../../shared/utils/types/gameDtos";
import classes from "./ActionsSection.module.scss";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  TimeSeriesScale,
  ChartOptions,
  Filler,
} from "chart.js";
import "chartjs-adapter-date-fns"; // Ensure date adapter is imported
import { Line } from "react-chartjs-2";

// Register necessary components with ChartJS
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  TimeSeriesScale,
  Filler
);

type ActionsSectionProps = {
  typeHistory: PagedResult<GetTypeHistoryDto> | null;
};

function ActionsSection({ typeHistory }: ActionsSectionProps) {
  if (typeHistory !== null && typeHistory.items.length > 0) {
    const createChart = (dataPoints: GetTypeHistoryDto[]) => {
      const chartData = {
        labels: dataPoints.map((item) =>
          new Date(item.createdAt).toLocaleDateString()
        ),
        datasets: [
          {
            label: "Line",
            data: dataPoints.map((item) => item.eloGained),
            borderColor: "rgba(75,192,192,1)",
            backgroundColor: "rgba(75,192,192,0.2)",
            fill: true,
          },
        ],
      };

      console.log(chartData);

      const options: ChartOptions<"line"> = {
        scales: {
          x: {
            type: "time",
            time: {
              unit: "day",
            },
            title: {
              display: true,
              text: "Date",
            },
          },
          y: {
            title: {
              display: true,
              text: "Points",
            },
          },
        },
      };

      return <Line data={chartData} options={options} />;
    };

    return (
      <div className={classes.actions}>
        {createChart(typeHistory.items)} {/* Render the chart */}
      </div>
    );
  }

  return <div className={classes.actions}></div>; // Render an empty div if no data or null
}

export default ActionsSection;
