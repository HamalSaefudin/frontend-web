import { Button, InputField, Card } from "@frontend/ui"
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { useLoginMutation } from "./hooks";
import { loginSchema, type LoginInput } from "./schemas/authSchemas";
import "./login.css";

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
      email: "",
      password: "",
    },
  });

  const onSubmit = async (_data: LoginInput) => {
    try {
      // await loginMutation.mutateAsync(_data);
      localStorage.setItem("user", JSON.stringify({ email: _data.email }));
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
              id="email"
              type="email"
              label="Email"
              placeholder="Enter your email"
              error={errors.email?.message}
              {...register("email")}
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
          <p className="login-register-link">
            Don't have an account?{" "}
            <Link to="/register" className="text-link">
              Create Account
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
}