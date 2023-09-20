import { Link } from "react-router-dom"
import "../component/home.css"

const coins = ["AXS", "BNB", "DOGE", "ETH", "SHIB", "XRP", "ADA", "SOL"]
const change_3 = [1, 0.2, 0.05, 0.1, 1, 0.2, 0.05, 0.1];
const change_5 = [2, 0.4, 0.1, 0.3, 2, 0.4, 0.1, 0.3];
const change_15 = [3, 0.1, 2, 0.4, 3, 0.1, 2, 0.4];
const change_1 = [4, 0.7, 4, 1, 4, 0.7, 4, 1];
const change_4 = [5, 1, 7, 1.2, 5, 1, 7, 1.2];
const change_vol = [5, 10, 3, 2, 5, 10, 3, 2];
const candle_7 = [1, 1, 10, 4, 1, 1, 10, 4];
const candle_14 = [2, 9, 20, 7, 2, 9, 20, 7];
const market_cap = [50, 40, 200, 100, 50, 40, 200, 100];
const change_b3 = [0.2, 0.5, 0.4, -0.2, 0.2, 0.5, 0.4, 0];
const change_b5 = [0.3, -0.3, 0.5, 0.8, 0.3, -0.3, 0.5, 0.8];
const change_b15 = [0.4, 0.4, 0.4, -0.4, 0.4, 0.4, 0.4, -0.4];
const change_b1 = [0.7, -0.8, 0.3, 0.5, 0.7, -0.8, 0.3, 0.5];
const change_b4 = [0.8, 0.8, 0.5, 0.3, 0.8, 0.8, 0.5, 0.3]


const LandingPage = () => {


    return (
        <div>
            <div className="header">
                <div className="header-items">
                    <Link to={"/signup"} style={{ paddingRight: "20px", color: "white" }}>Sign Up</Link>
                    <Link to={"/login"} style={{ paddingLeft: "20px", color: "white" }}> Log in</Link>
                </div>
            </div>
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
                            {coins.map((coin, index) => (
                                <tr key={index}>
                                    <td>{coin}</td>
                                    <td>{change_3[index]}</td>
                                    <td>{change_5[index]}</td>
                                    <td>{change_15[index]}</td>
                                    <td>{change_1[index]}</td>
                                    <td>{change_4[index]}</td>
                                    <td>{change_vol[index]}</td>
                                    <td>{candle_7[index]}</td>
                                    <td>{candle_14[index]}</td>
                                    <td>{market_cap[index]}</td>
                                    <td>{change_b3[index]}</td>
                                    <td>{change_b5[index]}</td>
                                    <td>{change_b15[index]}</td>
                                    <td>{change_b1[index]}</td>
                                    <td>{change_b4[index]}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default LandingPage;