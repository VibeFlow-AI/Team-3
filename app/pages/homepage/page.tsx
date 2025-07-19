"use client";

import HeroSection from "../../components/hero-section";
import ContentSections from "../../components/content-sections";
import Navigation from "../../components/navigation";

/**
 * HomePage component serving as the main layout container
 * Orchestrates the navigation, hero section, and content sections
 * @returns {JSX.Element} The complete home page layout
 */
export default function HomePage() {
  return (
    <div className="h-screen relative">
      {/* Navigation - Absolutely positioned within hero section */}
      <Navigation />

      {/* Hero Section - Full viewport height */}
      <HeroSection />

      {/* Content Sections - Student Benefits and Session Highlights */}
      <ContentSections />
    </div>
  );
}
