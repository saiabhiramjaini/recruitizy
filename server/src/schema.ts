// import { z } from "zod";

// export const signupSchema = z.object({
//   username: z.string().min(1, { message: "Username is required." }),
//   email: z.string().email({ message: "Invalid email address." }),
//   password: z
//     .string()
//     .min(8, { message: "Password must be at least 8 characters long." }),
//   cPassword: z.string().min(8, {
//     message: "Confirmation password must be at least 8 characters long.",
//   }),
// });

// export const signinSchema = z.object({
//   email: z.string().email({ message: "Invalid email address." }),
//   password: z
//     .string()
//     .min(8, { message: "Password must be at least 8 characters long." }),
// });

// export const forgotPasswordSchema = z.object({
//   email: z.string().email({ message: "Invalid email address." }),
// });

// export const resetPasswordSchema = z.object({
//   password: z
//     .string()
//     .min(8, { message: "Password must be at least 8 characters long." }),
//   cPassword: z.string().min(8, {
//     message: "Confirmation password must be at least 8 characters long.",
//   }),
// });

// export type SignupInput = z.infer<typeof signupSchema>;
// export type SigninInput = z.infer<typeof signinSchema>;
// export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
// export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;



// export const createCompanySchema = z.object({
//   name: z.string()
//     .min(3, { message: "Company name must be at least 3 characters" })
//     .max(100, { message: "Company name cannot exceed 100 characters" }),

//   about: z.string()
//     .min(10, { message: "About section must be at least 10 characters" })
//     .max(2000, { message: "About section cannot exceed 2000 characters" }),

//   companySize: z.number()
//     .int({ message: "Company size must be an integer" })
//     .positive({ message: "Company size must be a positive number" })
//     .min(1, { message: "Company size must be at least 1" })
//     .max(1000000, { message: "Company size cannot exceed 1,000,000" }),

//   locations: z.array(z.string()
//     .min(2, { message: "Each location must be at least 2 characters" })
//     .max(100, { message: "Each location cannot exceed 100 characters" })
//   ).min(1, { message: "At least one location is required" }),

//   headquarters: z.string()
//     .min(2, { message: "Headquarters must be at least 2 characters" })
//     .max(100, { message: "Headquarters cannot exceed 100 characters" }),

//   foundedYear: z.number()
//     .int({ message: "Founded year must be an integer" })
//     .min(1800, { message: "Founded year cannot be before 1800" })
//     .max(new Date().getFullYear(), { message: "Founded year cannot be in the future" }),

//   coreTechnologies: z.array(z.string())
//     .min(1, { message: "At least one core technology is required" })
//     .max(20, { message: "Cannot select more than 20 core technologies" }),

//   industry: z.string()
//     .min(1, { message: "Industry must be selected" }),

//   website: z.string()
//     .url({ message: "Website must be a valid URL" })
//     .max(200, { message: "Website URL cannot exceed 200 characters" })
//     .optional()
//     .or(z.literal("")),

//   linkedIn: z.string()
//     .url({ message: "LinkedIn must be a valid URL" })
//     .max(200, { message: "LinkedIn URL cannot exceed 200 characters" })
//     .optional()
//     .or(z.literal("")),

//   twitter: z.string()
//     .url({ message: "Twitter must be a valid URL" })
//     .max(200, { message: "Twitter URL cannot exceed 200 characters" })
//     .optional()
//     .or(z.literal("")),

//   facebook: z.string()
//     .url({ message: "Facebook must be a valid URL" })
//     .max(200, { message: "Facebook URL cannot exceed 200 characters" })
//     .optional()
//     .or(z.literal("")),

//   instagram: z.string()
//     .url({ message: "Instagram must be a valid URL" })
//     .max(200, { message: "Instagram URL cannot exceed 200 characters" })
//     .optional()
//     .or(z.literal("")),

//   contactEmail: z.string()
//     .email({ message: "Contact email must be valid" })
//     .max(100, { message: "Contact email cannot exceed 100 characters" })
//     .optional()
//     .or(z.literal("")),

