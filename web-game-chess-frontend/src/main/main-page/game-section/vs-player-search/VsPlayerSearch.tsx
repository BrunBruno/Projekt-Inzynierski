import axios from 'axios';
import classes from './VsPlayerSearch.module.scss';
import {
  gameControllerPaths,
  getAuthorization,
} from '../../../../shared/utils/functions/apiFunctions';
import { timingTypes } from '../../../../shared/utils/enums/gameTimingEnum';
import LoadingPage from '../../../../shared/components/loading-page/LoadingPage';
import { useEffect, useRef, useState } from 'react';
import * as signalR from '@microsoft/signalr';
import { gameHubUrl } from '../../../../shared/utils/functions/signalRFunctions';
import { defaultTimeControls } from './VsPlayerSearchObjects';
import { SearchGameDto } from '../../../../shared/utils/types/gameDtos';

type VsPlayerSearchProps = {};

function VsPlayerSearch({}: VsPlayerSearchProps) {
  const connectionRef = useRef<signalR.HubConnection | null>(null);

  const [searchIds, setSearchIds] = useState<SearchGameDto | null>(null);

  const connectionInit = async () => {
    const builder = new signalR.HubConnectionBuilder().withUrl(gameHubUrl, {
      skipNegotiation: true,
      transport: signalR.HttpTransportType.WebSockets,
    });

    const connection = builder.build();

    connectionRef.current = connection;

    await connection.start();
  };

  useEffect(() => {
    connectionInit();
  }, []);

  const onSearchForGame = async (header: string, values: number[]) => {
    const typeValue = timingTypes[header];

    const gameType = {
      type: typeValue,
      minutes: values[0],
      increment: values[1],
    };

    try {
      const searchGameResponse = await axios.post<SearchGameDto>(
        gameControllerPaths.startSearch,
        gameType,
        getAuthorization()
      );

      setSearchIds(searchGameResponse.data);

      if (connectionRef.current) {
        connectionRef.current.invoke(
          'PlayerJoined',
          searchGameResponse.data.timingId
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  if (!connectionRef.current) {
    return <LoadingPage />;
  }

  return (
    <div className={classes.search}>
      <div className={classes.search__grid}>
        {defaultTimeControls.map((control, index) => (
          <div key={index} className={classes.search__grid__row}>
            <div className={classes.search__grid__row__header}>
              {control.header}
            </div>
            {control.tags.map((tag, i) => (
              <div
                key={i}
                className={classes.search__grid__row__block}
                onClick={() => {
                  onSearchForGame(control.header, control.values[i]);
                }}
              >
                {tag}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default VsPlayerSearch;
