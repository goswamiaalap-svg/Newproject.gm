// =============================================================================
// LaunchPad Mock Data
// Realistic data for an Indian engineering student career platform
// =============================================================================

// -----------------------------------------------------------------------------
// Resume Analysis
// -----------------------------------------------------------------------------
export const mockResumeAnalysis = {
  overallScore: 78,
  breakdown: [
    { label: 'ATS Compatibility', score: 82, maxScore: 100 },
    { label: 'Impact Statements', score: 65, maxScore: 100 },
    { label: 'Technical Skills', score: 88, maxScore: 100 },
    { label: 'Project Descriptions', score: 72, maxScore: 100 },
    { label: 'Formatting & Structure', score: 85, maxScore: 100 },
  ],
  feedback: [
    {
      severity: 'critical' as const,
      icon: '🔴',
      title: 'Missing quantified achievements',
      description:
        'Your project descriptions lack measurable outcomes. Add metrics like "improved load time by 40%" or "served 500+ users".',
      fix: 'Add at least 2 quantified metrics per project entry.',
    },
    {
      severity: 'critical' as const,
      icon: '🔴',
      title: 'No ATS-friendly section headers',
      description:
        'Custom section names like "What I Built" confuse ATS parsers.',
      fix: 'Use standard headers: Experience, Education, Skills, Projects.',
    },
    {
      severity: 'improve' as const,
      icon: '🟡',
      title: 'Weak action verbs',
      description: 'Phrases like "worked on" and "helped with" are passive.',
      fix: 'Replace with strong verbs: Developed, Architected, Implemented, Optimized.',
    },
    {
      severity: 'improve' as const,
      icon: '🟡',
      title: 'Skills section needs categorization',
      description: 'All skills listed in one block reduce scannability.',
      fix: 'Group into: Languages, Frameworks, Tools, Databases.',
    },
    {
      severity: 'good' as const,
      icon: '🟢',
      title: 'Strong education section',
      description:
        'GPA, relevant coursework, and honors are well-presented.',
      fix: '',
    },
    {
      severity: 'good' as const,
      icon: '🟢',
      title: 'Clean formatting',
      description:
        'Consistent font, good margins, single page - professional layout.',
      fix: '',
    },
    {
      severity: 'improve' as const,
      icon: '🟡',
      title: 'Add a GitHub/Portfolio link',
      description: 'No online presence linked in the resume header.',
      fix: 'Add GitHub profile URL and portfolio website to contact section.',
    },
  ],
}

// -----------------------------------------------------------------------------
// DSA Topics
// -----------------------------------------------------------------------------
export const mockDSATopics = [
  {
    id: '1',
    name: 'Arrays & Strings',
    category: 'Fundamentals',
    difficulty: 'Easy' as const,
    status: 'completed' as const,
    problems: 25,
    solved: 25,
    estimatedTime: '2 weeks',
  },
  {
    id: '2',
    name: 'Linked Lists',
    category: 'Fundamentals',
    difficulty: 'Easy' as const,
    status: 'completed' as const,
    problems: 15,
    solved: 15,
    estimatedTime: '1 week',
  },
  {
    id: '3',
    name: 'Stacks & Queues',
    category: 'Fundamentals',
    difficulty: 'Easy' as const,
    status: 'completed' as const,
    problems: 18,
    solved: 18,
    estimatedTime: '1 week',
  },
  {
    id: '4',
    name: 'Hash Maps',
    category: 'Fundamentals',
    difficulty: 'Medium' as const,
    status: 'completed' as const,
    problems: 20,
    solved: 20,
    estimatedTime: '1.5 weeks',
  },
  {
    id: '5',
    name: 'Binary Trees',
    category: 'Trees',
    difficulty: 'Medium' as const,
    status: 'in-progress' as const,
    problems: 22,
    solved: 14,
    estimatedTime: '2 weeks',
  },
  {
    id: '6',
    name: 'BST',
    category: 'Trees',
    difficulty: 'Medium' as const,
    status: 'in-progress' as const,
    problems: 18,
    solved: 8,
    estimatedTime: '1.5 weeks',
  },
  {
    id: '7',
    name: 'Heaps',
    category: 'Trees',
    difficulty: 'Medium' as const,
    status: 'locked' as const,
    problems: 15,
    solved: 0,
    estimatedTime: '1 week',
  },
  {
    id: '8',
    name: 'Graphs - BFS/DFS',
    category: 'Graphs',
    difficulty: 'Medium' as const,
    status: 'locked' as const,
    problems: 20,
    solved: 0,
    estimatedTime: '2 weeks',
  },
  {
    id: '9',
    name: 'Dynamic Programming',
    category: 'Advanced',
    difficulty: 'Hard' as const,
    status: 'locked' as const,
    problems: 30,
    solved: 0,
    estimatedTime: '3 weeks',
  },
  {
    id: '10',
    name: 'Greedy Algorithms',
    category: 'Advanced',
    difficulty: 'Medium' as const,
    status: 'locked' as const,
    problems: 15,
    solved: 0,
    estimatedTime: '1.5 weeks',
  },
  {
    id: '11',
    name: 'Backtracking',
    category: 'Advanced',
    difficulty: 'Hard' as const,
    status: 'locked' as const,
    problems: 12,
    solved: 0,
    estimatedTime: '1.5 weeks',
  },
  {
    id: '12',
    name: 'Tries & Segment Trees',
    category: 'Advanced',
    difficulty: 'Hard' as const,
    status: 'locked' as const,
    problems: 10,
    solved: 0,
    estimatedTime: '1 week',
  },
]

