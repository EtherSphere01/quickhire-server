import bcrypt from "bcrypt";
import config from "./config";
import { prisma } from "./app/utils/prisma";

export const seedAdmin = async () => {
    const adminEmail = "admin@gmail.com";

    const existingAdmin = await prisma.user.findFirst({
        where: { role: "ADMIN" },
    });

    if (existingAdmin) {
        console.log(`Admin already exists: ${existingAdmin.email}`);
        return;
    }

    const hashedPassword = await bcrypt.hash("123456", config.saltRounds);

    const admin = await prisma.user.create({
        data: {
            name: "Admin",
            email: adminEmail,
            password: hashedPassword,
            role: "ADMIN",
        },
    });

    console.log(`Admin seeded successfully: ${admin.email}`);
};

export const seedJobs = async () => {
    const existingJobs = await prisma.job.count({
        where: { isDeleted: false },
    });

    if (existingJobs > 0) {
        console.log(`Jobs already seeded (${existingJobs} jobs found).`);
        return;
    }

    const jobs = [
        {
            title: "Email Marketing",
            company: "Revolut",
            location: "Madrid, Spain",
            category: "Marketing",
            job_type: "FULL_TIME" as const,
            salary: 54000,
            description:
                "Revolut is looking for an Email Marketing specialist to help the team manage and optimize our email campaigns. You will be responsible for creating engaging email content, segmenting audiences, A/B testing subject lines and CTAs, and analyzing campaign performance metrics.\n\nRequirements:\n- 2+ years experience in email marketing\n- Proficiency with Mailchimp, HubSpot, or similar platforms\n- Strong copywriting and analytical skills\n- Experience with marketing automation workflows\n- Knowledge of HTML/CSS for email templates",
        },
        {
            title: "Brand Designer",
            company: "Dropbox",
            location: "San Francisco, US",
            category: "Design",
            job_type: "FULL_TIME" as const,
            salary: 105000,
            description:
                "Dropbox is looking for a Brand Designer to help the team create compelling visual identities and brand experiences. You will work closely with marketing, product, and content teams to develop brand guidelines, create marketing collateral, and ensure visual consistency across all touchpoints.\n\nRequirements:\n- 3+ years of brand design experience\n- Expert proficiency in Figma, Illustrator, and Photoshop\n- Strong portfolio demonstrating brand identity work\n- Understanding of typography, color theory, and layout\n- Ability to work in a fast-paced environment",
        },
        {
            title: "Email Marketing",
            company: "Pitch",
            location: "Berlin, Germany",
            category: "Marketing",
            job_type: "FULL_TIME" as const,
            salary: 48000,
            description:
                "Pitch is looking for a Customer Manager to join the marketing team and drive email engagement strategies. You will develop lifecycle email campaigns, manage subscriber lists, and collaborate with design and content teams to create impactful communications.\n\nRequirements:\n- 2+ years experience in email marketing or CRM\n- Experience with customer segmentation and lifecycle marketing\n- Strong analytical and reporting skills\n- Excellent written communication\n- Familiarity with marketing analytics tools",
        },
        {
            title: "Visual Designer",
            company: "Blinklist",
            location: "Granada, Spain",
            category: "Design",
            job_type: "FULL_TIME" as const,
            salary: 62000,
            description:
                "Blinklist is looking for a Visual Designer to help the team deliver high-quality visual assets for our platform. You will create illustrations, icons, UI components, and marketing materials that align with our brand identity.\n\nRequirements:\n- 2+ years of visual design experience\n- Proficiency in Figma and Adobe Creative Suite\n- Strong illustration and iconography skills\n- Understanding of design systems\n- Attention to detail and pixel-perfect execution",
        },
        {
            title: "Product Designer",
            company: "ClassPass",
            location: "Manchester, UK",
            category: "Design",
            job_type: "FULL_TIME" as const,
            salary: 85000,
            description:
                "ClassPass is looking for a Product Designer to help us craft seamless user experiences. You will conduct user research, create wireframes and prototypes, run usability tests, and collaborate with engineering to ship features.\n\nRequirements:\n- 3+ years of product design experience\n- Strong UX/UI portfolio with mobile and web projects\n- Proficiency in Figma and prototyping tools\n- Experience with user research and usability testing\n- Excellent collaboration and communication skills",
        },
        {
            title: "Lead Designer",
            company: "Canva",
            location: "Ontario, Canada",
            category: "Design",
            job_type: "FULL_TIME" as const,
            salary: 120000,
            description:
                "Canva is looking for a Lead Designer to help develop new features and lead design initiatives. You will mentor junior designers, establish design standards, drive design reviews, and work directly with product managers and engineers.\n\nRequirements:\n- 5+ years of design experience, 2+ in a leadership role\n- Expert proficiency in Figma and design systems\n- Strong portfolio showcasing design leadership\n- Experience mentoring and growing design teams\n- Strategic thinking and business acumen",
        },
        {
            title: "Brand Strategist",
            company: "GoDaddy",
            location: "Marseille, France",
            category: "Marketing",
            job_type: "FULL_TIME" as const,
            salary: 72000,
            description:
                "GoDaddy is looking for a Brand Strategist to join the team and shape our brand direction. You will conduct market research, develop brand positioning, create messaging frameworks, and ensure brand consistency across campaigns.\n\nRequirements:\n- 4+ years of brand strategy experience\n- Strong understanding of market research methodologies\n- Excellent storytelling and presentation skills\n- Experience with brand audits and competitive analysis\n- Ability to translate data into strategic recommendations",
        },
        {
            title: "Data Analyst",
            company: "Twitter",
            location: "San Diego, US",
            category: "Technology",
            job_type: "FULL_TIME" as const,
            salary: 95000,
            description:
                "Twitter is looking for a Data Analyst to help the team learn from our massive datasets. You will build dashboards, run statistical analyses, identify trends, and present insights to stakeholders across the organization.\n\nRequirements:\n- 2+ years of data analysis experience\n- Proficiency in SQL, Python, and data visualization tools\n- Experience with large-scale datasets\n- Strong statistical and analytical thinking\n- Excellent communication and presentation skills",
        },
        {
            title: "Social Media Assistant",
            company: "Nomad",
            location: "Paris, France",
            category: "Marketing",
            job_type: "FULL_TIME" as const,
            salary: 42000,
            description:
                "Nomad is looking for a Social Media Assistant to manage our online presence across multiple platforms. You will create content calendars, write engaging posts, respond to community interactions, and track social media analytics.\n\nRequirements:\n- 1+ years of social media management experience\n- Familiarity with Instagram, Twitter, LinkedIn, and TikTok\n- Strong copywriting and visual content creation skills\n- Understanding of social media algorithms and best practices\n- Ability to work with design tools like Canva",
        },
        {
            title: "Interactive Developer",
            company: "Terraform",
            location: "Hamburg, Germany",
            category: "Engineering",
            job_type: "FULL_TIME" as const,
            salary: 78000,
            description:
                "Terraform is looking for an Interactive Developer to build creative, engaging web experiences. You will work with WebGL, Three.js, and modern JavaScript frameworks to create interactive visualizations and immersive web applications.\n\nRequirements:\n- 3+ years of frontend development experience\n- Proficiency in JavaScript/TypeScript, React, and Three.js\n- Experience with WebGL and canvas animations\n- Strong understanding of CSS animations and transitions\n- Portfolio showcasing interactive projects",
        },
        {
            title: "HR Manager",
            company: "Packer",
            location: "Lucerne, Switzerland",
            category: "Human Resource",
            job_type: "FULL_TIME" as const,
            salary: 88000,
            description:
                "Packer is looking for an HR Manager to lead our people operations. You will oversee recruitment, onboarding, employee relations, performance management, and ensure compliance with employment laws.\n\nRequirements:\n- 4+ years of HR management experience\n- Strong knowledge of employment law and HR best practices\n- Experience with HRIS systems\n- Excellent interpersonal and conflict resolution skills\n- HR certification (SHRM or equivalent) preferred",
        },
        {
            title: "Social Media Assistant",
            company: "Netlify",
            location: "Paris, France",
            category: "Marketing",
            job_type: "FULL_TIME" as const,
            salary: 44000,
            description:
                "Netlify is looking for a Social Media Assistant to grow our developer community engagement. You will create technical content for social channels, collaborate with DevRel, and help amplify community voices.\n\nRequirements:\n- 1+ years of social media experience, ideally in tech\n- Understanding of developer audience and community building\n- Strong writing skills with attention to technical accuracy\n- Familiarity with analytics and social scheduling tools\n- Passion for web development and open source",
        },
        {
            title: "Brand Designer",
            company: "Maze",
            location: "San Francisco, US",
            category: "Design",
            job_type: "FULL_TIME" as const,
            salary: 92000,
            description:
                "Maze is looking for a Brand Designer to shape our visual identity and create stunning brand experiences. You will design marketing materials, product illustrations, and develop brand guidelines.\n\nRequirements:\n- 3+ years of brand and visual design experience\n- Expertise in Figma, Illustrator, and After Effects\n- Strong typography and layout skills\n- Experience creating design systems for brands\n- Portfolio demonstrating versatile brand work",
        },
        {
            title: "Interactive Developer",
            company: "Udacity",
            location: "Hamburg, Germany",
            category: "Technology",
            job_type: "FULL_TIME" as const,
            salary: 82000,
            description:
                "Udacity is looking for an Interactive Developer to build engaging educational experiences. You will create interactive course components, coding playgrounds, and dynamic visualizations for our learning platform.\n\nRequirements:\n- 3+ years of frontend development experience\n- Strong JavaScript/TypeScript and React skills\n- Experience building interactive educational tools\n- Knowledge of accessibility and responsive design\n- Passion for education and learning technology",
        },
        {
            title: "HR Manager",
            company: "Webflow",
            location: "Lucerne, Switzerland",
            category: "Human Resource",
            job_type: "FULL_TIME" as const,
            salary: 90000,
            description:
                "Webflow is looking for an HR Manager to support our growing team. You will handle talent acquisition, culture initiatives, compensation planning, and employee development programs.\n\nRequirements:\n- 4+ years of HR experience in a tech company\n- Experience with remote and distributed teams\n- Strong communication and organizational skills\n- Knowledge of compensation and benefits administration\n- Data-driven approach to people operations",
        },
        {
            title: "Senior Frontend Engineer",
            company: "Canva",
            location: "Sydney, Australia",
            category: "Engineering",
            job_type: "FULL_TIME" as const,
            salary: 130000,
            description:
                "Canva is seeking a Senior Frontend Engineer to join our core platform team. You will architect scalable UI components, optimize performance, and mentor other engineers on frontend best practices.\n\nRequirements:\n- 5+ years of frontend development experience\n- Expert-level React and TypeScript\n- Experience with design systems and component libraries\n- Performance optimization and web vitals knowledge\n- Mentoring and code review experience",
        },
        {
            title: "UX Researcher",
            company: "Dropbox",
            location: "Austin, US",
            category: "Design",
            job_type: "FULL_TIME" as const,
            salary: 98000,
            description:
                "Dropbox is hiring a UX Researcher to uncover user needs and inform product decisions. You will plan and conduct user studies, synthesize findings, and present actionable insights to product teams.\n\nRequirements:\n- 3+ years of UX research experience\n- Proficiency in qualitative and quantitative research methods\n- Experience with research tools like UserTesting, Lookback, or similar\n- Strong analytical and presentation skills\n- Ability to translate research into design recommendations",
        },
        {
            title: "Sales Executive",
            company: "GoDaddy",
            location: "Phoenix, US",
            category: "Sales",
            job_type: "FULL_TIME" as const,
            salary: 75000,
            description:
                "GoDaddy is looking for a Sales Executive to drive revenue growth in our enterprise segment. You will manage the full sales cycle, build relationships with key accounts, and exceed quarterly targets.\n\nRequirements:\n- 3+ years of B2B sales experience\n- Proven track record of meeting or exceeding quotas\n- Strong presentation and negotiation skills\n- CRM experience (Salesforce preferred)\n- Self-motivated with excellent time management",
        },
        {
            title: "Financial Analyst",
            company: "Revolut",
            location: "London, UK",
            category: "Finance",
            job_type: "FULL_TIME" as const,
            salary: 68000,
            description:
                "Revolut is hiring a Financial Analyst to support strategic decision-making. You will build financial models, analyze performance metrics, prepare reports for leadership, and support budgeting processes.\n\nRequirements:\n- 2+ years of financial analysis experience\n- Advanced Excel and financial modeling skills\n- Experience with BI tools (Tableau, Power BI, etc.)\n- Strong attention to detail and analytical thinking\n- Finance or accounting degree preferred",
        },
        {
            title: "DevOps Engineer",
            company: "Netlify",
            location: "Remote",
            category: "Engineering",
            job_type: "FULL_TIME" as const,
            salary: 115000,
            description:
                "Netlify is seeking a DevOps Engineer to build and maintain our deployment infrastructure. You will automate CI/CD pipelines, manage cloud resources, monitor system health, and ensure high availability.\n\nRequirements:\n- 3+ years of DevOps/SRE experience\n- Proficiency with AWS, Docker, and Kubernetes\n- Experience with CI/CD tools (GitHub Actions, Jenkins)\n- Infrastructure as Code (Terraform, CloudFormation)\n- Strong scripting skills (Bash, Python)",
        },
        {
            title: "Business Analyst",
            company: "Pitch",
            location: "Berlin, Germany",
            category: "Business",
            job_type: "FULL_TIME" as const,
            salary: 58000,
            description:
                "Pitch is looking for a Business Analyst to help us make data-driven decisions. You will gather and analyze business requirements, create process documentation, and work with stakeholders to optimize workflows.\n\nRequirements:\n- 2+ years of business analysis experience\n- Strong SQL and data analysis skills\n- Experience with Agile methodologies\n- Excellent documentation and communication skills\n- Familiarity with project management tools",
        },
        {
            title: "Content Marketing Manager",
            company: "Nomad",
            location: "Barcelona, Spain",
            category: "Marketing",
            job_type: "CONTRACT" as const,
            salary: 55000,
            description:
                "Nomad is hiring a Content Marketing Manager on contract to develop and execute our content strategy. You will manage the blog, create long-form content, optimize for SEO, and measure content performance.\n\nRequirements:\n- 3+ years of content marketing experience\n- Strong SEO knowledge and keyword research skills\n- Excellent writing and editing abilities\n- Experience with content management systems\n- Analytics-driven approach to content strategy",
        },
        {
            title: "Mobile Developer",
            company: "ClassPass",
            location: "New York, US",
            category: "Technology",
            job_type: "FULL_TIME" as const,
            salary: 110000,
            description:
                "ClassPass is seeking a Mobile Developer to build and enhance our iOS and Android apps. You will implement new features, optimize app performance, and collaborate with design and backend teams.\n\nRequirements:\n- 3+ years of mobile development experience\n- Proficiency in React Native or Swift/Kotlin\n- Experience with REST APIs and state management\n- App Store and Play Store deployment experience\n- Strong debugging and performance profiling skills",
        },
        {
            title: "Account Manager",
            company: "Blinklist",
            location: "Munich, Germany",
            category: "Sales",
            job_type: "FULL_TIME" as const,
            salary: 65000,
            description:
                "Blinklist is looking for an Account Manager to nurture and grow our enterprise client relationships. You will serve as the primary point of contact, identify upselling opportunities, and ensure client satisfaction.\n\nRequirements:\n- 2+ years of account management experience\n- Strong relationship-building and communication skills\n- Experience with CRM tools and customer success metrics\n- Ability to manage multiple accounts simultaneously\n- Problem-solving mindset with attention to detail",
        },
        {
            title: "QA Engineer",
            company: "Maze",
            location: "Remote",
            category: "Engineering",
            job_type: "PART_TIME" as const,
            salary: 50000,
            description:
                "Maze is hiring a part-time QA Engineer to ensure the quality of our user testing platform. You will write test plans, execute manual and automated tests, report bugs, and validate fixes.\n\nRequirements:\n- 2+ years of QA engineering experience\n- Experience with test automation frameworks (Cypress, Playwright)\n- Strong understanding of software development lifecycle\n- Attention to detail and analytical mindset\n- Familiarity with Agile and Scrum methodologies",
        },
        {
            title: "Marketing Intern",
            company: "Twitter",
            location: "San Francisco, US",
            category: "Marketing",
            job_type: "INTERNSHIP" as const,
            salary: 35000,
            description:
                "Twitter is offering a Marketing Internship for aspiring marketers. You will assist with campaign planning, social media content creation, market research, and performance reporting.\n\nRequirements:\n- Currently pursuing a degree in Marketing or related field\n- Strong interest in social media and digital marketing\n- Excellent written and verbal communication\n- Familiarity with social media platforms\n- Eager to learn and contribute in a fast-paced environment",
        },
        {
            title: "Backend Engineer",
            company: "Terraform",
            location: "Amsterdam, Netherlands",
            category: "Engineering",
            job_type: "FULL_TIME" as const,
            salary: 100000,
            description:
                "Terraform is seeking a Backend Engineer to build robust and scalable services. You will design APIs, manage databases, implement authentication systems, and optimize server performance.\n\nRequirements:\n- 3+ years of backend development experience\n- Proficiency in Node.js, Python, or Go\n- Experience with PostgreSQL and Redis\n- RESTful API design and microservices architecture\n- Understanding of security best practices",
        },
        {
            title: "Freelance Graphic Designer",
            company: "Canva",
            location: "Remote",
            category: "Design",
            job_type: "FREELANCE" as const,
            salary: 60000,
            description:
                "Canva is looking for a freelance Graphic Designer to create templates and design assets for our marketplace. You will produce social media templates, presentation designs, and print-ready materials.\n\nRequirements:\n- 2+ years of graphic design experience\n- Proficiency in Canva Pro, Figma, and Illustrator\n- Strong understanding of design trends and typography\n- Ability to create high-volume, high-quality assets\n- Self-organized with excellent time management",
        },
        {
            title: "Product Manager",
            company: "Udacity",
            location: "Mountain View, US",
            category: "Business",
            job_type: "FULL_TIME" as const,
            salary: 125000,
            description:
                "Udacity is seeking a Product Manager to lead our learner experience team. You will define product roadmaps, prioritize features, work with engineering and design, and drive product metrics.\n\nRequirements:\n- 4+ years of product management experience\n- Strong analytical and data-driven decision-making skills\n- Experience with Agile development processes\n- Excellent cross-functional collaboration abilities\n- Background in edtech or consumer products preferred",
        },
    ];

    await prisma.job.createMany({ data: jobs });
    console.log(`Seeded ${jobs.length} jobs successfully.`);
};

// Allow running standalone via `pnpm seed`
if (require.main === module) {
    const main = async () => {
        try {
            await seedAdmin();
            await seedJobs();
        } catch (error) {
            console.error("Seed failed:", error);
            process.exit(1);
        } finally {
            await prisma.$disconnect();
        }
    };
    main();
}