//   contactPhone: z.string()
//     .min(6, { message: "Contact phone must be at least 6 characters" })
//     .max(20, { message: "Contact phone cannot exceed 20 characters" })
//     .regex(/^[+\d][\d\s-]+$/, { message: "Contact phone must be a valid phone number" })
//     .optional()
//     .or(z.literal("")),
// });

// export type CompanyCreateInput = z.infer<typeof createCompanySchema>;


// export const createJobSchema = z.object({
//   title: z.string()
//     .min(3, { message: "Title must be at least 3 characters" })
//     .max(100, { message: "Title cannot exceed 100 characters" }),

//   description: z.string()
//     .min(10, { message: "Description must be at least 10 characters" })
//     .max(5000, { message: "Description cannot exceed 5000 characters" }),

//   role: z.string()
//     .min(3, { message: "Role must be at least 3 characters" })
//     .max(100, { message: "Role cannot exceed 100 characters" }),

//   responsibilities: z.string()
//     .min(10, { message: "Responsibilities must be at least 10 characters" })
//     .max(2000, { message: "Responsibilities cannot exceed 2000 characters" }),

//   interviewRounds: z.number()
//     .int({ message: "Interview rounds must be an integer" })
//     .min(1, { message: "Minimum 1 interview round required" })
//     .max(10, { message: "Maximum 10 interview rounds allowed" }),

//   interviewProcess: z.string()
//     .min(10, { message: "Interview process must be at least 10 characters" })
//     .max(1000, { message: "Interview process cannot exceed 1000 characters" }),

//   shortlistedCandidates: z.number()
//     .int({ message: "Shortlisted candidates must be an integer" })
//     .min(0, { message: "Shortlisted candidates cannot be negative" })
//     .optional(),

//   numberOfPositions: z.number()
//     .int({ message: "Number of positions must be an integer" })
//     .min(1, { message: "At least 1 position required" })
//     .optional(),

//   location: z.string()
//     .min(2, { message: "Location must be at least 2 characters" })
//     .max(100, { message: "Location cannot exceed 100 characters" }),

//   type: z.string()
//     .min(2, { message: "Job type must be at least 2 characters" })
//     .max(20, { message: "Job type cannot exceed 20 characters" }),

//   experience: z.string()
//     .min(2, { message: "Experience must be at least 2 characters" })
//     .max(20, { message: "Experience cannot exceed 20 characters" }),

//   education: z.string()
//     .min(2, { message: "Education must be at least 2 characters" })
//     .max(20, { message: "Education cannot exceed 20 characters" }),

//   status: z.enum(["Open", "Closed"], {
//     errorMap: () => ({ message: "Status must be either Open or Closed" })
//   }).default("Open"),

//   skills: z.array(z.string()
//     .min(1, { message: "Each skill must be at least 1 character" })
//   ).min(1, { message: "At least one skill is required" }),

//   remote: z.boolean()
//     .default(false),

//   deadline: z.string()
//     .datetime({ message: "Deadline must be a valid ISO datetime string" })
//     .optional()
//     .transform((str) => (str ? new Date(str) : undefined)),

//   threshold: z.number()
//     .int({ message: "Threshold must be an integer" })
//     .min(1, { message: "Minimum threshold is 1" })
//     .max(100, { message: "Maximum threshold is 100" }),

//   jdSummary: z.string()
//     .max(50000, { message: "Job summary cannot exceed 500 characters" })
//     .optional()
//     .or(z.literal("")),
// });

// export type JobCreateInput = z.infer<typeof createJobSchema>;

// export const applicationSchema = z.object({
//   firstName: z.string()
//     .min(2, { message: "First name must be at least 2 characters" })
//     .max(50, { message: "First name cannot exceed 50 characters" }),

//   lastName: z.string()
//     .min(2, { message: "Last name must be at least 2 characters" })
//     .max(50, { message: "Last name cannot exceed 50 characters" }),

//   email: z.string()
//     .email({ message: "Please enter a valid email address" })
//     .max(100, { message: "Email cannot exceed 100 characters" }),