// -----------------------------------------------------------------------------
// Interview Questions & Results
// -----------------------------------------------------------------------------
export const mockInterviewQuestions = [
  {
    id: 1,
    question:
      'Explain the difference between process and thread. When would you use one over the other?',
    category: 'OS Concepts',
    difficulty: 'Medium' as const,
    timeLimit: 180,
  },
  {
    id: 2,
    question:
      'Design a URL shortener like bit.ly. Walk me through the system design including database choices and scaling considerations.',
    category: 'System Design',
    difficulty: 'Hard' as const,
    timeLimit: 300,
  },
  {
    id: 3,
    question:
      'Given an array of integers, find two numbers that add up to a specific target. What is the most optimal approach?',
    category: 'DSA',
    difficulty: 'Easy' as const,
    timeLimit: 120,
  },
  {
    id: 4,
    question:
      'Tell me about a challenging project you worked on. What was your role and how did you handle obstacles?',
    category: 'Behavioral',
    difficulty: 'Medium' as const,
    timeLimit: 180,
  },
  {
    id: 5,
    question:
      'What is the CAP theorem? Give real-world examples of systems that prioritize different combinations.',
    category: 'System Design',
    difficulty: 'Medium' as const,
    timeLimit: 180,
  },
]

export const mockInterviewResults = {
  overallScore: 74,
  breakdown: {
    correctness: 80,
    clarity: 70,
    depth: 68,
    communication: 82,
    speed: 65,
  },
  questionResults: [
    {
      questionId: 1,
      score: 78,
      feedback:
        'Good understanding of concepts. Could elaborate more on practical use cases.',
      idealAnswer:
        'A process is an independent execution unit with its own memory space, while a thread is a lightweight unit within a process sharing the same memory...',
    },
    {
      questionId: 2,
      score: 65,
      feedback:
        'Basic design was correct but missed discussing caching layers and rate limiting.',
      idealAnswer:
        'Start with requirements: 100M URLs/day read, 1M write. Use Base62 encoding for short URLs, NoSQL for storage, Redis for caching...',
    },
    {
      questionId: 3,
      score: 90,
      feedback:
        'Excellent! Correctly identified HashMap approach with O(n) time complexity.',
      idealAnswer:
        'Use a HashMap to store complement values. For each number, check if target-num exists in map...',
    },
  ],
}

// -----------------------------------------------------------------------------
// Project Ideas
// -----------------------------------------------------------------------------
export const mockProjectIdeas = [
  {
    id: '1',
    name: 'AI Study Group Matcher',
    description:
      'ML-powered platform that matches students with compatible study partners based on learning style, schedule, and academic goals.',
    techStack: ['Next.js', 'Python', 'TensorFlow', 'PostgreSQL', 'WebSocket'],
    complexity: 'Advanced' as const,
    domain: 'EdTech',
    whyStandout:
      'Demonstrates ML clustering, real-time features, and solves a genuine campus problem. Great talking point in interviews.',
  },
  {
    id: '2',
    name: 'Campus Carbon Tracker',
    description:
      'IoT-integrated dashboard tracking and gamifying carbon footprint reduction across university hostels and departments.',
    techStack: ['React', 'Node.js', 'MQTT', 'InfluxDB', 'D3.js'],
    complexity: 'Intermediate' as const,
    domain: 'Sustainability',
    whyStandout:
      'Shows IoT integration, data visualization, and environmental awareness — increasingly valued by top companies.',
  },
  {
    id: '3',
    name: 'Smart Attendance with Anti-Spoofing',
    description:
      'Face recognition attendance system with liveness detection to prevent photo-based proxy attendance.',
    techStack: ['Python', 'OpenCV', 'Flask', 'React Native', 'MongoDB'],
    complexity: 'Advanced' as const,
    domain: 'Computer Vision',
    whyStandout:
      'Combines CV with practical security — proxy attendance is a real problem. Shows depth in ML and mobile development.',
  },
  {
    id: '4',
    name: 'Collaborative Code Review Platform',
    description:
      'GitHub-integrated tool for peer code reviews with AI-suggested improvements and learning resources.',
    techStack: ['Next.js', 'Express', 'GitHub API', 'OpenAI', 'Redis'],
    complexity: 'Intermediate' as const,
    domain: 'DevTools',
    whyStandout:
      'Shows API integration, AI usage, and developer tool thinking — impressive for SDE roles.',
  },
  {
    id: '5',
    name: 'Placement Prep Chatbot',
    description:
      'RAG-based chatbot trained on company-specific interview questions, past placement data, and preparation strategies.',
    techStack: ['Python', 'LangChain', 'Pinecone', 'FastAPI', 'React'],
    complexity: 'Advanced' as const,
    domain: 'AI/ML',
    whyStandout:
      'Demonstrates RAG architecture, vector databases, and NLP — hot topics in current tech interviews.',
  },
]

