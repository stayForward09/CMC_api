import { useEffect, useState } from "react";

const Table = () => {
  const [coinsData, setCoinsData] = useState([]);
  const [btcData, setBTCdata] = useState({
    "p3min" : 0,
    "p5m" : 0,
    "p15m" : 0,
    "p1h" : 0,
    "p4h" : 0,
  })

  const fetchCoinsData = () => {
    fetch("http://127.0.0.1:5000/data")
      .then((response) => response.json())
      .then((data) => {
        setCoinsData(data);
      })
      .catch((err) => {
        console.log(err, "3");
      });
  };
  useEffect(() => {
    fetchCoinsData();

    const intervalId = setInterval(fetchCoinsData, 3000);

    return () => {
      clearInterval(intervalId); // Cleanup: clear the interval when the component unmounts
    };
  }, []);

  useEffect(() => {
    setBTCdata({
      p3min : coinsData[0]?.volatility_data?.p3min,
      p5m : coinsData[0]?.volatility_data?.p5m,
      p15m : coinsData[0]?.volatility_data?.p15m,
      p1h : coinsData[0]?.volatility_data?.p1h,
      p4h : coinsData[0]?.volatility_data?.p4h
    })
  }, [coinsData])

  return (
    <div>
        <div className="setting-body">
            <div className="setting-table-header">
                RECORD TABLE
            </div>
            <div className="setting-table">
                <table >
                    <thead>
                        <tr>
                            <th rowSpan={2} style={{width:"5%", verticalAlign:"bottom"}}>
                                Coins
                            </th>
                            <th colSpan={5} style={{width:"25%"}}>
                                %change
                            </th>
                            <th rowSpan={2} style={{width:"10%", verticalAlign:"bottom"}}>
                                %change volume
                            </th>
                            <th rowSpan={2} style={{width:"10%", verticalAlign:"bottom"}}>
                                Candle count 7 days
                            </th>
                            <th rowSpan={2} style={{width:"10%", verticalAlign:"bottom"}}>
                                Candle count 14 days
                            </th>
                            <th rowSpan={2} style={{width:"10%", verticalAlign:"bottom"}}>
                                Market cap
                            </th>
                            <th colSpan={5} style={{width:"30%"}}>
                                %change BTC
                            </th>
                        </tr>
                        <tr>
                            <th>3’</th>
                            <th>5’</th>
                            <th>15’</th>
                            <th>1H</th>
                            <th>4H</th>
                            <th>3’</th>
                            <th>5’</th>
                            <th>15’</th>
                            <th>1H</th>
                            <th>4H</th>
                        </tr>
                    </thead>
                    <tbody style={{fontWeight:"600"}}>
                      {coinsData.map((coin, index) => (
                        <tr key={index}>
                          <td>{coin?.symbol}</td>
                          <td>{coin?.volatility_data?.p3min?.toFixed(2)}</td>
                          <td>{coin?.volatility_data?.p5m?.toFixed(2)}</td>
                          <td>{coin?.volatility_data?.p15m?.toFixed(2)}</td>
                          <td>{coin?.volatility_data?.p1h?.toFixed(2)}</td>
                          <td>{coin?.volatility_data?.p4h?.toFixed(2)}</td>
                          <td>{coin?.volume_record?.toFixed(2)}</td>
                          <td>{coin?.candle_count_7?.toFixed(2)}</td>
                          <td>{coin?.candle_count_14?.toFixed(2)}</td>
                          <td>{coin?.volatility_data?.mc?.toFixed(2)}</td>
                          <td>{coin?.volatility_data?.p3min && (btcData.p3min - coin.volatility_data.p3min)}</td>
                          <td>{coin?.volatility_data?.p5m && (btcData.p5m - coin.volatility_data.p5m)}</td>
                          <td>{coin?.volatility_data?.p15m && (btcData.p15m - coin.volatility_data.p15m)}</td>
                          <td>{coin?.volatility_data?.p1h && (btcData.p1h - coin.volatility_data.p1h)}</td>
                          <td>{coin?.volatility_data?.p4h && (btcData.p4h - coin.volatility_data.p4h)}</td>
                        </tr>
                      ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  );
};

export default Table;
