import { Box } from "@mui/material";

import AuthUI from "@/features/auth/ui";

export default function Login() {
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
