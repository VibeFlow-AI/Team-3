'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type NavbarCardProps = {
    userName: string;
};

const NavbarCard: React.FC<NavbarCardProps> = ({ userName }) => {
    const router = useRouter();
    const [greeting, setGreeting] = useState("Good day");

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting("Good morning");
        else if (hour < 18) setGreeting("Good afternoon");
        else setGreeting("Good evening");
    }, []);

    return (
        <Card className="w-full shadow-md">
            <CardContent className="flex items-center justify-between px-6 py-2">
                <div className="text-lg font-semibold">
                    {greeting}! <span className="text-primary">{userName}</span>
                </div>
                <Button
                    variant="default"
                    className="rounded-xl"
                    onClick={() => router.push("/dashboard")}
                >
                    Dashboard
                </Button>
            </CardContent>
        </Card>
    );
};

export default NavbarCard;
