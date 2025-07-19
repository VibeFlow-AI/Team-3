"use client";

import { Button } from "@/components/ui/button";
import { BookOpen, Bookmark } from "lucide-react";
import { useState, useEffect } from "react";

/**
 * TutorProfileCard component with SVG clip path cut-out design
 * Features avatar, details, and floating action elements in cut-out area
 * @param {Object} tutor - Tutor information object
 * @returns {JSX.Element} A styled tutor profile card with cut-out bottom
 */
function TutorProfileCard({ tutor }: { tutor: any }) {
  return (
    <div className="relative pb-8">
      {/* SVG Clip Path Definition */}
      <svg width="0" height="0" className="absolute">
        <defs>
          <clipPath id={`card-clip-${tutor.id}`}>
            <path d="M 16 0 L 384 0 Q 400 0 400 16 L 400 320 L 280 320 Q 240 350 160 320 L 16 320 Q 0 320 0 304 L 0 16 Q 0 0 16 0 Z" />
          </clipPath>
        </defs>
      </svg>

      {/* Main Card with Cut-out */}
      <div
        className="bg-white shadow-lg p-6 pb-12 relative"
        style={{
          clipPath: `url(#card-clip-${tutor.id})`,
          width: "400px",
          height: "350px",
        }}
      >
        {/* Header Section */}
        <div className="flex items-center gap-4 mb-4">
          <div
            className={`w-12 h-12 ${tutor.avatarColor} rounded-full flex items-center justify-center text-white font-bold text-lg`}
          >
            {tutor.initials}
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">{tutor.name}</h3>
            <p className="text-gray-500 text-sm">{tutor.location}</p>
          </div>
        </div>

        {/* Subject Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {tutor.subjects.map((subject: string, index: number) => (
            <span key={index} className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded-full">
              {subject}
            </span>
          ))}
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm leading-relaxed mb-4">{tutor.description}</p>

        {/* Details */}
        <div className="space-y-2">
          <div className="flex">
            <span className="font-semibold text-gray-900 w-32">Duration:</span>
            <span className="text-gray-600">{tutor.duration}</span>
          </div>
          <div className="flex">
            <span className="font-semibold text-gray-900 w-32">Preferred Language:</span>
            <span className="text-gray-600">{tutor.preferredLanguage}</span>
          </div>
        </div>
      </div>

      {/* Floating Action Elements in Cut-out */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex items-center gap-3 z-10">
        <Button className="bg-gray-900 text-white hover:bg-gray-800 rounded-lg px-6 py-2.5 shadow-lg font-medium">
          Book a Session
        </Button>
        <button className="p-2.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-md">
          <Bookmark className="w-5 h-5 text-gray-600" />
        </button>
      </div>
    </div>
  );
}

/**
 * ContentSections component featuring the main content areas of the homepage
 * Includes student benefits section and tutor profiles with carousel
 * @returns {JSX.Element} The content sections with shared background
 */
export default function ContentSections() {
  const [activeIndex, setActiveIndex] = useState(0);

  const sessions = [
    {
      id: 1,
      title: "Personalized Learning",
      description:
        "Tailored learning experiences designed around your unique goals, pace, and learning style. Get customized study plans that adapt to your progress.",
      colors: "from-blue-400 to-blue-600",
      buttonColor: "bg-blue-600 hover:bg-blue-700",
      backgroundImage: "images/c1.png",
    },
    {
      id: 2,
      title: "Real Mentors, Real Guidance",
      description:
        "Connect with experienced mentors who provide authentic guidance based on real-world experience and proven teaching methodologies.",
      colors: "from-green-400 to-green-600",
      buttonColor: "bg-green-600 hover:bg-green-700",
      backgroundImage: "images/c2.png",
    },
    {
      id: 3,
      title: "Growth & Career Readiness",
      description:
        "Build essential skills and competencies that prepare you for academic success and future career opportunities in your chosen field.",
      colors: "from-purple-400 to-purple-600",
      buttonColor: "bg-purple-600 hover:bg-purple-700",
      backgroundImage: "images/c3.png",
    },
    {
      id: 4,
      title: "Insights-Driven Support",
      description:
        "Receive data-driven insights about your learning progress, strengths, and areas for improvement to maximize your educational outcomes.",
      colors: "from-indigo-400 to-blue-500",
      buttonColor: "bg-indigo-600 hover:bg-indigo-700",
      backgroundImage: "images/c4.png",
    },
  ];

  const tutors = [
    {
      id: 1,
      name: "Rahul Lavan",
      location: "Colombo",
      initials: "RL",
      avatarColor: "bg-blue-500",
      subjects: ["Science", "Physics", "Biology"],
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled",
      duration: "30 mins - 1 hour",
      preferredLanguage: "English, Tamil",
    },
    {
      id: 2,
      name: "Chathum Rahal",
      location: "Galle",
      initials: "CR",
      avatarColor: "bg-orange-500",
      subjects: ["Mathematics", "History", "English"],
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled",
      duration: "1 hour",
      preferredLanguage: "English",
    },
    {
      id: 3,
      name: "Malsha Fernando",
      location: "Colombo",
      initials: "MF",
      avatarColor: "bg-purple-500",
      subjects: ["Chemistry", "Art", "Commerce"],
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled",
      duration: "1 hour",
      preferredLanguage: "Sinhala",
    }
  ];

  // Auto-progress carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % sessions.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [sessions.length]);

  return (
    <div className="relative min-h-[200vh] bg-gradient-to-br from-gray-50 to-gray-100 py-12 overflow-hidden">
      {/* Top fade overlay */}
      <div
        className="absolute top-0 left-0 right-0 h-32 z-20 pointer-events-none"
        style={{
          background: `linear-gradient(to bottom, #f4f4f4 0%, rgba(244, 244, 244, 0.8) 50%, rgba(244, 244, 244, 0) 100%)`,
        }}
      />

      {/* Bottom fade overlay */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 z-20 pointer-events-none"
        style={{
          background: `linear-gradient(to top, #f4f4f4 0%, rgba(244, 244, 244, 0.8) 50%, rgba(244, 244, 244, 0) 100%)`,
        }}
      />

      {/* Background gradient circles - Large triangle formation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Blue circle - Left */}
        <div
          className="absolute top-1/2 left-0 transform -translate-y-1/2 w-[1200px] h-[1200px] rounded-full blur-3xl"
          style={{
            backgroundColor: "rgba(0, 132, 255, 0.17)",
            transform: "translateY(-50%) translateX(-40%)",
          }}
        />
        {/* Yellow/Green circle - Top Right */}
        <div
          className="absolute top-1/4 right-0 transform -translate-y-1/2 w-[1200px] h-[1200px] rounded-full blur-3xl"
          style={{
            backgroundColor: "rgba(217, 255, 0, 0.17)",
            transform: "translateY(-25%) translateX(40%)",
          }}
        />
        {/* Purple circle - Bottom Right */}
        <div
          className="absolute bottom-1/4 right-0 transform translate-y-1/2 w-[1200px] h-[1200px] rounded-full blur-3xl"
          style={{
            backgroundColor: "rgba(106, 77, 255, 0.17)",
            transform: "translateY(25%) translateX(40%)",
          }}
        />
      </div>

      {/* First Section - What's in it for Students */}
      <div className="relative z-10 w-4/5 mx-auto py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            What's in it for Students?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            EduVibe is a student-mentor platform designed to personalize
            learning journeys. It connects students with mentors who offer
            guidance, support, and practical industry insights.
          </p>
        </div>

        {/* Flowing Carousel */}
        <div className="relative h-96 overflow-hidden">
          <div className="flex items-center h-full">
            {sessions.map((session, index) => {
              const position =
                (index - activeIndex + sessions.length) % sessions.length;
              const isActive = position === 0;
              const shouldShow = position <= 3;

              // Calculate opacity based on position with fade effect
              let opacity = 0;
              if (position === 0) opacity = 1;
              else if (position === 1) opacity = 0.8;
              else if (position === 2) opacity = 0.6;
              else if (position === 3) opacity = 0.4;

              // Calculate scale for subtle depth effect
              const scale = position === 0 ? 1 : 0.95;

              return shouldShow ? (
                <div
                  key={session.id}
                  className="absolute transition-all duration-1000 ease-in-out"
                  style={{
                    opacity: opacity,
                    transform: `translateX(${position === 0 ? 0 : 400 + (position - 1) * 280}px) scale(${scale})`,
                    zIndex: 4 - position,
                    left: "0px",
                  }}
                >
                  <div
                    className={`relative rounded-2xl overflow-hidden transition-all duration-1000 h-80 bg-cover bg-center ${
                      isActive ? "w-96" : "w-64"
                    }`}
                    style={{
                      backgroundImage: `url(${session.backgroundImage})`,
                    }}
                  >
                    {/* White gradient overlay - fade from bottom (white) to top (transparent) */}
                    <div className="absolute inset-0 bg-gradient-to-t from-white via-white/50 to-transparent"></div>

                    {/* Content overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-gray-900">
                      <h3
                        className={`font-bold mb-2 transition-all duration-1000 ${
                          isActive ? "text-2xl" : "text-lg"
                        }`}
                      >
                        {session.title}
                      </h3>
                      
                      <div
                        className={`transition-all duration-1000 overflow-hidden ${
                          isActive
                            ? "max-h-96 opacity-100"
                            : "max-h-0 opacity-0"
                        }`}
                      >
                        <p className="text-gray-700 mb-4 leading-relaxed">
                          {session.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null;
            })}
          </div>
        </div>

        {/* Carousel Controls */}
        <div className="flex justify-center mt-8 space-x-2">
          {sessions.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === activeIndex
                  ? "bg-indigo-600 w-8"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <Button
            size="lg"
            className="bg-black hover:bg-gray-800 text-white px-8 py-4"
          >
            View All Sessions
          </Button>
        </div>
      </div>

      {/* Second Section - Featured Tutors */}
      <div className="relative z-10 w-4/5 mx-auto py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Featured Tutors – Top Rated Mentors
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Connect with our highly-rated tutors who bring years of experience and passion for teaching. 
            Each mentor is carefully selected to provide personalized guidance tailored to your learning goals.
          </p>
        </div>

        {/* Tutor Profile Cards */}
        <div className="grid md:grid-cols-3 gap-20 max-w-6xl mx-auto">
          {tutors.map((tutor, index) => (
            <TutorProfileCard key={index} tutor={tutor} />
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <Button
            size="lg"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4"
          >
            View All Tutors
          </Button>
        </div>
      </div>
    </div>
  );
}