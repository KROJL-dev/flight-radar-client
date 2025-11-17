import {
  Paper,
  TextField,
  Typography,
  Button,
  CircularProgress,
} from "@mui/material";
import React from "react";

import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler, useForm } from "react-hook-form";
import { LoginForm } from "../type";
import { schema } from "../model/schema";
import { useStore } from "@/app/providers/store";
import { useNavigate } from "react-router-dom";

const AuthUI = () => {
  const { authStore } = useStore();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: yupResolver(schema),
  });

  const onSubmit: SubmitHandler<LoginForm> = async (data: LoginForm) => {
    const res = await authStore.login(data?.key);
    if (res) {
      navigate("/map");
      authStore.setIsAuth(true);
    }
  };
  return (
    <Paper elevation={3} sx={{ p: 4, width: 380 }}>
      <Typography variant="h5" fontWeight={600} mb={3} textAlign="center">
        Login
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          fullWidth
          label="Ключ"
          margin="normal"
          {...register("key")}
          error={!!errors.key}
          helperText={errors.key?.message}
        />

        <Button
          fullWidth
          variant="contained"
          type="submit"
          sx={{ mt: 2 }}
          // disabled={loading}
        >
          Sign in
          {/* {loading ? <CircularProgress size={22} /> : "Sign in"} */}
        </Button>
      </form>
    </Paper>
  );
};

export default AuthUI;