//   phone: z.string()
//     .min(10, { message: "Phone number must be at least 10 digits" })
//     .max(15, { message: "Phone number cannot exceed 15 digits" })
//     .regex(/^[+\d][\d\s-]+$/, { message: "Please enter a valid phone number" })
//     .optional()
//     .or(z.literal("")),

//   resume: z.string()
//     .url({ message: "Resume must be a valid URL" }),

//   coverLetter: z.string()
//     .max(50000, { message: "Cover letter cannot exceed 50000 characters" })
//     .optional()
//     .or(z.literal("")),

//   experience: z.array(z.object({
//     company: z.string()
//       .min(2, { message: "Company name must be at least 2 characters" })
//       .max(100, { message: "Company name cannot exceed 100 characters" }),
//     position: z.string()
//       .min(2, { message: "Position must be at least 2 characters" })
//       .max(100, { message: "Position cannot exceed 100 characters" }),
//     duration: z.string()
//       .min(4, { message: "Duration must be at least 4 characters (e.g., '2020-2022')" })
//       .max(50, { message: "Duration cannot exceed 50 characters" }),
//     description: z.string()
//       .max(5000, { message: "Description cannot exceed 5000 characters" })
//       .optional()
//       .or(z.literal(""))
//   }))
//     .max(10, { message: "Maximum 10 experience entries allowed" })
//     .optional(),

//   education: z.array(z.object({
//     institution: z.string()
//       .min(2, { message: "Institution name must be at least 2 characters" })
//       .max(100, { message: "Institution name cannot exceed 100 characters" }),
//     degree: z.string()
//       .min(2, { message: "Degree must be at least 2 characters" })
//       .max(100, { message: "Degree cannot exceed 100 characters" }),
//     fieldOfStudy: z.string()
//       .min(2, { message: "Field of study must be at least 2 characters" })
//       .max(100, { message: "Field of study cannot exceed 100 characters" }),
//     year: z.string()
//       .min(4, { message: "Year must be at least 4 characters (e.g., '2020')" })
//       .max(50, { message: "Year cannot exceed 50 characters" }),
//   }))
//     .max(5, { message: "Maximum 5 education entries allowed" })
//     .optional(),

//   projects: z.array(z.object({
//     title: z.string()
//       .min(2, { message: "Project title must be at least 2 characters" })
//       .max(100, { message: "Project title cannot exceed 100 characters" }),
//     description: z.string()
//       .min(10, { message: "Project description must be at least 10 characters" })
//       .max(2000, { message: "Project description cannot exceed 2000 characters" }),
//     techStack: z.array(z.string()
//       .min(1, { message: "Each technology must be at least 1 character" })
//       .max(50, { message: "Each technology cannot exceed 50 characters" })
//     )
//       .max(20, { message: "Maximum 20 technologies per project allowed" }),
//     githubLink: z.string()
//       .url({ message: "GitHub link must be a valid URL" })
//       .optional()
//       .or(z.literal("")),
//     deployedLink: z.string()
//       .url({ message: "Deployed link must be a valid URL" })
//       .optional()
//       .or(z.literal("")),
//     timePeriod: z.string()
//       .min(4, { message: "Time period must be at least 4 characters (e.g., '2023')" })
//       .max(50, { message: "Time period cannot exceed 50 characters" })
//   }))
//     .max(10, { message: "Maximum 10 project entries allowed" })
//     .optional(),

//   certifications: z.array(z.string()
//     .min(2, { message: "Each certification must be at least 2 characters" })
//     .max(200, { message: "Each certification cannot exceed 200 characters" })
//   )
//     .max(20, { message: "Maximum 20 certifications allowed" })
//     .optional(),

//   achievements: z.array(z.string()
//     .min(10, { message: "Each achievement must be at least 10 characters" })
//     .max(500, { message: "Each achievement cannot exceed 500 characters" })
//   )
//     .max(20, { message: "Maximum 20 achievements allowed" })
//     .optional(),

//   portfolio: z.string()
//     .url({ message: "Portfolio must be a valid URL" })
//     .optional()
//     .or(z.literal("")),

