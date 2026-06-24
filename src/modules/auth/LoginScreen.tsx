import { Card } from "@/components/layouts";
import { Button } from "@/components/ui/button";
import { InputField } from "@/components/ui/input-field";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "./hooks";
import "./login.css";
import { loginSchema, type LoginInput } from "./schemas/authSchemas";

export function LoginScreen() {
  const navigate = useNavigate();
  const loginMutation = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (_data: LoginInput) => {
    try {
      await loginMutation.mutateAsync(_data);
      navigate("/dashboard");
    } catch (error) {
      console.error("[LoginScreen] Submit error:", error);
    }
  };

  return (
    <div className="login-container">
      <Card variant="elevated">
        <div className="login-content">
          <h1 className="login-title">Login</h1>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <InputField
              id="username"
              type="username"
              label="Username"
              placeholder="Enter your username"
              error={errors.username?.message}
              {...register("username")}
            />
            <InputField
              id="password"
              type="password"
              label="Password"
              placeholder="Enter your password"
              error={errors.password?.message}
              {...register("password")}
            />
            <Button
              type="submit"
              loading={loginMutation.isPending}
              className="w-full"
            >
              Sign In
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}