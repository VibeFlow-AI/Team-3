"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function SignUpPage() {
    return (
        <div className="min-h-screen bg-[#f4f4f4] flex flex-col">
            {/* Header */}
            <header className="flex items-center justify-between px-6 py-4 bg-white">
                <div className="flex items-center">
                    <div className="w-8 h-8 bg-black rounded-sm flex items-center justify-center">
                        <div className="w-4 h-4 bg-white rounded-sm"></div>
                    </div>
                </div>
                <nav className="flex items-center gap-8">
                    <Link href="/" className="text-gray-700 hover:text-black">Home</Link>
                    <Link href="/about" className="text-gray-700 hover:text-black">About</Link>
                    <Button className="bg-black text-white hover:bg-gray-800">Get Started</Button>
                </nav>
            </header>

            {/* Main Content */}
            <div className="flex-1 flex items-center justify-center px-4">
                <div className="bg-white rounded-xl shadow-md p-8 w-full max-w-md text-center">
                    <h1 className="text-2xl font-semibold mb-8">Get Started</h1>

                    <div className="space-y-6">
                        {/* Mentor Sign Up */}
                        <div className="flex flex-col items-center">
                            <h2 className="text-lg font-medium mb-4">Sign Up as a Mentor</h2>
                            <Link href="/signup/mentor" className="w-full">
                                <Button className="w-full bg-black text-white hover:bg-gray-800">
                                    Continue as a Mentor
                                </Button>
                            </Link>
                        </div>

                        {/* Student Sign Up */}
                        <div className="flex flex-col items-center">
                            <h2 className="text-lg font-medium mb-4">Sign Up as a Student</h2>
                            <Link href="/signup/student" className="w-full">
                                <Button className="w-full bg-black text-white hover:bg-gray-800">
                                    Continue as a Student
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
