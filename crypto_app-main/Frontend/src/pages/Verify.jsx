import React from "react";
import { Box, Button, Typography } from "@mui/material";
import envelope from "../assets/envelope.png";
import { sendEmailVerification } from "@firebase/auth";
import { toast } from "react-toastify";
import { auth } from "../firebaseConfig";
import { Link } from "react-router-dom";

const VerifyEmail = () => {
  const [loading, setLoading] = React.useState(false);
  const handleClick = () => {
    if (auth.currentUser.emailVerified) {
      toast.success("Email Already Verified! Please login now");
      return;
    }
    sendEmailVerification(auth.currentUser, {
      url: `${window.location.origin}`,
    })
      .then(() => {
        toast.success("Email verification has been Sent to your email");
        setLoading(false);
      })
      .catch((err) => {
        toast.error("Something went wrong");
        console.log(err);
        console.log(err.code);
        setLoading(false);
      });
  };

  return (
    <Box display={"flex"} justifyContent={"center"} marginTop={5}>
      <Box display={"flex"} flexDirection={"column"} alignItems={"center"}>
        <img src={envelope} width={200} alt="email verification" />
        {/* <Typography gutterBottom>Verify your email address</Typography> */}
        <Button variant="contained" onClick={handleClick} disabled={loading}>
          Send Verification
        </Button>
        <Typography mt={2}>
          Already verified your email?{" "}
          <Link to="/">
            <span style={{ textDecoration: "outlined", cursor: "pointer" }}>
              Login
            </span>
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default VerifyEmail;
