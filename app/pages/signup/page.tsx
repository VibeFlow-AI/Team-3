"use client";

import { Button } from "../../../components/ui/button";
import Link from "next/link";

export default function SignUpPage() {
    return (
        <div className="min-h-screen bg-[#f4f4f4] flex flex-col">
            {/* Main Content */}
            <div className="flex-1 flex items-center justify-center px-4">
                <div className="bg-white rounded-xl shadow-md p-8 w-full max-w-2xl text-center">
                    <h1 className="text-2xl font-semibold mb-8">Get Started</h1>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
