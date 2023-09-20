import { useState } from "react";
import { Box, TextField, Typography, Button } from "@mui/material";
// import VisibilityIcon from "@mui/icons-material/Visibility";
// import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { auth, db } from "../firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { collection, getDocs, updateDoc } from "firebase/firestore";
import { useUserStore } from "../store/user";

const Login = () => {
  // const [showPass, setShowPass] = useState(false);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const setUser = useUserStore((state) => state.setUser);
  const navigate = useNavigate();

  // error function
  const errorFunction = (error) => {
    if (error.code === "auth/user-not-found") {
      toast.error("User Not Found");
    } else if (error.code === "auth/wrong-password") {
      toast.error("Invalid Credential");
    } else if (error.code === "auth/invalid-email") {
      toast.error("Invalid Credential");
    } else if (error.code === "auth/too-many-requests") {
      toast.error("Too Many Requests");
    } else if (error.code === "auth/network-request-failed") {
      toast.error("Network Request Failed");
    } else if (error.code === "auth/internal-error") {
      toast.error("Internal Error");
    } else if (error.code === "auth/invalid-credential") {
      toast.error("Invalid Credential");
    } else {
      toast.error("Something Went Wrong");
    }
  };

  // handle LoginData Change
  const handleChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  // on login Clicked
  const handleLogin = () => {
    setLoading(true);
    signInWithEmailAndPassword(auth, loginData.email, loginData.password)
      .then((userCreds) => {
        console.log("login creds", userCreds);
        if (!userCreds.user.emailVerified) {
          navigate("/verify");
          toast.error("Please Verify Your Email");
          return;
        }
        // get users from db
        const collectionRef = collection(db, "users");
        getDocs(collectionRef).then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            // find user and update emailVerified true
            if (
              doc.data().uid === userCreds.user.uid &&
              !doc.data().emailVerified
            ) {
              updateDoc(doc.ref, { emailVerified: true }).then(() => {
                console.log("Document successfully updated!");
                setUser({ ...doc.data(), emailVerified: true, id: doc.id });
                navigate("/");
                toast.success("User Logged in Successfully");
                setLoginData({ email: "", password: "" });
                setLoading(false);
                localStorage.setItem(
                  "token",
                  JSON.stringify({ token: doc.id })
                );
              });
            } else if (doc.data().uid === userCreds.user.uid) {
              localStorage.setItem("token", JSON.stringify({ token: doc.id }));
              setUser({ ...doc.data(), id: doc.id });
              navigate("/");
              toast.success("User Logged in Successfully");
              setLoading(false);
            }
          });
        });
      })
      .catch((error) => {
        console.log(error, "in login");
        errorFunction(error);
        setLoading(false);
      });
  };

  return (
    <Box display={"flex"} justifyContent={"center"} mt={15} paddingX={3}>
      <Box
        backgroundColor="#fff"
        maxWidth={500}
        paddingX={5}
        paddingY={5}
        borderRadius={5}
        textAlign={"center"}
        className="shadow"
      >
        <Typography fontWeight={"bold"} fontSize={30} marginBottom={3}>
          Login
        </Typography>
        <Box>
          <TextField
            label="Email"
            type="email"
            name="email"
            value={loginData.email}
            onChange={handleChange}
            fullWidth
            sx={{ marginBottom: 1 }}
          />
          <TextField
            label="Password"
            type="password"
            name="password"
            value={loginData.password}
            onChange={handleChange}
            fullWidth
            sx={{ marginBottom: 3 }}
          />
          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={handleLogin}
            disabled={loading}
          >
            Login
          </Button>
          <Typography mt={2}>
            Don't have an account?{" "}
            <Link to="/signup">
              <span style={{ textDecoration: "outlined", cursor: "pointer" }}>
                Sign Up
              </span>
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
