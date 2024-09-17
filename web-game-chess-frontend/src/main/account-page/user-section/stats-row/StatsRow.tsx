import { PieChart } from "@mui/x-charts";
import classes from "./StatsRow.module.scss";
import { GetFullUserDto } from "../../../../shared/utils/types/userDtos";
import { useEffect, useState } from "react";
import { getStatsConfig, StatsConfig } from "./StatsRowData";

type StatsRowProps = {
  // name of stats category
  type: string;
  // current user data
  user: GetFullUserDto;
};

function StatsRow({ type, user }: StatsRowProps) {
  ///

  const [config, setConfig] = useState<StatsConfig | null>(null);

  useEffect(() => {
    setConfig(getStatsConfig(type, user));
  }, [type, user]);

  if (!config) return <></>;

  return (
    <div className={classes.stats}>
      <h4 className={classes.stats__title}>{config.title}</h4>

      {/* data display */}
      <div className={classes.stats__data}>
        {config.stats.map((stat, i) => (
          <div key={i} className={classes.games}>
            <span>
              {stat.label} {stat.icon}
            </span>

            <span>{stat.value}</span>
          </div>
        ))}

        <div className={classes["chart-con"]}>
          <div className={classes.chart}>
            {config.data.reduce((sum, item) => sum + item.value, 0) !== 0 && (
              <PieChart
                className={classes["pie-chart"]}
                series={[
                  {
                    data: config.data,
                  },
                ]}
                colors={config.colors}
                slotProps={{
                  legend: {
                    hidden: true,
                  },
                }}
                margin={{ top: 2, right: 2, bottom: 2, left: 2 }}
              />
            )}
          </div>
        </div>
      </div>
      {/* --- */}
    </div>
  );
}

export default StatsRow;
