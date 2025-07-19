"use client";

import NavbarCard from "@/app/components/NavbarCard";
import Dashboard from "./dashboard/page";
import Sidebar from "@/app/components/Sidebar";
import { useState } from "react";

export default function MentorPage() {
    const userName = "Theekshana";
    const [sidebarHovered, setSidebarHovered] = useState(false);

    return (
        <div className="flex">
            <Sidebar
                hovered={sidebarHovered}
                onHoverChange={setSidebarHovered}
            />
            <div className={`w-full p-6 transition-all duration-300 ${sidebarHovered ? 'ml-48' : 'ml-16'}`}>
                <NavbarCard userName={userName} sidebarHovered={sidebarHovered} />
                <Dashboard />
            </div>
        </div>
    );
}
