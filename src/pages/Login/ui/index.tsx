import { Box } from "@mui/material";

import { SubmitHandler } from "react-hook-form";

import { useNavigate } from "react-router-dom";

import AuthUI from "@/features/auth/ui";
import { LoginForm } from "@/features/auth/type";

export default function Login() {
  const navigate = useNavigate();

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor="#f5f5f5"
    >
      <AuthUI />
    </Box>
  );
}