// -----------------------------------------------------------------------------
// Team Members
// -----------------------------------------------------------------------------
export const mockTeamMembers = [
  {
    id: '1',
    name: 'Priya Sharma',
    college: 'JKLU, Jaipur',
    skills: ['React', 'Node.js', 'Figma'],
    domains: ['Web Dev', 'UI/UX'],
    availability: 'available' as const,
    experience: '2nd Year',
    avatar: 'PS',
  },
  {
    id: '2',
    name: 'Arjun Mehta',
    college: 'VIT, Vellore',
    skills: ['Python', 'TensorFlow', 'Flask'],
    domains: ['AI/ML', 'Backend'],
    availability: 'available' as const,
    experience: '3rd Year',
    avatar: 'AM',
  },
  {
    id: '3',
    name: 'Sneha Reddy',
    college: 'BITS Pilani',
    skills: ['Flutter', 'Firebase', 'Dart'],
    domains: ['Mobile Dev'],
    availability: 'busy' as const,
    experience: '3rd Year',
    avatar: 'SR',
  },
  {
    id: '4',
    name: 'Rohit Kumar',
    college: 'NIT Trichy',
    skills: ['Java', 'Spring Boot', 'AWS'],
    domains: ['Backend', 'Cloud'],
    availability: 'available' as const,
    experience: '4th Year',
    avatar: 'RK',
  },
  {
    id: '5',
    name: 'Kavya Nair',
    college: 'IIIT Hyderabad',
    skills: ['Rust', 'Go', 'Docker'],
    domains: ['Systems', 'DevOps'],
    availability: 'available' as const,
    experience: '3rd Year',
    avatar: 'KN',
  },
  {
    id: '6',
    name: 'Aditya Joshi',
    college: 'COEP, Pune',
    skills: ['React Native', 'TypeScript', 'MongoDB'],
    domains: ['Full Stack'],
    availability: 'busy' as const,
    experience: '2nd Year',
    avatar: 'AJ',
  },
]

// -----------------------------------------------------------------------------
// Hackathons
// -----------------------------------------------------------------------------
export const mockHackathons = [
  {
    id: '1',
    name: 'Smart India Hackathon 2026',
    deadline: '2026-08-15',
    prize: '₹1,00,000',
    participants: 5000,
    status: 'Registration Open' as const,
  },
  {
    id: '2',
    name: 'HackWithInfy',
    deadline: '2026-07-30',
    prize: 'Internship + PPO',
    participants: 12000,
    status: 'Registration Open' as const,
  },
  {
    id: '3',
    name: 'Google Solution Challenge',
    deadline: '2026-09-01',
    prize: '$3,000 + Swag',
    participants: 8000,
    status: 'Coming Soon' as const,
  },
  {
    id: '4',
    name: 'MLH Global Hack Week',
    deadline: '2026-07-20',
    prize: 'Prizes + XP',
    participants: 3000,
    status: 'Registration Open' as const,
  },
]

