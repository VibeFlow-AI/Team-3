"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import TutorCard from "../../components/student-dashboard/tutor-card";
import { mentors, type Mentor } from "../../components/student-dashboard/mentors";

// Filter Component
interface FilterProps {
  onSubjectFilter: (subject: string) => void;
  onDurationFilter: (duration: string) => void;
  onLanguageFilter: (language: string) => void;
  onSearchFilter: (query: string) => void;
  onClearFilters: () => void;
  selectedSubject: string;
  selectedDuration: string;
  selectedLanguage: string;
  searchQuery: string;
}

const FilterSection = ({
  onSubjectFilter,
  onDurationFilter,
  onLanguageFilter,
  onSearchFilter,
  onClearFilters,
  selectedSubject,
  selectedDuration,
  selectedLanguage,
  searchQuery,
}: FilterProps) => {
  const subjects = ["All", "Mathematics", "Physics", "Chemistry", "Biology", "Computer Science", "English"];
  const durations = ["All", "30 min", "45 min", "60 min", "90 min"];
  const languages = ["All", "English", "Spanish", "French", "German", "Mandarin"];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
        {/* Search Bar */}
        <div className="flex-1 min-w-0">
          <input
            type="text"
            placeholder="Search mentors by name or expertise..."
            value={searchQuery}
            onChange={(e) => onSearchFilter(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap gap-3">
          <select
            value={selectedSubject}
            onChange={(e) => onSubjectFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {subjects.map((subject) => (
              <option key={subject} value={subject}>
                {subject === "All" ? "All Subjects" : subject}
              </option>
            ))}
          </select>

          <select
            value={selectedDuration}
            onChange={(e) => onDurationFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {durations.map((duration) => (
              <option key={duration} value={duration}>
                {duration === "All" ? "Any Duration" : duration}
              </option>
            ))}
          </select>

          <select
            value={selectedLanguage}
            onChange={(e) => onLanguageFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {languages.map((language) => (
              <option key={language} value={language}>
                {language === "All" ? "Any Language" : language}
              </option>
            ))}
          </select>

          <Button
            onClick={onClearFilters}
            variant="outline"
            className="px-4 py-2 border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Clear Filters
          </Button>
        </div>
      </div>
    </div>
  );
};

export default function StudentDashboard() {
  const [selectedSubject, setSelectedSubject] = useState("All");
  const [selectedDuration, setSelectedDuration] = useState("All");
  const [selectedLanguage, setSelectedLanguage] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter mentors based on selected criteria
  const filteredMentors = mentors.filter((mentor) => {
    const matchesSubject = selectedSubject === "All" || mentor.subjects.includes(selectedSubject);
    const matchesDuration = selectedDuration === "All" || mentor.duration.includes(selectedDuration.replace(" ", ""));
    const matchesLanguage = selectedLanguage === "All" || mentor.preferredLanguage.includes(selectedLanguage);
    const matchesSearch = searchQuery === "" ||
      mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mentor.subjects.some(subject => subject.toLowerCase().includes(searchQuery.toLowerCase())) ||
      mentor.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSubject && matchesDuration && matchesLanguage && matchesSearch;
  });

  const handleClearFilters = () => {
    setSelectedSubject("All");
    setSelectedDuration("All");
    setSelectedLanguage("All");
    setSearchQuery("");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Discover Mentors</h1>
            <p className="text-lg text-gray-600">Find the perfect mentor for your learning journey</p>
          </div>
          <div className="bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
            <span className="text-sm font-medium text-gray-600">
              Showing <span className="text-gray-900 font-semibold">{filteredMentors.length}</span> of{' '}
              <span className="text-gray-900 font-semibold">{mentors.length}</span> mentors
            </span>
          </div>
        </div>

        {/* Filter Section */}
        <FilterSection
          onSubjectFilter={setSelectedSubject}
          onDurationFilter={setSelectedDuration}
          onLanguageFilter={setSelectedLanguage}
          onSearchFilter={setSearchQuery}
          onClearFilters={handleClearFilters}
          selectedSubject={selectedSubject}
          selectedDuration={selectedDuration}
          selectedLanguage={selectedLanguage}
          searchQuery={searchQuery}
        />

        {/* Results Section */}
        {filteredMentors.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No mentors found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your filters or search terms</p>
            <Button onClick={handleClearFilters} className="bg-blue-600 hover:bg-blue-700 text-white">
              Clear All Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMentors.map((mentor, index) => (
              <TutorCard
                key={index}
                name={mentor.name}
                initials={mentor.initials}
                subjects={mentor.subjects}
                description={mentor.description}
                duration={mentor.duration}
                preferredLanguage={mentor.preferredLanguage}
                initialsColor={mentor.initialsColor}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
