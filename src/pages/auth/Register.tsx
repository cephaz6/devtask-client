import { useState } from "react";
import { Label } from "@radix-ui/react-label";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import api from "@/lib/api";
import { AxiosError } from "axios";

// import { toast } from "@/components/ui/use-toast";

const Register = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Clear any previous error

    try {
      await api.post("/auth/register", {
        email,
        password,
        full_name: fullName,
      });
      navigate("/"); // Redirect on success
    } catch (err) {
      const axiosError = err as AxiosError<{ detail?: string }>;
      const message =
        axiosError.response?.data?.detail ||
        "Registration failed. Please try again.";
      setError(message);
    }
  };

  return (
    <div className="font-base flex flex-col items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-sm shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Create Account</CardTitle>
          <CardDescription className="text-center">
            Sign up to get started with DevTask Tracker
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister}>
            {error && (
              <div className="mb-4 rounded-md bg-red-100 p-3 text-sm text-red-700 border border-red-300">
                {error}
              </div>
            )}

            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            <CardFooter className="mt-6">
              <Button type="submit" className="w-full">
                Sign Up
              </Button>
            </CardFooter>
          </form>
        </CardContent>
        <CardAction className="text-center mt-2 mx-auto">
          Already have an account?
          <Link to="/" className="ml-1">
            <Button variant="link">Login</Button>
          </Link>
        </CardAction>
      </Card>
    </div>
  );
};

export default Register;
