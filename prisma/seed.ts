import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { hashPassword } from "../lib/password.ts";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

async function main() {
  // ================= ADMIN USER (always created) =================
  const adminEmail = "admin@example.com";
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });
  if (!existingAdmin) {
    await prisma.user.create({
      data: {
        email: adminEmail,
        name: "Akim Admin",
        passwordHash: hashPassword("admin123"),
      },
    });
    console.log("Admin user created: admin@example.com / admin123");
  }

  const existingJourneys = await prisma.journey.count();
  if (existingJourneys > 0) {
    console.log(
      "Seed kandungan dilangkau: kandungan sudah wujud dalam pangkalan data."
    );
    return;
  }

  // ================= HERO =================
  await prisma.heroContent.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      greeting: "Hi, I'm Akim 👋",
      description:
        "Motivated Computer Science student with a strong foundation in software engineering and professional experience in administrative operations. Skilled in PHP, JavaScript, C++, Java, Python and SQL, with a unique background in mechatronics and automation that enhances analytical problem-solving. Currently certified in Google Cybersecurity, eager to leverage technical skills in a dynamic Software Development, IT or Cybersecurity role.",
    },
  });

  // ================= JOURNEY =================
  const journeys = [
    {
      year: "2024 - Present",
      title: "Bachelor of Computer Science (Hons) - UiTM Shah Alam",
      description:
        "Building strong foundation in Software Engineering and Computer Science. Key focus: Data Structures, Algorithms, OOP, Database Design, and Web Development. Actively applying coursework to build fullstack applications using Next.js, React, Tailwind, and Supabase.",
      status: "Undergraduate",
      type: "Education",
      tech: ["Next.js", "React", "JavaScript", "Supabase", "Tailwind", "Git"],
      order: 0,
    },
    {
      year: "2022",
      title: "Spartan Fencing Center - Fullstack Web Application",
      description:
        "End-to-end web system built from scratch to digitize multi-branch operations. Features: Dynamic CMS, Equipment Inventory, Event Registration, and Automated Billing Module that calculates fees based on attendance. Solo project. Deployed and used by admin team.",
      status: "Self Taught",
      type: "Project",
      tech: ["PHP", "JavaScript", "HTML", "CSS", "MySQL", "CRUD"],
      order: 1,
    },
    {
      year: "2020 - Present",
      title:
        "Administrative Assistant, N1 - KPT, Putrajaya & Wildlife Department, KL",
      description:
        "Manage core HR operations including employee records, payroll processing, benefits, pension, budgeting and official documentation for senior management review.",
      status: "Government",
      type: "Work",
      tech: [],
      order: 2,
    },
    {
      year: "2017 - 2020",
      title:
        "Administrative Assistant Officer, N29 (COS) - Permata Division, Prime Minister's Department, Putrajaya",
      description:
        "Assisted in implementation, assessment and monitoring of SKPAK. Coordinated meetings, workshops, audit and stakeholder engagement activities.",
      status: "Government",
      type: "Work",
      tech: [],
      order: 3,
    },
    {
      year: "2017",
      title: "Assembly Technician - Genetec Technology Bhd, Bangi, Selangor",
      description:
        "Supported the assembly, testing, and technical troubleshooting of heavy industrial equipment and automation systems. Developed strong debugging and system-thinking skills.",
      status: "Industrial",
      type: "Work",
      tech: [],
      order: 4,
    },
    {
      year: "2012 - 2015",
      title: "Diploma of Engineering Technology in Mechatronics - MFI",
      description:
        "Foundation in programming, electronics, and automation. Core modules: C++, PLC Programming, Arduino, Microcontrollers, Sensors, Robotics, and System Design. Final Year Project: Automated system with PLC.",
      status: "Academic",
      type: "Education",
      tech: ["C++", "PLC", "Arduino", "Problem Solving"],
      order: 5,
    },
  ];

  for (const j of journeys) {
    await prisma.journey.create({ data: j });
  }

  // ================= PROJECTS =================
  const projects = [
    {
      title: "SFC System",
      type: "CMS / Management System",
      year: "2026",
      description:
        "A complete management system with session security controls and database integration.",
      images: ["SFC 1.png", "SFC 2.png"],
      stacks: ["PHP", "MySQL", "JavaScript", "Tailwind CSS"],
      features: [
        "CRUD Operations",
        "Session Security",
        "User Authentication",
        "SVG Preloaders",
      ],
      whatsInside:
        "A robust dashboard interface equipped with complete CRUD functionality, secure user session management, and dynamic database querying to handle administrative records seamlessly.",
      howItsBuilt:
        "Developed natively using PHP for server-side processing, structured MySQL databases for data persistence, and styled dynamically with Tailwind CSS paired with custom JavaScript logic and SVG preloader animations.",
      whyIBuiltIt:
        "Built to solve real-world workflow inefficiencies by centralizing data administration and implementing strict security controls to protect sensitive administrative sessions.",
      order: 0,
    },
    {
      title: "React Portfolio",
      type: "Personal Portfolio",
      year: "2025",
      description:
        "My first personal portfolio built with modern components and a responsive design.",
      images: [],
      stacks: ["React", "Tailwind CSS", "HTML5"],
      features: [
        "Component-Based Architecture",
        "Responsive Layout",
        "Modern UI/UX",
      ],
      whatsInside:
        "A modular structure containing separate components for navigation, project grids, bio sections, and interactive contact forms optimized for all screen sizes.",
      howItsBuilt:
        "Built utilizing React functional components and hooks, structured with modern CSS styles via Tailwind CSS to achieve a sleek, responsive, glassmorphism aesthetic.",
      whyIBuiltIt:
        "Created as an initial step to establish a professional web presence, showcase early development milestones, and practice component-driven user interface design.",
      order: 1,
    },
    {
      title: "Next.js App",
      type: "SaaS / Web App",
      year: "2026",
      description:
        "Migrated the portfolio to the Next.js App Router architecture for better performance and SEO.",
      images: [],
      stacks: ["Next.js", "TypeScript", "Tailwind CSS"],
      features: [
        "App Router",
        "Server-Side Rendering",
        "Dynamic Routing",
        "Optimized Performance",
      ],
      whatsInside:
        "Scalable routing architecture using Next.js App Router, fully typed interfaces with TypeScript, and optimized asset pipelines for maximum search engine visibility.",
      howItsBuilt:
        "Architected using Next.js framework features like Server-Side Rendering (SSR) and dynamic route parameters, integrated closely with strict TypeScript safety and Tailwind styling.",
      whyIBuiltIt:
        "Migrated and upgraded to leverage cutting-edge web performance metrics, improve SEO reach, and adopt industry-standard enterprise patterns like TypeScript.",
      order: 2,
    },
  ];

  for (const p of projects) {
    await prisma.project.create({ data: p });
  }

  // ================= RESUME: EDUCATION =================
  const education = [
    {
      period: "2024 - Present",
      degree: "Bachelor of Computer Science (Hons) - UiTM Shah Alam",
      description:
        "Building strong foundation in Software Engineering and Computer Science. Key focus: Data Structures, Algorithms, OOP, Database Design, and Web Development.",
      order: 0,
    },
    {
      period: "2012 - 2015",
      degree: "Diploma of Engineering Technology in Mechatronics - UniKL MFI",
      description:
        "Foundation in programming, electronics, and automation. Core modules: C++, PLC Programming, Arduino, and System Design.",
      order: 1,
    },
  ];

  for (const e of education) {
    await prisma.education.create({ data: e });
  }

  // ================= RESUME: EXPERIENCE =================
  const experience = [
    {
      title: "Administrative Assistant (N1)",
      period: "Jun 2020 - Present",
      company: "MOHE & Department of Wildlife, Putrajaya & Cheras",
      isLatest: true,
      highlights: [
        "Managed core HR operations, payroll, attendance, and records.",
        "Maintained end-to-end employee lifecycle data via HRMIS.",
        "Maintained physical Government Service Books for officers.",
      ],
      order: 0,
    },
    {
      title: "Administrative Assistant Officer (N29)",
      period: "Dec 2017 - Jun 2020",
      company: "Permata Division, Prime Minister's Department",
      isLatest: false,
      highlights: [
        "Assisted in implementation and monitoring of SKPAK.",
        "Coordinated meetings, workshops, audits, and stakeholders.",
        "Compiled reports and recommendations for management.",
      ],
      order: 1,
    },
    {
      title: "Assembly Technician",
      period: "May 2017 - Dec 2017",
      company: "Genetec Technology Berhad, Bangi, Selangor",
      isLatest: false,
      highlights: [
        "Supported assembly, testing, and troubleshooting of automation systems.",
        "Collaborated with engineering teams to optimize efficiency.",
      ],
      order: 2,
    },
    {
      title: "Industrial Trainee (Technician)",
      period: "Jan 2015 - May 2015",
      company: "TNB Generation - Sultan Ismail Petra Power Station",
      isLatest: false,
      highlights: [
        "Assisted maintenance and operations through equipment diagnostics.",
        "Gained practical exposure to industrial safety and plant operations.",
      ],
      order: 3,
    },
  ];

  for (const x of experience) {
    await prisma.experience.create({ data: x });
  }

  // ================= RESUME: SKILLS =================
  const skills = ["Next.js", "TypeScript", "Tailwind CSS", "PHP & MySQL", "React"];
  for (let i = 0; i < skills.length; i++) {
    await prisma.skill.create({ data: { name: skills[i], order: i } });
  }

  // ================= RESUME: CERTIFICATIONS =================
  await prisma.certification.create({
    data: {
      title: "Google Cybersecurity",
      provider: "Coursera",
      year: "2025",
      logoText: "GOOGLE",
      verifyUrl: "https://www.coursera.org",
      order: 0,
    },
  });

  // ================= CONTACT: SOCIAL LINKS =================
  const socialLinks = [
    { name: "LinkedIn", url: "https://linkedin.com", order: 0 },
    { name: "GitHub", url: "https://github.com/akimhalim", order: 1 },
  ];
  for (const s of socialLinks) {
    await prisma.socialLink.create({ data: s });
  }

  // ================= CONTENT SETTINGS =================
  const settings = [
    {
      key: "resume_name",
      value: "Akim Halim",
    },
    {
      key: "resume_role",
      value: "Full Stack Developer & Student",
    },
    {
      key: "resume_summary",
      value:
        "Motivated Computer Science student with a strong foundation in software engineering and professional experience in administrative operations. Skilled in PHP, JavaScript, C++, Java, Python and SQL, with a unique background in mechatronics and automation that enhances analytical problem-solving. Currently certified in Google Cybersecurity, eager to leverage technical skills in a dynamic Software Development, IT or Cybersecurity role.",
    },
    { key: "resume_location", value: "Kuala Lumpur" },
    { key: "resume_website_text", value: "akimhalim.vercel.app" },
    { key: "resume_website_url", value: "https://yourportfolio.com" },
    { key: "resume_github_text", value: "https://github.com/akimhalim94" },
    { key: "resume_github_url", value: "https://github.com" },
    {
      key: "contact_intro",
      value:
        "Have an exciting project in mind or want to ask something? Feel free to reach out using the form below or connect with me via social channels.",
    },
    {
      key: "projects_intro",
      value:
        "Collection of the projects that have been developed by me, featuring modern tech stacks and practical implementations.",
    },
  ];

  for (const s of settings) {
    await prisma.contentSetting.upsert({
      where: { key: s.key },
      update: {},
      create: s,
    });
  }

  console.log("Seed completed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
