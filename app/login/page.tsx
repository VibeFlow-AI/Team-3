"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FaGoogle, FaFacebookF, FaGithub } from "react-icons/fa";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate authentication - replace with actual auth logic
        try {
            // Mock authentication logic
            if (email && password) {
                // For demo purposes, route based on email domain
                // In real app, this would be determined by user role from backend
                if (email.includes("mentor") || email.includes("teacher")) {
                    router.push("/dashboard/mentor");
                } else {
                    router.push("/dashboard/student");
                }
            }
        } catch (error) {
            console.error("Sign in error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSocialSignIn = (provider: string) => {
        // Handle social sign-in logic here
        console.log(`Sign in with ${provider}`);
        // For demo, redirect to student dashboard
        router.push("/dashboard/student");
    };

    return (
        <div className="min-h-screen bg-[#f4f4f4] flex flex-col items-center justify-center px-4">
            {/* Back to Home Link */}
            <div className="mb-4">
                <Link href="/" className="text-gray-600 hover:text-black text-sm font-medium">
                    ← Back to Home
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-md p-8 w-full max-w-md text-center">
                <h2 className="text-xl font-semibold mb-1">Sign in to EduVibe</h2>
                <p className="text-sm text-gray-600 mb-6">Welcome back! Please sign in to continue</p>

                {/* Social Logins */}
                <div className="flex justify-center gap-4 mb-4">
                    <Button
                        className="bg-black text-white px-4 py-2 rounded-md"
                        onClick={() => handleSocialSignIn("Google")}
                        disabled={isLoading}
                    >
                        <FaGoogle className="" />
                    </Button>
                    <Button
                        className="bg-black text-white px-4 py-2 rounded-md"
                        onClick={() => handleSocialSignIn("Facebook")}
                        disabled={isLoading}
                    >
                        <FaFacebookF className="" />
                    </Button>
                    <Button
                        className="bg-black text-white px-4 py-2 rounded-md"
                        onClick={() => handleSocialSignIn("GitHub")}
                        disabled={isLoading}
                    >
                        <FaGithub className="" />
                    </Button>
                </div>

                <div className="text-sm text-gray-400 mb-4">--- or ---</div>

                {/* Sign In Form */}
                <form onSubmit={handleSignIn}>
                    {/* Email Input */}
                    <div className="mb-4 text-left">
                        <label htmlFor="email" className="text-sm font-medium text-gray-700 mb-1 block">Email address</label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            className="w-full"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    {/* Password Input */}
                    <div className="mb-6 text-left">
                        <label htmlFor="password" className="text-sm font-medium text-gray-700 mb-1 block">Password</label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="Enter your password"
                            className="w-full"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {/* Sign In Button */}
                    <Button
                        type="submit"
                        className="w-full bg-black text-white hover:bg-gray-800"
                        disabled={isLoading}
                    >
                        {isLoading ? "Signing in..." : "Sign In"}
                    </Button>
                </form>

                {/* Sign Up Link */}
                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        Don't have an account?{" "}
                        <Link href="/signup" className="text-black font-medium hover:underline">
                            Sign up here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
