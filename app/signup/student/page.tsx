"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Complete form validation schema
const studentOnboardingSchema = z.object({
  // Part 1: Basic Information
  fullName: z.string().min(2, "Full name must be at least 2 characters").optional(),
  age: z.number().min(13, "Age must be at least 13").max(100, "Age must be less than 100").optional(),
  email: z.string().email("Please enter a valid email address").optional(),
  contactNumber: z.string().min(10, "Contact number must be at least 10 digits").optional(),

  // Part 2: Academic Background
  educationLevel: z.string().min(1, "Please select your education level").optional(),
  school: z.string().min(2, "School name must be at least 2 characters").optional(),

  // Part 3: Subject & Skill Assessment
  subjectsOfInterest: z.string().min(1, "Please enter at least one subject").optional(),
  currentYear: z.number().min(1, "Current year is required").optional(),
  skillLevels: z.record(z.enum(["Beginner", "Intermediate", "Advanced"])).optional(),
  learningStyle: z.string().min(1, "Please select a learning style").optional(),
  hasLearningDisabilities: z.boolean().optional(),
  learningDisabilitiesDescription: z.string().optional(),
});

type StudentOnboardingData = z.infer<typeof studentOnboardingSchema>;

const STORAGE_KEY = "student-onboarding-data";

export default function StudentOnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [subjects, setSubjects] = useState<string[]>([]);
  const router = useRouter();

  // Load saved data from localStorage
  const loadSavedData = (): Partial<StudentOnboardingData> => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    }
    return {};
  };

  // Save data to localStorage
  const saveData = (data: Partial<StudentOnboardingData>) => {
    if (typeof window !== "undefined") {
      const existing = loadSavedData();
      const updated = { ...existing, ...data };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }
  };

  const form = useForm<StudentOnboardingData>({
    resolver: zodResolver(studentOnboardingSchema),
    defaultValues: loadSavedData(),
    mode: "onChange",
  });

  // Save form data on every change
  useEffect(() => {
    const subscription = form.watch((data) => {
      saveData(data as Partial<StudentOnboardingData>);
    });
    return () => subscription.unsubscribe();
  }, [form]);

  const validateCurrentStep = (data: StudentOnboardingData) => {
    switch (currentStep) {
      case 1:
        return data.fullName && data.age && data.email && data.contactNumber;
      case 2:
        return data.educationLevel && data.school;
      case 3:
        return data.subjectsOfInterest && data.currentYear && data.learningStyle && data.hasLearningDisabilities !== undefined;
      default:
        return false;
    }
  };

  const onSubmit = (data: StudentOnboardingData) => {
    saveData(data);

    if (!validateCurrentStep(data)) {
      return; // Form validation will show errors
    }

    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      // Final submission - redirect to dashboard
      localStorage.removeItem(STORAGE_KEY);
      router.push("/dashboard/student");
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
        return <BasicInfoStep form={form} />;
      case 2:
        return <AcademicBackgroundStep form={form} />;
      case 3:
        return <SkillAssessmentStep form={form} subjects={subjects} setSubjects={setSubjects} />;
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
          <h1 className="text-2xl font-semibold mb-6 text-center">Student Onboarding</h1>

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

// Step 1: Basic Information
function BasicInfoStep({ form }: { form: any }) {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium">Part 1: Who Are You?</h2>

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
    </div>
  );
}

// Step 2: Academic Background
function AcademicBackgroundStep({ form }: { form: any }) {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium">Part 2: Academic Background</h2>

      <FormField
        control={form.control}
        name="educationLevel"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Current Education Level</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select your education level" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="grade-9">Grade 9</SelectItem>
                <SelectItem value="ordinary-level">Ordinary Level</SelectItem>
                <SelectItem value="advanced-level">Advanced Level</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="school"
        render={({ field }) => (
          <FormItem>
            <FormLabel>School</FormLabel>
            <FormControl>
              <Input placeholder="Enter your school name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

// Step 3: Subject & Skill Assessment
function SkillAssessmentStep({ form, subjects, setSubjects }: {
  form: any;
  subjects: string[];
  setSubjects: (subjects: string[]) => void;
}) {
  const [hasLearningDisabilities, setHasLearningDisabilities] = useState(false);

  const handleSubjectsChange = (value: string) => {
    const subjectList = value.split(',').map(s => s.trim()).filter(s => s.length > 0);
    setSubjects(subjectList);
    form.setValue('subjectsOfInterest', value);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium">Part 3: Subject & Skill Assessment</h2>

      <FormField
        control={form.control}
        name="subjectsOfInterest"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Subjects of Interest</FormLabel>
            <FormControl>
              <Input
                placeholder="Physics, Mathematics, Chemistry (comma separated)"
                {...field}
                onChange={(e) => {
                  field.onChange(e);
                  handleSubjectsChange(e.target.value);
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="currentYear"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Current Year</FormLabel>
            <FormControl>
              <Input
                type="number"
                placeholder="Enter your current year"
                {...field}
                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Skill levels for each subject */}
      {subjects.length > 0 && (
        <div className="space-y-4">
          <Label className="text-sm font-medium">Current Skill Level (Per Subject)</Label>
          {subjects.map((subject, index) => (
            <FormField
              key={index}
              control={form.control}
              name={`skillLevels.${subject}`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">{subject}</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-row space-x-6"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Beginner" id={`${subject}-beginner`} />
                        <Label htmlFor={`${subject}-beginner`} className="text-sm">Beginner</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Intermediate" id={`${subject}-intermediate`} />
                        <Label htmlFor={`${subject}-intermediate`} className="text-sm">Intermediate</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Advanced" id={`${subject}-advanced`} />
                        <Label htmlFor={`${subject}-advanced`} className="text-sm">Advanced</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
        </div>
      )}

      <FormField
        control={form.control}
        name="learningStyle"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Preferred Learning Style</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select your preferred learning style" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="visual">Visual</SelectItem>
                <SelectItem value="hands-on">Hands-On</SelectItem>
                <SelectItem value="theoretical">Theoretical</SelectItem>
                <SelectItem value="mixed">Mixed</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="hasLearningDisabilities"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Do you have any learning disabilities or accommodations needed?</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={(value) => {
                  const hasDisabilities = value === "yes";
                  field.onChange(hasDisabilities);
                  setHasLearningDisabilities(hasDisabilities);
                }}
                defaultValue={field.value ? "yes" : "no"}
                className="flex flex-row space-x-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="disabilities-yes" />
                  <Label htmlFor="disabilities-yes" className="text-sm">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="disabilities-no" />
                  <Label htmlFor="disabilities-no" className="text-sm">No</Label>
                </div>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {hasLearningDisabilities && (
        <FormField
          control={form.control}
          name="learningDisabilitiesDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Please describe your learning disabilities or accommodations needed</FormLabel>
              <FormControl>
                <Input placeholder="Describe your needs..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </div>
  );
}
