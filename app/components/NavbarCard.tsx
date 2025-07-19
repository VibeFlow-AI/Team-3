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
    const [isScrolled, setIsScrolled] = useState(false);
    const [navbarWidth, setNavbarWidth] = useState<number | undefined>(undefined);
    const [sidebarWidth, setSidebarWidth] = useState<number>(64); // Default collapsed width

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting("Good morning");
        else if (hour < 18) setGreeting("Good afternoon");
        else setGreeting("Good evening");
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            const navbar = document.querySelector('[data-navbar]') as HTMLElement;
            const sidebar = document.querySelector('[data-sidebar]') as HTMLElement;

            if (scrollTop > 0 && !isScrolled) {
                // Capture the current widths before making navbar fixed
                if (navbar) {
                    setNavbarWidth(navbar.offsetWidth);
                }
                if (sidebar) {
                    setSidebarWidth(sidebar.offsetWidth);
                }
                setIsScrolled(true);
            } else if (scrollTop === 0 && isScrolled) {
                setIsScrolled(false);
                setNavbarWidth(undefined);
                setSidebarWidth(64); // Reset to default
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isScrolled]);

    return (
        <>
            {isScrolled && <div style={{ height: '64px' }} />}
            <Card
                data-navbar
                className={`w-full shadow-md transition-all duration-300 ${isScrolled ? 'fixed top-0 z-50 bg-white' : ''}`}
                style={isScrolled ? {
                    left: `${sidebarWidth}px`,
                    width: navbarWidth ? `${navbarWidth}px` : `calc(100% - ${sidebarWidth}px)`
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
