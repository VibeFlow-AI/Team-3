"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import Link from "next/link";
import { useRouter } from "next/navigation";

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

  // Part 2: Areas of Expertise
  subjectsToTeach: z.string().min(1, "Please enter at least one subject").optional(),
  teachingExperience: z.string().min(1, "Please select your teaching experience").optional(),
  preferredStudentLevels: z.array(z.string()).min(1, "Please select at least one student level").optional(),

  // Part 3: Social & Professional Links
  linkedinProfile: z.string().url("Please enter a valid LinkedIn URL").optional(),
  githubPortfolio: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  profilePicture: z.any().optional(),
});

type MentorOnboardingData = z.infer<typeof mentorOnboardingSchema>;

const STORAGE_KEY = "mentor-onboarding-data";

export default function MentorOnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedStudentLevels, setSelectedStudentLevels] = useState<string[]>([]);
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
      const existing = loadSavedData();
      const updated = { ...existing, ...data };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
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

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <PersonalInfoStep form={form} />;
      case 2:
        return <ExpertiseStep form={form} selectedStudentLevels={selectedStudentLevels} setSelectedStudentLevels={setSelectedStudentLevels} />;
      case 3:
        return <SocialLinksStep form={form} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f4f4] flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-white">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-black rounded-sm flex items-center justify-center">
            <div className="w-4 h-4 bg-white rounded-sm"></div>
          </div>
        </div>
        <nav className="flex items-center gap-8">
          <Link href="/" className="text-gray-700 hover:text-black">Home</Link>
          <Link href="/about" className="text-gray-700 hover:text-black">About</Link>
          <Button className="bg-black text-white hover:bg-gray-800">Get Started</Button>
        </nav>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="bg-white rounded-xl shadow-md p-8 w-full max-w-2xl">
          <h1 className="text-2xl font-semibold mb-6 text-center">Mentor Onboarding</h1>

          {/* Progress indicator */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-4">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step <= currentStep ? 'bg-black text-white' : 'bg-gray-200 text-gray-600'
                    }`}>
                    {step}
                  </div>
                  {step < 3 && (
                    <div className={`w-12 h-0.5 mx-2 ${step < currentStep ? 'bg-black' : 'bg-gray-200'
                      }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {renderStepContent()}

              <div className="flex justify-between pt-6">
                {currentStep > 1 && (
                  <Button type="button" variant="outline" onClick={goBack}>
                    Back
                  </Button>
                )}
                <Button type="submit" className="bg-black text-white hover:bg-gray-800 ml-auto">
                  {currentStep === 3 ? "Complete" : "Next"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}

// Step 1: Personal Information
function PersonalInfoStep({ form }: { form: any }) {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium">Part 1: Personal Information</h2>

      <FormField
        control={form.control}
        name="fullName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Full Name</FormLabel>
            <FormControl>
              <Input placeholder="Enter your full name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="age"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Age</FormLabel>
            <FormControl>
              <Input
                type="number"
                placeholder="Enter your age"
                {...field}
                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email Address</FormLabel>
            <FormControl>
              <Input type="email" placeholder="Enter your email" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="contactNumber"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Contact Number</FormLabel>
            <FormControl>
              <Input type="tel" placeholder="Enter your contact number" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="preferredLanguage"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Preferred Language</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select your preferred language" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="english">English</SelectItem>
                <SelectItem value="sinhala">Sinhala</SelectItem>
                <SelectItem value="tamil">Tamil</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="currentLocation"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Current Location</FormLabel>
            <FormControl>
              <Input placeholder="Enter your current location" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="shortBio"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Short Bio</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Introduce yourself in 2-3 sentences"
                className="min-h-20"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="professionalRole"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Professional Role</FormLabel>
            <FormControl>
              <Input placeholder="Enter your professional role" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

// Step 2: Areas of Expertise
function ExpertiseStep({ form, selectedStudentLevels, setSelectedStudentLevels }: {
  form: any;
  selectedStudentLevels: string[];
  setSelectedStudentLevels: (levels: string[]) => void;
}) {
  const studentLevelOptions = [
    { id: "grade-3-5", label: "Grade 3-5" },
    { id: "grade-6-9", label: "Grade 6-9" },
    { id: "grade-10-11", label: "Grade 10-11" },
    { id: "advanced-level", label: "Advanced Level" },
  ];

  const handleStudentLevelChange = (levelId: string, checked: boolean) => {
    let updatedLevels: string[];
    if (checked) {
      updatedLevels = [...selectedStudentLevels, levelId];
    } else {
      updatedLevels = selectedStudentLevels.filter(id => id !== levelId);
    }
    setSelectedStudentLevels(updatedLevels);
    form.setValue('preferredStudentLevels', updatedLevels);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium">Part 2: Areas of Expertise</h2>

      <FormField
        control={form.control}
        name="subjectsToTeach"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Subjects you are planning to teach</FormLabel>
            <FormControl>
              <Input placeholder="Physics, Chemistry, Mathematics (comma separated)" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="teachingExperience"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Teaching/Training Experience</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select your teaching experience" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="1-3-years">1-3 years</SelectItem>
                <SelectItem value="3-5-years">3-5 years</SelectItem>
                <SelectItem value="5-plus-years">5+ years</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="preferredStudentLevels"
        render={() => (
          <FormItem>
            <FormLabel>Preferred Level of Students</FormLabel>
            <div className="space-y-3">
              {studentLevelOptions.map((option) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={option.id}
                    checked={selectedStudentLevels.includes(option.id)}
                    onCheckedChange={(checked) => handleStudentLevelChange(option.id, checked as boolean)}
                  />
                  <Label htmlFor={option.id} className="text-sm font-normal">
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

// Step 3: Social & Professional Links
function SocialLinksStep({ form }: { form: any }) {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium">Part 3: Social & Professional Links</h2>

      <FormField
        control={form.control}
        name="linkedinProfile"
        render={({ field }) => (
          <FormItem>
            <FormLabel>LinkedIn Profile <span className="text-red-500">*</span></FormLabel>
            <FormControl>
              <Input
                type="url"
                placeholder="https://linkedin.com/in/your-profile"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="githubPortfolio"
        render={({ field }) => (
          <FormItem>
            <FormLabel>GitHub or Portfolio <span className="text-gray-500">(Optional)</span></FormLabel>
            <FormControl>
              <Input
                type="url"
                placeholder="https://github.com/your-username or your portfolio URL"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="profilePicture"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Upload Profile Picture</FormLabel>
            <FormControl>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => field.onChange(e.target.files?.[0])}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