//   linkedIn: z.string()
//     .url({ message: "LinkedIn must be a valid URL" })
//     .optional()
//     .or(z.literal("")),

//   github: z.string()
//     .url({ message: "GitHub must be a valid URL" })
//     .optional()
//     .or(z.literal("")),

//   skills: z.array(z.string()
//     .min(1, { message: "Each skill must be at least 1 character" })
//     .max(50, { message: "Each skill cannot exceed 50 characters" })
//   )
//     .min(1, { message: "At least one skill is required" })
//     .max(20, { message: "Maximum 20 skills allowed" })
// });

// export type ApplicationInput = z.infer<typeof applicationSchema>;


import { z } from "zod";

export const signupSchema = z.object({
  username: z.string().min(1, { message: "Username is required." }),
  email: z.string().email({ message: "Invalid email address." }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long." }),
  cPassword: z.string().min(8, {
    message: "Confirmation password must be at least 8 characters long.",
  }),
});

export const signinSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long." }),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
});

export const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long." }),
  cPassword: z.string().min(8, {
    message: "Confirmation password must be at least 8 characters long.",
  }),
});

export type SignupInput = z.infer<typeof signupSchema>;
export type SigninInput = z.infer<typeof signinSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

// Define the Industry enum values to match Prisma schema
const IndustryValues = [
  "Technology",
  "Finance_Banking",
  "Healthcare_Biotech",
  "Manufacturing_Automotive",
  "Retail_Consumer_Goods",
  "Energy_Utilities",
  "Media_Entertainment",
  "Telecommunications",
  "Transportation_Logistics",
  "Real_Estate_Construction",
  "Education",
  "Government_Public_Sector",
  "Non_Profit_Social_Impact",
  "Other"
] as const;

// Define the CoreTechnology enum values to match Prisma schema
const CoreTechnologyValues = [
  "Artificial_Intelligence",
  "Machine_Learning",
  "Blockchain",
  "Cloud_Computing",
  "Cybersecurity",
  "Data_Science",
  "Internet_of_Things_IoT",
  "Augmented_Reality_AR",
  "Virtual_Reality_VR",
  "Mobile_Development",
  "Web_Development",
  "DevOps",
  "Software_Development",
  "Testing_Quality_Assurance"
] as const;

export const createCompanySchema = z.object({
  name: z.string()
    .min(3, { message: "Company name must be at least 3 characters" })
    .max(100, { message: "Company name cannot exceed 100 characters" }),

  about: z.string()
    .min(10, { message: "About section must be at least 10 characters" })
    .max(2000, { message: "About section cannot exceed 2000 characters" }),

  companySize: z.number()
    .int({ message: "Company size must be an integer" })
    .positive({ message: "Company size must be a positive number" })
    .min(1, { message: "Company size must be at least 1" })
    .max(1000000, { message: "Company size cannot exceed 1,000,000" }),

  locations: z.array(z.string()
    .min(2, { message: "Each location must be at least 2 characters" })
    .max(100, { message: "Each location cannot exceed 100 characters" })
  ).min(1, { message: "At least one location is required" }),

  headquarters: z.string()
    .min(2, { message: "Headquarters must be at least 2 characters" })
    .max(100, { message: "Headquarters cannot exceed 100 characters" }),

  foundedYear: z.number()
    .int({ message: "Founded year must be an integer" })
    .min(1800, { message: "Founded year cannot be before 1800" })
    .max(new Date().getFullYear(), { message: "Founded year cannot be in the future" }),

  coreTechnologies: z.array(z.enum(CoreTechnologyValues, {
    errorMap: () => ({ message: "Please select valid core technologies" })
  }))
    .min(1, { message: "At least one core technology is required" })
    .max(20, { message: "Cannot select more than 20 core technologies" }),

  industry: z.enum(IndustryValues, {
    errorMap: () => ({ message: "Please select a valid industry" })
  }),

  website: z.string()
    .url({ message: "Website must be a valid URL" })
    .max(200, { message: "Website URL cannot exceed 200 characters" })
    .optional()
    .or(z.literal("")),

  linkedIn: z.string()
    .url({ message: "LinkedIn must be a valid URL" })
    .max(200, { message: "LinkedIn URL cannot exceed 200 characters" })
    .optional()
    .or(z.literal("")),

  twitter: z.string()
    .url({ message: "Twitter must be a valid URL" })
    .max(200, { message: "Twitter URL cannot exceed 200 characters" })
    .optional()
    .or(z.literal("")),

  facebook: z.string()
    .url({ message: "Facebook must be a valid URL" })
    .max(200, { message: "Facebook URL cannot exceed 200 characters" })
    .optional()
    .or(z.literal("")),

  instagram: z.string()
    .url({ message: "Instagram must be a valid URL" })
    .max(200, { message: "Instagram URL cannot exceed 200 characters" })
    .optional()
    .or(z.literal("")),

  contactEmail: z.string()
    .email({ message: "Contact email must be valid" })
    .max(100, { message: "Contact email cannot exceed 100 characters" })
    .optional()
    .or(z.literal("")),

  contactPhone: z.string()
    .min(6, { message: "Contact phone must be at least 6 characters" })
    .max(20, { message: "Contact phone cannot exceed 20 characters" })
    .regex(/^[+\d][\d\s-]+$/, { message: "Contact phone must be a valid phone number" })
    .optional()
    .or(z.literal("")),
});

