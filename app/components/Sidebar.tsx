"use client";

import Link from "next/link";
import Image from "next/image";
import { Home, PencilLine, UserCircle2, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

type SidebarProps = {
    hovered: boolean;
    onHoverChange: (hovered: boolean) => void;
};

const Sidebar = ({ hovered, onHoverChange }: SidebarProps) => {

    return (
        <div
            data-sidebar
            onMouseEnter={() => onHoverChange(true)}
            onMouseLeave={() => onHoverChange(false)}
            className={cn(
                "fixed left-0 top-0 h-screen bg-white border-r border-gray-200 transition-all duration-300 ease-in-out shadow-lg rounded-r-2xl z-40 flex flex-col",
                hovered ? "w-48" : "w-16"
            )}
        >
            {/* Logo or top icon (optional) */}
            <div className="flex items-center justify-center h-16">
                <div className="text-2xl mt-12 font-bold text-black">
                    {hovered ? "EduVibe" : (
                        <div className="p-2 bg-blue-50 rounded-xl">
                            <Image
                                src="/images/Group 3.png"
                                alt="MentorApp Logo"
                                width={32}
                                height={32}
                                className="object-contain"
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Nav Items */}
            <nav className="flex flex-col mt-12 py-4 px-2 space-y-2">
                <SidebarItem href="/" icon={<Home size={22} />} label="Home" hovered={hovered} />
                <SidebarItem href="/mentor-onboarding" icon={<PencilLine size={22} />} label="Onboarding" hovered={hovered} />
                <SidebarItem href="/booked-sessions" icon={<Calendar size={22} />} label="Booked Sessions" hovered={hovered} />
            </nav>

            {/* Bottom - Avatar/Profile */}
            <div className="mt-auto mb-4 px-2">
                <SidebarItem href="/profile" icon={<UserCircle2 size={22} />} label="Profile" hovered={hovered} />
            </div>
        </div>
    );
};

type SidebarItemProps = {
    href: string;
    icon: React.ReactNode;
    label: string;
    hovered: boolean;
};

const SidebarItem = ({ href, icon, label, hovered }: SidebarItemProps) => {
    return (
        <Link href={href} className="w-full">
            <div className="flex items-center gap-3 px-3 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 cursor-pointer w-full rounded-xl group">
                <div className="flex-shrink-0 group-hover:scale-110 transition-transform duration-200">
                    {icon}
                </div>
                {hovered && <span className="text-sm font-medium whitespace-nowrap">{label}</span>}
            </div>
        </Link>
    );
};

export default Sidebar;
