import "./App.css";
import { Routes, Route } from "react-router-dom";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Verify from "./pages/Verify";
import LandingPage from "./pages/LandingPage";
import Home from "./pages/Home";
import Settings from "./pages/subcomponent/Setting";
import RecordTable from "./pages/subcomponent/Record_Table";
import MyAccount from "./pages/subcomponent/MyAccount";
import History from "./pages/subcomponent/History";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebaseConfig";
import { useUserStore } from "./store/user";
import { useState } from "react";

function App() {
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const [loading, setLoading] = useState(true);

  onAuthStateChanged(auth, (user) => {
    console.log(user);
    if (user?.emailVerified) {
      setUser(user);
      setLoading(false);
    } else {
      setUser(null);
      setLoading(false);
    }
  });

  return loading ? (
    <h1>Loading...</h1>
  ) : (
    <Routes>
      {user?.emailVerified ? (
        <>
          <Route path="/" element={<Home />} />
          <Route path="/Home" element={<Home subroute={"Home"}/>} />
          <Route path="/Home/Record_Table" element={<Home child={<RecordTable />} subroute={"HOME / RECORD TABLE"}/>} />
          <Route path="/Home/My_Account" element={<Home child={<MyAccount />} subroute={"HOME / MY ACCOUNT"}/>} />
          <Route path="/Home/Settings" element={<Home child={<Settings />} subroute={"HOME / SETTINGS"}/>} />
          <Route path="/Home/History_Notification" element={<Home child={<History />} subroute={"HOME / HISTORY NOTIFICATION"}/>} />
          <Route path="*" element={<h1>Not Found</h1>} />
        </>
      ) : (
        <>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/verify" element={<Verify />} />
        </>
      )}
    </Routes>
  );
}

export default App;
