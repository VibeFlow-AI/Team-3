'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type NavbarCardProps = {
    userName: string;
    sidebarHovered?: boolean;
};

const NavbarCard: React.FC<NavbarCardProps> = ({ userName, sidebarHovered = false }) => {
    const router = useRouter();
    const [greeting, setGreeting] = useState("Good day");
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting("Good morning");
        else if (hour < 18) setGreeting("Good afternoon");
        else setGreeting("Good evening");
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;

            if (scrollTop > 0 && !isScrolled) {
                setIsScrolled(true);
            } else if (scrollTop === 0 && isScrolled) {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isScrolled]);

    const sidebarWidth = sidebarHovered ? 192 : 64; // 48 * 4 = 192px for expanded, 16 * 4 = 64px for collapsed

    return (
        <>
            {/* Spacer to prevent content jump when navbar becomes fixed */}
            {isScrolled && <div className="h-16" />}
            <Card
                data-navbar
                className={`w-full shadow-md transition-all duration-300 ${isScrolled
                    ? 'fixed top-0 z-50 bg-white border-b'
                    : ''
                    }`}
                style={isScrolled ? {
                    left: `${sidebarWidth}px`,
                    width: `calc(100vw - ${sidebarWidth}px - 3rem)`, // Account for padding
                    marginLeft: 0,
                    marginRight: 0
                } : {}}>
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
        </>
    );
};

export default NavbarCard;
