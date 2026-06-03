import { Button, InputField, Card } from "@frontend/ui"
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { useRegisterMutation } from "./hooks";
import { registerSchema, type RegisterInput } from "./schemas/authSchemas";
import "./register.css";

export function RegisterScreen() {
  const navigate = useNavigate();
  const registerMutation = useRegisterMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: RegisterInput) => {
    try {
      await registerMutation.mutateAsync(data);
      navigate("/login");
    } catch {
      // Error is handled by the mutation
    }
  };

  return (
    <div className="register-container">
      <Card variant="elevated">
        <div className="register-content">
          <h1 className="register-title">Create Account</h1>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <InputField
              id="name"
              type="text"
              label="Full Name"
              placeholder="Enter your full name"
              error={errors.name?.message}
              {...register("name")}
            />
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
              placeholder="Enter your password (min 8 characters)"
              error={errors.password?.message}
              {...register("password")}
            />
            <Button
              type="submit"
              loading={registerMutation.isPending}
              className="w-full"
            >
              Create Account
            </Button>
          </form>
          <p className="register-login-link">
            Already have an account?{" "}
            <Link to="/login" className="text-link">
              Sign In
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
}