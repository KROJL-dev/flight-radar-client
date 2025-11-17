import { Paper, TextField, Typography, Button, Alert } from "@mui/material";
import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler, useForm } from "react-hook-form";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useStore } from "@/app/providers/store";
import { schema } from "../model/schema";
import type { LoginForm } from "../type";

const sxButton = { mt: 2 };
const sxPaper = { p: 4, width: 380 };

const AuthUI = () => {
  const { authStore } = useStore();
  const navigate = useNavigate();

  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: yupResolver(schema),
    mode: "onSubmit",
    defaultValues: { key: "" },
  });

  const onSubmit = useCallback<SubmitHandler<LoginForm>>(
    async ({ key }) => {
      setLoading(true);
      setServerError(null);

      try {
        const success = await authStore.login(key);

        if (success) {
          navigate("/map");
          return;
        }

        setServerError("Невірний ключ доступу");
      } catch (err) {
        console.error(err);
        setServerError("Сталася помилка. Спробуйте пізніше.");
      } finally {
        setLoading(false);
      }
    },
    [authStore, navigate]
  );

  return (
    <Paper elevation={3} sx={sxPaper}>
      <Typography variant="h5" fontWeight={600} mb={3} textAlign="center">
        Login
      </Typography>

      {serverError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {serverError}
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <TextField
          {...register("key")}
          fullWidth
          label="Ключ"
          margin="normal"
          error={!!errors.key}
          helperText={errors.key?.message}
        />

        <Button
          fullWidth
          variant="contained"
          type="submit"
          sx={sxButton}
          disabled={loading}
        >
          {loading ? "Завантаження..." : "Увійти"}
        </Button>
      </form>
    </Paper>
  );
};

export default AuthUI;