export type CompanyCreateInput = z.infer<typeof createCompanySchema>;

// Define Job-related enum values
const JobTypeValues = ["Full_time", "Part_time", "Contract", "Internship"] as const;
const EducationLevelValues = [
  "High_School_Diploma",
  "Associates_Degree",
  "Bachelors_Degree",
  "Masters_Degree",
  "PhD",
  "Other"
] as const;

const SkillValues = [
  "JavaScript_TypeScript",
  "Python",
  "Java",
  "CSharp",
  "C_CPlusPlus",
  "Go_Golang",
  "Rust",
  "Kotlin",
  "Swift",
  "PHP",
  "Ruby",
  "Scala",
  "Dart",
  "R",
  "Elixir",
  "Perl",
  "Frontend_Development",
  "ReactJS",
  "Angular",
  "VueJS",
  "Svelte",
  "NextJS",
  "NuxtJS",
  "HTML_CSS",
  "Tailwind_CSS",
  "Bootstrap",
  "WebAssembly",
  "Backend_Development",
  "NodeJS",
  "ExpressJS",
  "Django",
  "Flask",
  "FastAPI",
  "Spring_Boot",
  "Laravel",
  "Ruby_on_Rails",
  "ASP_NET",
  "NestJS",
  "GraphQL",
  "REST_APIs",
  "React_Native",
  "Flutter",
  "Swift_iOS",
  "Kotlin_Android",
  "Xamarin",
  "Ionic",
  "PostgreSQL",
  "MySQL",
  "MongoDB",
  "Firebase",
  "SQLite",
  "Microsoft_SQL_Server",
  "Oracle_DB",
  "Cassandra",
  "Redis",
  "DynamoDB",
  "Neo4j_Graph_DB",
  "AWS_Amazon_Web_Services",
  "Azure",
  "Google_Cloud_GCP",
  "Docker",
  "Kubernetes",
  "Terraform",
  "Ansible",
  "Jenkins",
  "GitHub_Actions",
  "CI_CD_Pipelines",
  "Serverless_AWS_Lambda_Azure_Functions",
  "AI_ML_Data_Science",
  "TensorFlow",
  "PyTorch",
  "Scikit_learn",
  "Keras",
  "OpenAI_GPT",
  "LangChain",
  "Hugging_Face",
  "Pandas",
  "NumPy",
  "Apache_Spark",
  "Hadoop",
  "Blockchain_Web3",
  "Solidity",
  "Ethereum",
  "Polygon",
  "Solana",
  "Hyperledger",
  "Web3JS_EthersJS",
  "Cybersecurity_General",
  "Penetration_Testing",
  "Ethical_Hacking",
  "SIEM_Tools_Splunk_Wazuh",
  "Cryptography",
  "Zero_Trust_Security",
  "Game_Development",
  "Unity",
  "Unreal_Engine",
  "Godot",
  "Phaser",
  "Others",
  "IoT_Internet_of_Things",
  "AR_VR_Augmented_Virtual_Reality",
  "Embedded_Systems",
  "Robotics",
  "Quantum_Computing"
] as const;

