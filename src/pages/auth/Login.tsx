import { Label } from "@radix-ui/react-label";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";

import { Alert, AlertDescription } from "../../components/ui/alert";

import { Input } from "../../components/ui/input";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { LogIn } from "lucide-react";
import type { AxiosError } from "axios";

const Login = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await login(email, password);
    } catch (err) {
      const axiosError = err as AxiosError<{ detail?: string }>;
      const message =
        axiosError.response?.data?.detail || "Login failed. Please try again.";
      setError(message);
    }
  };

  return (
    <div className="font-base flex flex-col items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-sm shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-2xl">
            DevTask Tracker
          </CardTitle>
          <CardDescription className="text-center">
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <div className="">
            {error && (
              <Alert className="border-0" variant="destructive">
                <LogIn />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>
          <CardContent>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={email}
                  type="email"
                  placeholder="tindax@example.com"
                  required
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="grid gap-2 mb-4">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input
                  id="password"
                  value={password}
                  type="password"
                  required
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex-col gap-2">
            <Button type="submit" className="w-full">
              Login
            </Button>
            <Button type="button" variant="outline" className="w-full">
              Login with Google
            </Button>
          </CardFooter>
        </form>

        <CardAction className="text-center mt-4 mx-auto">
          Don't have an account?
          <Link to="/signup" className="ml-1">
            <Button variant="link">Sign Up</Button>
          </Link>
        </CardAction>
      </Card>
    </div>
  );
};

export default Login;
