import { styled } from "@mui/material";

const Main = styled("main", {
    shouldForwardProp: (prop) => prop !== "open",
  })<{
    open?: boolean;
  }>(({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create(['margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    // [theme.breakpoints.down("md")]: {
    //   marginLeft: open ? "176px" : "0",
    // },
    [theme.breakpoints.up("md")]: {
      marginLeft: open ? "20px" : "0",
    },
  }));
  export default Main;