export const createJobSchema = z.object({
  title: z.string()
    .min(3, { message: "Title must be at least 3 characters" })
    .max(100, { message: "Title cannot exceed 100 characters" }),

  description: z.string()
    .min(10, { message: "Description must be at least 10 characters" })
    .max(5000, { message: "Description cannot exceed 5000 characters" }),

  role: z.string()
    .min(3, { message: "Role must be at least 3 characters" })
    .max(100, { message: "Role cannot exceed 100 characters" }),

  responsibilities: z.string()
    .min(10, { message: "Responsibilities must be at least 10 characters" })
    .max(2000, { message: "Responsibilities cannot exceed 2000 characters" }),

  interviewRounds: z.number()
    .int({ message: "Interview rounds must be an integer" })
    .min(1, { message: "Minimum 1 interview round required" })
    .max(10, { message: "Maximum 10 interview rounds allowed" }),

  interviewProcess: z.string()
    .min(10, { message: "Interview process must be at least 10 characters" })
    .max(1000, { message: "Interview process cannot exceed 1000 characters" }),

  shortlistedCandidates: z.number()
    .int({ message: "Shortlisted candidates must be an integer" })
    .min(0, { message: "Shortlisted candidates cannot be negative" })
    .optional(),

  numberOfPositions: z.number()
    .int({ message: "Number of positions must be an integer" })
    .min(1, { message: "At least 1 position required" })
    .optional(),

  location: z.string()
    .min(2, { message: "Location must be at least 2 characters" })
    .max(100, { message: "Location cannot exceed 100 characters" }),

  type: z.enum(JobTypeValues, {
    errorMap: () => ({ message: "Please select a valid job type" })
  }),

  experience: z.string()
    .min(2, { message: "Experience must be at least 2 characters" })
    .max(20, { message: "Experience cannot exceed 20 characters" }),

  education: z.enum(EducationLevelValues, {
    errorMap: () => ({ message: "Please select a valid education level" })
  }),

  status: z.enum(["Open", "Closed"], {
    errorMap: () => ({ message: "Status must be either Open or Closed" })
  }).default("Open"),

  skills: z.array(z.enum(SkillValues, {
    errorMap: () => ({ message: "Please select valid skills" })
  })).min(1, { message: "At least one skill is required" }),

  remote: z.boolean()
    .default(false),

  deadline: z.string()
    .datetime({ message: "Deadline must be a valid ISO datetime string" })
    .optional()
    .transform((str) => (str ? new Date(str) : undefined)),

  threshold: z.number()
    .int({ message: "Threshold must be an integer" })
    .min(1, { message: "Minimum threshold is 1" })
    .max(100, { message: "Maximum threshold is 100" }),

  jdSummary: z.string()
    .max(50000, { message: "Job summary cannot exceed 500 characters" })
    .optional()
    .or(z.literal("")),
});

export type JobCreateInput = z.infer<typeof createJobSchema>;

