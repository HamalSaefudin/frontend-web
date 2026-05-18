import { Card } from "@/components/layouts";
import { Button } from "@/components/ui/button";
import { InputField } from "@/components/ui/input-field";
import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "./hooks";
import "./login.css";

export function LoginScreen() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const loginMutation = useLoginMutation();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await loginMutation.mutateAsync({ email, password });
    navigate("/dashboard");
  };

  return (
    <div className="login-container">
      <Card variant="elevated">
        <div className="login-content">
          <h1 className="login-title">Login</h1>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <InputField
              id="email"
              type="email"
              label="Email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <InputField
              id="password"
              type="password"
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button
              type="submit"
              loading={loginMutation.isPending}
              className="w-full"
            >
              Sign In
            </Button>
          </form>
          <p className="login-hint">
            Demo credentials: user@example.com / password123
          </p>
        </div>
      </Card>
    </div>
  );
}
