import Snackbar, { SnackbarCloseReason } from "@mui/material/Snackbar";
import * as React from "react";

export default function SnackbarUi({ open, setOpen }) {
  //   const [open, setOpen] = React.useState(false);

  //   const handleClick = () => {
  //     setOpen(true);
  //   };

  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  return (
    <div>
      <Snackbar
        open={open}
        autoHideDuration={5000}
        onClose={handleClose}
        message="No File Selected, Please Choose the CSV."
      />
    </div>
  );
}