export const applicationSchema = z.object({
  firstName: z.string()
    .min(2, { message: "First name must be at least 2 characters" })
    .max(50, { message: "First name cannot exceed 50 characters" }),

  lastName: z.string()
    .min(2, { message: "Last name must be at least 2 characters" })
    .max(50, { message: "Last name cannot exceed 50 characters" }),

  email: z.string()
    .email({ message: "Please enter a valid email address" })
    .max(100, { message: "Email cannot exceed 100 characters" }),

  phone: z.string()
    .min(10, { message: "Phone number must be at least 10 digits" })
    .max(15, { message: "Phone number cannot exceed 15 digits" })
    .regex(/^[+\d][\d\s-]+$/, { message: "Please enter a valid phone number" })
    .optional()
    .or(z.literal("")),

  resume: z.string()
    .url({ message: "Resume must be a valid URL" }),

  coverLetter: z.string()
    .max(50000, { message: "Cover letter cannot exceed 50000 characters" })
    .optional()
    .or(z.literal("")),

  experience: z.array(z.object({
    company: z.string()
      .min(2, { message: "Company name must be at least 2 characters" })
      .max(100, { message: "Company name cannot exceed 100 characters" }),
    position: z.string()
      .min(2, { message: "Position must be at least 2 characters" })
      .max(100, { message: "Position cannot exceed 100 characters" }),
    duration: z.string()
      .min(4, { message: "Duration must be at least 4 characters (e.g., '2020-2022')" })
      .max(50, { message: "Duration cannot exceed 50 characters" }),
    description: z.string()
      .max(5000, { message: "Description cannot exceed 5000 characters" })
      .optional()
      .or(z.literal(""))
  }))
    .max(10, { message: "Maximum 10 experience entries allowed" })
    .optional(),

  education: z.array(z.object({
    institution: z.string()
      .min(2, { message: "Institution name must be at least 2 characters" })
      .max(100, { message: "Institution name cannot exceed 100 characters" }),
    degree: z.string()
      .min(2, { message: "Degree must be at least 2 characters" })
      .max(100, { message: "Degree cannot exceed 100 characters" }),
    fieldOfStudy: z.string()
      .min(2, { message: "Field of study must be at least 2 characters" })
      .max(100, { message: "Field of study cannot exceed 100 characters" }),
    year: z.string()
      .min(4, { message: "Year must be at least 4 characters (e.g., '2020')" })
      .max(50, { message: "Year cannot exceed 50 characters" }),
  }))
    .max(5, { message: "Maximum 5 education entries allowed" })
    .optional(),

  projects: z.array(z.object({
    title: z.string()
      .min(2, { message: "Project title must be at least 2 characters" })
      .max(100, { message: "Project title cannot exceed 100 characters" }),
    description: z.string()
      .min(10, { message: "Project description must be at least 10 characters" })
      .max(2000, { message: "Project description cannot exceed 2000 characters" }),
    techStack: z.array(z.string()
      .min(1, { message: "Each technology must be at least 1 character" })
      .max(50, { message: "Each technology cannot exceed 50 characters" })
    )
      .max(20, { message: "Maximum 20 technologies per project allowed" }),
    githubLink: z.string()
      .url({ message: "GitHub link must be a valid URL" })
      .optional()
      .or(z.literal("")),
    deployedLink: z.string()
      .url({ message: "Deployed link must be a valid URL" })
      .optional()
      .or(z.literal("")),
    timePeriod: z.string()
      .min(4, { message: "Time period must be at least 4 characters (e.g., '2023')" })
      .max(50, { message: "Time period cannot exceed 50 characters" })
  }))
    .max(10, { message: "Maximum 10 project entries allowed" })
    .optional(),

  certifications: z.array(z.string()
    .min(2, { message: "Each certification must be at least 2 characters" })
    .max(200, { message: "Each certification cannot exceed 200 characters" })
  )
    .max(20, { message: "Maximum 20 certifications allowed" })
    .optional(),

  achievements: z.array(z.string()
    .min(10, { message: "Each achievement must be at least 10 characters" })
    .max(500, { message: "Each achievement cannot exceed 500 characters" })
  )
    .max(20, { message: "Maximum 20 achievements allowed" })
    .optional(),

  portfolio: z.string()
    .url({ message: "Portfolio must be a valid URL" })
    .optional()
    .or(z.literal("")),

  linkedIn: z.string()
    .url({ message: "LinkedIn must be a valid URL" })
    .optional()
    .or(z.literal("")),

  github: z.string()
    .url({ message: "GitHub must be a valid URL" })
    .optional()
    .or(z.literal("")),

  skills: z.array(z.enum(SkillValues, {
    errorMap: () => ({ message: "Please select valid skills" })
  }))
    .min(1, { message: "At least one skill is required" })
    .max(20, { message: "Maximum 20 skills allowed" })
});

export type ApplicationInput = z.infer<typeof applicationSchema>;