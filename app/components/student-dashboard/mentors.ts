export interface Mentor {
  name: string;
  initials: string;
  subjects: string[];
  description: string;
  duration: string;
  preferredLanguage: string;
  initialsColor: string;
  rating: number;
  experience: string;
  specialties: string[];
}

export const mentors: Mentor[] = [
  {
    name: "Rahul Lavan",
    initials: "RL",
    subjects: ["Science", "Physics", "Biology"],
    description: "Experienced science teacher with 8+ years in STEM education. Specializes in making complex physics concepts accessible to students of all levels.",
    duration: "30 mins - 1 hour",
    preferredLanguage: "English, Tamil",
    initialsColor: "#60A5FA", // blue
    rating: 4.9,
    experience: "8+ years",
    specialties: ["Advanced Physics", "Laboratory Techniques", "Exam Preparation"]
  },
  {
    name: "Chathum Rahal",
    initials: "CR", 
    subjects: ["Mathematics", "History", "English"],
    description: "Mathematics expert with a passion for helping students overcome math anxiety. Combines historical context with mathematical concepts for engaging learning.",
    duration: "1 hour",
    preferredLanguage: "English",
    initialsColor: "#F97316", // orange
    rating: 4.8,
    experience: "6+ years",
    specialties: ["Calculus", "Statistics", "Mathematical History"]
  },
  {
    name: "Malsha Fernando",
    initials: "MF",
    subjects: ["Chemistry", "Art", "Commerce"],
    description: "Creative educator blending art and science. Helps students understand chemistry through visual arts and real-world commercial applications.",
    duration: "1 hour",
    preferredLanguage: "Sinhala",
    initialsColor: "#EC4899", // pink
    rating: 4.7,
    experience: "5+ years",
    specialties: ["Organic Chemistry", "Art Integration", "Business Chemistry"]
  },
  {
    name: "Dr. Sarah Mitchell",
    initials: "SM",
    subjects: ["Mathematics", "Statistics", "Data Science"],
    description: "PhD in Applied Mathematics with industry experience in data analytics. Specializes in making statistical concepts practical and relevant.",
    duration: "1-2 hours",
    preferredLanguage: "English",
    initialsColor: "#10B981", // green
    rating: 4.9,
    experience: "12+ years",
    specialties: ["Advanced Statistics", "Machine Learning", "Research Methods"]
  },
  {
    name: "Ahmed Hassan",
    initials: "AH",
    subjects: ["Physics", "Engineering", "Mathematics"],
    description: "Mechanical engineer turned educator with expertise in applied physics. Brings real-world engineering experience to the classroom.",
    duration: "1 hour",
    preferredLanguage: "English, Arabic",
    initialsColor: "#8B5CF6", // purple
    rating: 4.8,
    experience: "10+ years",
    specialties: ["Mechanics", "Thermodynamics", "Engineering Mathematics"]
  },
  {
    name: "Lisa Chen",
    initials: "LC",
    subjects: ["Computer Science", "Mathematics", "Technology"],
    description: "Software developer and computer science educator. Focuses on practical programming skills and computational thinking.",
    duration: "30 mins - 1 hour",
    preferredLanguage: "English, Chinese",
    initialsColor: "#F59E0B", // amber
    rating: 4.9,
    experience: "7+ years",
    specialties: ["Python Programming", "Algorithms", "Web Development"]
  },
  {
    name: "Maria Rodriguez",
    initials: "MR",
    subjects: ["Spanish", "Literature", "History"],
    description: "Native Spanish speaker with expertise in Latin American literature and history. Creates immersive cultural learning experiences.",
    duration: "1 hour",
    preferredLanguage: "Spanish, English",
    initialsColor: "#EF4444", // red
    rating: 4.7,
    experience: "9+ years",
    specialties: ["Advanced Spanish", "Latin Literature", "Cultural Studies"]
  },
  {
    name: "James Thompson",
    initials: "JT",
    subjects: ["English", "Writing", "Communication"],
    description: "Professional writer and English literature professor. Helps students develop strong writing skills and literary analysis abilities.",
    duration: "1-2 hours",
    preferredLanguage: "English",
    initialsColor: "#06B6D4", // cyan
    rating: 4.8,
    experience: "15+ years",
    specialties: ["Creative Writing", "Essay Writing", "Literary Analysis"]
  },
  {
    name: "Priya Sharma",
    initials: "PS",
    subjects: ["Biology", "Chemistry", "Environmental Science"],
    description: "Marine biologist with research experience in environmental conservation. Passionate about connecting students with nature through science.",
    duration: "30 mins - 1 hour",
    preferredLanguage: "English, Hindi",
    initialsColor: "#84CC16", // lime
    rating: 4.9,
    experience: "11+ years",
    specialties: ["Marine Biology", "Ecology", "Conservation Science"]
  },
  {
    name: "David Kim",
    initials: "DK",
    subjects: ["Economics", "Business", "Statistics"],
    description: "Former investment analyst with expertise in economic modeling and business strategy. Makes economics relevant and engaging.",
    duration: "1 hour",
    preferredLanguage: "English, Korean",
    initialsColor: "#6366F1", // indigo
    rating: 4.6,
    experience: "8+ years",
    specialties: ["Microeconomics", "Financial Analysis", "Business Strategy"]
  },
  {
    name: "Emma Watson",
    initials: "EW",
    subjects: ["Psychology", "Sociology", "Philosophy"],
    description: "Clinical psychologist and academic researcher. Helps students understand human behavior and social dynamics through evidence-based approaches.",
    duration: "1-2 hours",
    preferredLanguage: "English",
    initialsColor: "#DC2626", // red-600
    rating: 4.8,
    experience: "13+ years",
    specialties: ["Cognitive Psychology", "Social Research", "Ethics"]
  },
  {
    name: "Roberto Silva",
    initials: "RS",
    subjects: ["Art", "Design", "History"],
    description: "Professional artist and art historian. Combines technical artistic skills with deep knowledge of art movements and cultural context.",
    duration: "1 hour",
    preferredLanguage: "Portuguese, English",
    initialsColor: "#7C3AED", // violet
    rating: 4.7,
    experience: "10+ years",
    specialties: ["Digital Art", "Art History", "Design Thinking"]
  },
  {
    name: "Sophie Laurent",
    initials: "SL",
    subjects: ["French", "Literature", "Cultural Studies"],
    description: "Native French speaker and literature professor from Paris. Offers authentic French language immersion and cultural insights.",
    duration: "30 mins - 1 hour",
    preferredLanguage: "French, English",
    initialsColor: "#059669", // emerald
    rating: 4.9,
    experience: "12+ years",
    specialties: ["Advanced French", "French Literature", "Francophone Culture"]
  },
  {
    name: "Michael Brown",
    initials: "MB",
    subjects: ["Music", "Mathematics", "Technology"],
    description: "Professional musician and music technologist. Explores the mathematical foundations of music and modern music production techniques.",
    duration: "1 hour",
    preferredLanguage: "English",
    initialsColor: "#F97316", // orange-500
    rating: 4.6,
    experience: "9+ years",
    specialties: ["Music Theory", "Digital Audio", "Sound Engineering"]
  },
  {
    name: "Dr. Aisha Patel",
    initials: "AP",
    subjects: ["Medicine", "Biology", "Health Sciences"],
    description: "Medical doctor with teaching experience in anatomy and physiology. Helps pre-med students understand complex medical concepts.",
    duration: "1-2 hours",
    preferredLanguage: "English, Gujarati",
    initialsColor: "#BE185D", // pink-700
    rating: 4.9,
    experience: "16+ years",
    specialties: ["Human Anatomy", "Medical Ethics", "Health Research"]
  }
];
