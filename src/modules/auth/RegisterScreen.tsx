import { Card } from "@/components/layouts";
import { Button } from "@/components/ui/button";
import { InputField } from "@/components/ui/input-field";
import { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useRegisterMutation } from "./hooks";
import "./register.css";

export function RegisterScreen() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const registerMutation = useRegisterMutation();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await registerMutation.mutateAsync({ name, email, password });
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
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <InputField
              id="name"
              type="text"
              label="Full Name"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
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