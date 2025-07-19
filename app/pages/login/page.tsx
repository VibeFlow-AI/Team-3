"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FaGoogle, FaFacebookF, FaGithub } from "react-icons/fa";

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-[#f4f4f4] flex flex-col items-center justify-center px-4">
            <div className="bg-white rounded-xl shadow-md p-8 w-full max-w-md text-center">
                <h2 className="text-xl font-semibold mb-1">Sign in to EduVibe</h2>
                <p className="text-sm text-gray-600 mb-6">Welcome back! please sign in to continue</p>

                {/* Social Logins */}
                <div className="flex justify-center gap-4 mb-4">
                    <Button className="bg-black text-white px-4 py-2 rounded-md">
                        <FaGoogle className="" />
                    </Button>
                    <Button className="bg-black text-white px-4 py-2 rounded-md">
                        <FaFacebookF className="" />
                    </Button>
                    <Button className="bg-black text-white px-4 py-2 rounded-md">
                        <FaGithub className="" />
                    </Button>
                </div>

                <div className="text-sm text-gray-400 mb-4">--- or ---</div>

                {/* Email Input */}
                <div className="mb-4 text-left">
                    <label htmlFor="email" className="text-sm font-medium text-gray-700 mb-1 block">Email address</label>
                    <Input id="email" type="email" placeholder="Enter your email" className="w-full" />
                </div>

                {/* Password Input */}
                <div className="mb-4 text-left">
                    <label htmlFor="password" className="text-sm font-medium text-gray-700 mb-1 block">Password</label>
                    <Input id="password" type="password" placeholder="Enter your password" className="w-full" />
                </div>

                {/* Continue Button */}
                <Button className="w-full bg-black text-white hover:bg-gray-800">Continue</Button>
            </div>
        </div>
    );
}
