"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight } from "lucide-react";

// Complete form validation schema
const mentorOnboardingSchema = z.object({
  // Part 1: Personal Information
  fullName: z.string().min(2, "Full name must be at least 2 characters").optional(),
  age: z.number().min(18, "Age must be at least 18").max(100, "Age must be less than 100").optional(),
  email: z.string().email("Please enter a valid email address").optional(),
  contactNumber: z.string().min(10, "Contact number must be at least 10 digits").optional(),
  preferredLanguage: z.string().min(1, "Please select a preferred language").optional(),
  currentLocation: z.string().min(2, "Location must be at least 2 characters").optional(),
  shortBio: z.string().min(10, "Bio must be at least 10 characters").max(500, "Bio must be less than 500 characters").optional(),
  professionalRole: z.string().min(2, "Professional role must be at least 2 characters").optional(),

  // Part 2: Expertise and Teaching
  subjectsToTeach: z.string().min(1, "Please select at least one subject").optional(),
  teachingExperience: z.string().min(1, "Please select your teaching experience").optional(),
  preferredStudentLevels: z.array(z.string()).min(1, "Please select at least one student level").optional(),
  availabilityHours: z.string().optional(),
  sessionDuration: z.string().optional(),
  teachingStyle: z.string().optional(),

  // Part 3: Social Links and Verification
  linkedinProfile: z.string().url("Please enter a valid LinkedIn URL").optional(),
  portfolioWebsite: z.string().url("Please enter a valid website URL").optional().or(z.literal("")),
  githubProfile: z.string().url("Please enter a valid GitHub URL").optional().or(z.literal("")),
  certifications: z.string().optional(),
  additionalInfo: z.string().max(1000, "Additional info must be less than 1000 characters").optional(),
});

type MentorOnboardingData = z.infer<typeof mentorOnboardingSchema>;

const STORAGE_KEY = "mentor-onboarding-data";

export default function MentorOnboarding() {
  const [currentStep, setCurrentStep] = useState(1);
  const router = useRouter();

  // Load saved data from localStorage
  const loadSavedData = (): Partial<MentorOnboardingData> => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    }
    return {};
  };

  // Save data to localStorage
  const saveData = (data: Partial<MentorOnboardingData>) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
  };

  const form = useForm<MentorOnboardingData>({
    resolver: zodResolver(mentorOnboardingSchema),
    defaultValues: loadSavedData(),
    mode: "onChange",
  });

  // Save form data on every change
  useEffect(() => {
    const subscription = form.watch((data) => {
      saveData(data as Partial<MentorOnboardingData>);
    });
    return () => subscription.unsubscribe();
  }, [form]);

  const validateCurrentStep = (data: MentorOnboardingData) => {
    switch (currentStep) {
      case 1:
        return data.fullName && data.age && data.email && data.contactNumber &&
          data.preferredLanguage && data.currentLocation && data.shortBio && data.professionalRole;
      case 2:
        return data.subjectsToTeach && data.teachingExperience && data.preferredStudentLevels?.length;
      case 3:
        return data.linkedinProfile;
      default:
        return false;
    }
  };

  const onSubmit = (data: MentorOnboardingData) => {
    saveData(data);

    if (!validateCurrentStep(data)) {
      return; // Form validation will show errors
    }

    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      // Final submission - redirect to dashboard
      localStorage.removeItem(STORAGE_KEY);
      router.push("/dashboard/mentor");
    }
  };

  const goBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      const savedData = loadSavedData();
      form.reset(savedData);
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return "Personal Information";
      case 2: return "Teaching Expertise";
      case 3: return "Professional Links";
      default: return "";
    }
  };

  const progress = (currentStep / 3) * 100;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Mentor Onboarding</h1>
              <p className="text-gray-600">Step {currentStep} of 3: {getStepTitle()}</p>
            </div>
            <Progress value={progress} className="w-full" />
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Step content would go here - simplified for brevity */}
              <div className="text-center py-8">
                <p className="text-gray-600">Mentor onboarding form content for step {currentStep}</p>
                <p className="text-sm text-gray-500 mt-2">
                  This is a placeholder. The actual form fields would be implemented here.
                </p>
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={goBack}
                  disabled={currentStep === 1}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </Button>
                <Button
                  type="submit"
                  className="flex items-center gap-2"
                >
                  {currentStep === 3 ? "Complete" : "Next"}
                  {currentStep < 3 && <ArrowRight className="w-4 h-4" />}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
