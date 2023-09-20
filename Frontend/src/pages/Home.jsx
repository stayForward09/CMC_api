import "../component/home.css"
import { Link } from "react-router-dom"

const Home = ({child, subroute}) => {
    
    return (
        <div>
            <div className="record-header">
                <div className="record-header-items">
                    <button style={{background:"transparent"}}>
                        <Link to="/Home/Record_Table">RECORD TABLE</Link>
                    </button>
                    <button>
                        <Link to="/Home/My_Account">MY ACCOUNT</Link>
                    </button>
                    <button>
                        <Link to={"/Home/Settings"}>SETTINGS</Link>
                    </button>
                    <button>
                        <Link t0="/Home/History_Notification">HISTORY NOTIFICATION</Link>
                    </button>
                </div>
            </div>
            <div className="route-bar">
                {subroute}
            </div>
            {child}
        </div>
    )
}

export default Home