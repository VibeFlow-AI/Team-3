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

function Filter({ 
  onSubjectFilter, 
  onDurationFilter, 
  onLanguageFilter, 
  onSearchFilter,
  onClearFilters,
  selectedSubject,
  selectedDuration,
  selectedLanguage,
  searchQuery
}: FilterProps) {
  // Extract unique subjects, durations, and languages from mentors
  const allSubjects = [...new Set(mentors.flatMap(mentor => mentor.subjects))].sort();
  const allDurations = [...new Set(mentors.map(mentor => mentor.duration))].sort();
  const allLanguages = [...new Set(mentors.flatMap(mentor => 
    mentor.preferredLanguage.split(', ').map(lang => lang.trim())
  ))].sort();

  return (
    <div className="mb-10">
      {/* Search Bar Section */}
      <div className="mb-8">
        <div className="relative max-w-2xl">
          <input
            type="text"
            placeholder="Search mentors by name, subject, or specialty..."
            value={searchQuery}
            onChange={(e) => onSearchFilter(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm text-base"
          />
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Filter Options Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex flex-wrap items-center gap-4">
          {/* Subject Filter */}
          <div className="relative">
            <select 
              value={selectedSubject}
              onChange={(e) => onSubjectFilter(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[200px] shadow-sm"
            >
              <option value="">All Subjects</option>
              {allSubjects.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Duration Filter */}
          <div className="relative">
            <select 
              value={selectedDuration}
              onChange={(e) => onDurationFilter(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[180px] shadow-sm"
            >
              <option value="">All Durations</option>
              {allDurations.map(duration => (
                <option key={duration} value={duration}>{duration}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Language Filter */}
          <div className="relative">
            <select 
              value={selectedLanguage}
              onChange={(e) => onLanguageFilter(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[150px] shadow-sm"
            >
              <option value="">All Languages</option>
              {allLanguages.map(language => (
                <option key={language} value={language}>{language}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          
          {/* Clear Filters Button */}
          <Button 
            variant="outline" 
            onClick={onClearFilters}
            className="bg-black text-white hover:bg-gray-800 border-black px-6 py-2.5 ml-auto"
          >
            Clear Filters
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function StudentDashboard() {
  const [filteredMentors, setFilteredMentors] = useState<Mentor[]>(mentors);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedDuration, setSelectedDuration] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const applyFilters = (subject: string, duration: string, language: string, query: string) => {
    let filtered = mentors;

    // Apply search filter
    if (query) {
      const searchLower = query.toLowerCase();
      filtered = filtered.filter(mentor => 
        mentor.name.toLowerCase().includes(searchLower) ||
        mentor.subjects.some(sub => sub.toLowerCase().includes(searchLower)) ||
        mentor.specialties.some(spec => spec.toLowerCase().includes(searchLower)) ||
        mentor.description.toLowerCase().includes(searchLower)
      );
    }

    // Apply subject filter
    if (subject) {
      filtered = filtered.filter(mentor => mentor.subjects.includes(subject));
    }

    // Apply duration filter
    if (duration) {
      filtered = filtered.filter(mentor => mentor.duration === duration);
    }

    // Apply language filter
    if (language) {
      filtered = filtered.filter(mentor => 
        mentor.preferredLanguage.split(', ').map(lang => lang.trim()).includes(language)
      );
    }

    setFilteredMentors(filtered);
  };

  const handleSubjectFilter = (subject: string) => {
    setSelectedSubject(subject);
    applyFilters(subject, selectedDuration, selectedLanguage, searchQuery);
  };

  const handleDurationFilter = (duration: string) => {
    setSelectedDuration(duration);
    applyFilters(selectedSubject, duration, selectedLanguage, searchQuery);
  };

  const handleLanguageFilter = (language: string) => {
    setSelectedLanguage(language);
    applyFilters(selectedSubject, selectedDuration, language, searchQuery);
  };

  const handleSearchFilter = (query: string) => {
    setSearchQuery(query);
    applyFilters(selectedSubject, selectedDuration, selectedLanguage, query);
  };

  const handleClearFilters = () => {
    setSelectedSubject("");
    setSelectedDuration("");
    setSelectedLanguage("");
    setSearchQuery("");
    setFilteredMentors(mentors);
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
        <Filter 
          onSubjectFilter={handleSubjectFilter}
          onDurationFilter={handleDurationFilter}
          onLanguageFilter={handleLanguageFilter}
          onSearchFilter={handleSearchFilter}
          onClearFilters={handleClearFilters}
          selectedSubject={selectedSubject}
          selectedDuration={selectedDuration}
          selectedLanguage={selectedLanguage}
          searchQuery={searchQuery}
        />
        
        {/* Results Section */}
        {filteredMentors.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
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
        ) : (
          <div className="text-center py-16">
            <div className="bg-white rounded-2xl p-8 max-w-md mx-auto shadow-sm border border-gray-200">
              <div className="text-gray-400 mb-6">
                <svg className="mx-auto h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">No mentors found</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                We couldn't find any mentors matching your criteria.<br/>
                Try adjusting your search or clearing filters.
              </p>
              <Button 
                onClick={handleClearFilters} 
                variant="outline"
                className="bg-black text-white hover:bg-gray-800 border-black px-6 py-2.5"
              >
                Clear All Filters
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