// -----------------------------------------------------------------------------
// Opportunities
// -----------------------------------------------------------------------------
export const mockOpportunities = [
  {
    id: '1',
    title: 'SDE Intern - Amazon',
    type: 'internship' as const,
    company: 'Amazon',
    deadline: new Date('2026-08-10'),
    logo: '🅰️',
    applied: false,
    reminded: false,
    applyUrl: 'https://www.amazon.jobs/en/landing_pages/student-programs',
  },
  {
    id: '2',
    title: 'Google Summer of Code',
    type: 'open-source' as const,
    company: 'Google',
    deadline: new Date('2026-07-25'),
    logo: '🔵',
    applied: true,
    reminded: true,
    applyUrl: 'https://summerofcode.withgoogle.com/',
  },
  {
    id: '3',
    title: 'Flipkart GRiD 6.0',
    type: 'hackathon' as const,
    company: 'Flipkart',
    deadline: new Date('2026-08-05'),
    logo: '🟡',
    applied: false,
    reminded: false,
    applyUrl: 'https://unstop.com/search?keyword=Flipkart%20GRiD',
  },
  {
    id: '4',
    title: 'Microsoft Engage',
    type: 'internship' as const,
    company: 'Microsoft',
    deadline: new Date('2026-09-15'),
    logo: '🟢',
    applied: false,
    reminded: false,
    applyUrl: 'https://careers.microsoft.com/',
  },
  {
    id: '5',
    title: 'MLH Fellowship',
    type: 'fellowship' as const,
    company: 'MLH',
    deadline: new Date('2026-07-28'),
    logo: '🔴',
    applied: false,
    reminded: true,
    applyUrl: 'https://fellowship.mlh.io/',
  },
  {
    id: '6',
    title: 'Codeforces Round #900',
    type: 'hackathon' as const,
    company: 'Codeforces',
    deadline: new Date('2026-07-22'),
    logo: '🟣',
    applied: false,
    reminded: false,
    applyUrl: 'https://codeforces.com/contests',
  },
]

// -----------------------------------------------------------------------------
// Roadmap / Learning Path
// -----------------------------------------------------------------------------
export const mockRoadmapWeeks = [
  {
    week: 1,
    title: 'Foundation Week',
    tasks: [
      { id: 'w1t1', task: 'Arrays & Hashing - 10 problems', type: 'dsa' as const, completed: true },
      { id: 'w1t2', task: 'OS: Process Management basics', type: 'subject' as const, completed: true },
      { id: 'w1t3', task: 'Set up portfolio website', type: 'project' as const, completed: true },
      { id: 'w1t4', task: 'Two Pointers pattern - 8 problems', type: 'dsa' as const, completed: true },
    ],
  },
  {
    week: 2,
    title: 'Building Momentum',
    tasks: [
      { id: 'w2t1', task: 'Sliding Window - 8 problems', type: 'dsa' as const, completed: true },
      { id: 'w2t2', task: 'DBMS: Normalization & SQL', type: 'subject' as const, completed: true },
      { id: 'w2t3', task: 'Add 2 projects to portfolio', type: 'project' as const, completed: false },
      { id: 'w2t4', task: 'Stack problems - 6 problems', type: 'dsa' as const, completed: false },
    ],
  },
  {
    week: 3,
    title: 'Intermediate Concepts',
    tasks: [
      { id: 'w3t1', task: 'Binary Search - 10 problems', type: 'dsa' as const, completed: false },
      { id: 'w3t2', task: 'CN: TCP/IP, HTTP, DNS', type: 'subject' as const, completed: false },
      { id: 'w3t3', task: 'Build REST API project', type: 'project' as const, completed: false },
      { id: 'w3t4', task: 'Tree traversals - 8 problems', type: 'dsa' as const, completed: false },
    ],
  },
  {
    week: 4,
    title: 'Deep Dive Week',
    tasks: [
      { id: 'w4t1', task: 'Graph BFS/DFS - 10 problems', type: 'dsa' as const, completed: false },
      { id: 'w4t2', task: 'System Design: Load Balancing', type: 'subject' as const, completed: false },
      { id: 'w4t3', task: 'Deploy project on Vercel/AWS', type: 'project' as const, completed: false },
      { id: 'w4t4', task: 'Dynamic Programming intro - 6 problems', type: 'dsa' as const, completed: false },
    ],
  },
]

// -----------------------------------------------------------------------------
// Dashboard Stats
// -----------------------------------------------------------------------------
export const mockDashboardStats = {
  resumeScore: 78,
  dsaStreak: 14,
  upcomingDeadlines: 3,
  interviewsDone: 5,
  problemsSolved: 120,
  weeklyProgress: [12, 15, 8, 20, 18, 14, 22],
}

