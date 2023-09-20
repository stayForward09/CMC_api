import { useState } from "react";
import { Box, TextField, Typography, Button } from "@mui/material";

import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { auth } from "../firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
// firebase
import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebaseConfig";

const SignUp = () => {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
    name: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const userCollectionRef = collection(db, "users");

  // check firebase error code and gives respective error
  const errorFunction = (error) => {
    if (error.code === "auth/email-already-in-use") {
      toast.error("Email Already In Use");
    } else if (error.code === "auth/invalid-email") {
      toast.error("Invalid Credential");
    } else if (error.code === "auth/weak-password") {
      toast.error("Weak Password");
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
    if (
      loginData.name === "" ||
      loginData.email === "" ||
      loginData.password === ""
    ) {
      toast.error("Please Fill All Fields");
      return;
    }
    console.log(loginData);
    setLoading(true);

    createUserWithEmailAndPassword(auth, loginData.email, loginData.password)
      .then((userCreds) => {
        console.log("signup creds", userCreds.user.uid);
        // creating object for new user in firestore
        const userObj = {
          uid: userCreds.user.uid,
          email: loginData.email,
          emailVerified: userCreds.user.emailVerified,
          photoURL: userCreds.user.photoURL,
          displayName: loginData.name,
          password: loginData.password,
        };
        addDoc(userCollectionRef, userObj).then(() => {
          toast.success("User Created Successfully");
          // navigate to verify email page
          if (!userCreds.user.emailVerified) {
            navigate("/verify");
            // toast.error("Please Verify Your Email");
          } else {
            navigate("/");
          }
          setLoading(false);
          setLoginData({ email: "", password: "", name: "" });
        });
      })
      .catch((error) => {
        errorFunction(error);
        console.log(error.code);
        console.log(error.message);
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
          Sign Up
        </Typography>
        <Box>
          <TextField
            label="Name"
            type="text"
            name="name"
            value={loginData.name}
            onChange={handleChange}
            fullWidth
            sx={{ marginBottom: 1 }}
          />
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
            Sign Up
          </Button>
          <Typography mt={2}>
            Already have an account?{" "}
            <Link to="/">
              <span style={{ textDecoration: "outlined", cursor: "pointer" }}>
                Login
              </span>
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default SignUp;