// -----------------------------------------------------------------------------
// Recent Activity
// -----------------------------------------------------------------------------
export const mockRecentActivity = [
  { id: '1', action: 'Completed "Two Sum" problem', timestamp: '2 hours ago', type: 'dsa' as const },
  { id: '2', action: 'Updated resume - added new project', timestamp: '5 hours ago', type: 'resume' as const },
  { id: '3', action: 'Finished Mock Interview #5', timestamp: '1 day ago', type: 'interview' as const },
  { id: '4', action: 'Saved project idea: AI Study Matcher', timestamp: '1 day ago', type: 'project' as const },
  { id: '5', action: 'Joined team for Smart India Hackathon', timestamp: '2 days ago', type: 'team' as const },
  { id: '6', action: 'Completed Binary Trees module', timestamp: '3 days ago', type: 'dsa' as const },
]

// -----------------------------------------------------------------------------
// Testimonials
// -----------------------------------------------------------------------------
export const mockTestimonials = [
  {
    id: '1',
    name: 'Rahul Verma',
    college: 'JKLU, Jaipur',
    quote: 'LaunchPad helped me structure my placement prep. Got selected at Infosys!',
    rating: 5,
  },
  {
    id: '2',
    name: 'Ananya Singh',
    college: 'VIT, Vellore',
    quote: 'The AI resume reviewer caught issues I never noticed. My callback rate doubled.',
    rating: 5,
  },
  {
    id: '3',
    name: 'Karthik Menon',
    college: 'SRM Chennai',
    quote: 'Mock interviews with real-time feedback gave me confidence for actual rounds.',
    rating: 4,
  },
  {
    id: '4',
    name: 'Ishita Gupta',
    college: 'BITS Pilani',
    quote: 'Found my hackathon team through LaunchPad. We won 2nd place at SIH!',
    rating: 5,
  },
  {
    id: '5',
    name: 'Vikram Patel',
    college: 'NIT Surat',
    quote: 'The DSA roadmap kept me on track. 200+ problems solved in 3 months.',
    rating: 4,
  },
  {
    id: '6',
    name: 'Meera Iyer',
    college: 'COEP, Pune',
    quote: 'Project ideas tailored to my skills and target companies were game-changing.',
    rating: 5,
  },
  {
    id: '7',
    name: 'Aakash Jain',
    college: 'IIIT Lucknow',
    quote: 'From zero preparation to TCS Digital offer in 4 months. LaunchPad is essential.',
    rating: 5,
  },
  {
    id: '8',
    name: 'Divya Reddy',
    college: 'Manipal University',
    quote: 'The learning path generator created a personalized plan that actually worked.',
    rating: 4,
  },
]

// -----------------------------------------------------------------------------
// Features (Landing Page)
// -----------------------------------------------------------------------------
export const features = [
  {
    title: 'AI Resume Reviewer',
    description: 'Get instant ATS compatibility scores and actionable feedback powered by Claude AI.',
    icon: '📄',
    color: 'teal' as const,
  },
  {
    title: 'DSA Roadmap Tracker',
    description: 'Visual node-based roadmap with progress tracking across 200+ curated problems.',
    icon: '🗺️',
    color: 'indigo' as const,
  },
  {
    title: 'Mock Interview Simulator',
    description: 'Practice with AI-generated questions tailored to your target company and role.',
    icon: '🎯',
    color: 'teal' as const,
  },
  {
    title: 'Project Idea Generator',
    description: 'AI-curated project ideas matched to your skills, year, and dream companies.',
    icon: '💡',
    color: 'indigo' as const,
  },
  {
    title: 'Hackathon Team Finder',
    description: 'Find teammates with complementary skills for upcoming hackathons.',
    icon: '👥',
    color: 'teal' as const,
  },
  {
    title: 'Opportunity Tracker',
    description: 'Never miss a deadline — track internships, hackathons, and fellowships.',
    icon: '🔔',
    color: 'indigo' as const,
  },
  {
    title: 'Learning Path Generator',
    description: 'Personalized week-by-week placement prep plan based on your timeline.',
    icon: '📚',
    color: 'teal' as const,
  },
  {
    title: 'Admission Readiness Score',
    description: 'Evaluate your profile strength for MS/MBA applications with AI analysis.',
    icon: '🎓',
    color: 'indigo' as const,
  },
  {
    title: 'Competition Feed',
    description: 'Aggregated feed of coding contests, hackathons, and tech events.',
    icon: '🏆',
    color: 'teal' as const,
  },
  {
    title: 'Alumni Connect',
    description: 'Network with placed alumni for referrals, mentorship, and guidance.',
    icon: '🤝',
    color: 'indigo' as const,
  },
  {
    title: 'Soft Skills Trainer',
    description: 'Practice communication, presentation, and HR interview scenarios.',
    icon: '🎤',
    color: 'teal' as const,
  },
  {
    title: 'Company Prep Hub',
    description: 'Company-specific question banks, culture insights, and interview patterns.',
    icon: '🏢',
    color: 'indigo' as const,
  },
]
