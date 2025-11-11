/**
 * Seed data for John Choi's resume
 * Generated from ChoiLife.docx
 */

export const skillsData = [
  {
    category: "Programming Languages",
    items: [
      "Python",
      "R",
      "SQL",
      "Java",
      "JavaScript"
    ],
    displayOrder: 1
  },
  {
    category: "Data Science & Machine Learning",
    items: [
      "PyTorch",
      "TensorFlow",
      "Scikit-learn",
      "Pandas",
      "NumPy",
      "Matplotlib",
      "Seaborn",
      "XGBoost",
      "Random Forest",
      "SVM",
      "Decision Tree",
      "Sentiment Analysis",
      "Statistical Data Analysis"
    ],
    displayOrder: 2
  },
  {
    category: "Big Data & Cloud Technologies",
    items: [
      "Apache Spark",
      "PySpark",
      "AWS EC2",
      "Google Cloud Vertex AI",
      "Firebase",
      "High Performance Computing (HPC)"
    ],
    displayOrder: 3
  },
  {
    category: "Web Development",
    items: [
      "React.js",
      "Node.js",
      "Django",
      "Express",
      "HTML/CSS",
      "JavaScript",
      "RESTful APIs"
    ],
    displayOrder: 4
  },
  {
    category: "Computer Vision & Deep Learning",
    items: [
      "CNN",
      "EfficientNet",
      "InceptionV3",
      "Caffe",
      "Image Classification",
      "Outlier Detection",
      "PCA"
    ],
    displayOrder: 5
  },
  {
    category: "Tools & Technologies",
    items: [
      "Git/GitHub",
      "Docker",
      "Figma",
      "Tableau",
      "Power BI",
      "BeautifulSoup",
      "Selenium",
      "Microsoft Office Suite",
      "KMeans Clustering",
      "Time Series Analysis",
      "Data Mining",
      "Hyperparameter Tuning"
    ],
    displayOrder: 6
  },
  {
    category: "Soft Skills",
    items: [
      "Critical Thinking",
      "Problem Solving",
      "Leadership",
      "Team Management",
      "Technical Support",
      "Communication",
      "Conflict Resolution",
      "Agile Project Management"
    ],
    displayOrder: 7
  }
];

export const experiencesData = [
  {
    position: "Machine Learning Engineer",
    company: "Nittany AI Advance",
    location: "University Park, PA",
    date_from: "Aug 2024",
    date_to: "Present",
    description: [
      "Developed advanced outlier detection algorithms using Python, PyTorch, PCA, and KMeans+ clustering to successfully classify about 99% of non-leaf images from agricultural datasets containing over 1M images stored on Amazon EC2 instance",
      "Utilizing clean leaf dataset stored on Amazon EC2 instance, developed computer vision model using Python and TensorFlow, comparing different CNN models including EfficientNetB3 and InceptionV3 as base architecture to classify soil moisture ranges of plants",
      "Managed storage issues on AWS EC2 instance caused by insufficient space in root directory while maintaining optimal performance for installed libraries and data storage",
      "Collaborated with PlantVillage team, a non-profit research group from Penn State, to develop computer vision model predicting plant leaf stress levels"
    ],
    tags: ["Machine Learning", "Computer Vision", "Python", "PyTorch", "TensorFlow", "AWS", "CNN"],
    isActive: true,
    displayOrder: 1
  },
  {
    position: "Technology Tutor",
    company: "Penn State IT Learning & Development",
    location: "University Park, PA",
    date_from: "Aug 2023",
    date_to: "Present",
    description: [
      "Counseled students and faculty members to resolve technical issues by providing appropriate solutions through Zoom",
      "Delivered personalized technology assistance to address diverse range of technical challenges",
      "Supported faculty and students in troubleshooting issues related to online platforms, software, and hardware",
      "Prepared users for live events by ensuring seamless integration of technical setups"
    ],
    tags: ["Technical Support", "Communication", "Troubleshooting", "Customer Service"],
    isActive: true,
    displayOrder: 2
  },
  {
    position: "Undergraduate Research Assistant",
    company: "Penn State Listening Lab",
    location: "University Park, PA",
    date_from: "Jan 2024",
    date_to: "Aug 2024",
    description: [
      "Developed machine learning model to predict and validate raw audio data from U.S. National Parks",
      "Created training data by classifying raw acoustic data from U.S. National Parks"
    ],
    tags: ["Machine Learning", "Python", "Data Analysis", "Research"],
    isActive: true,
    displayOrder: 3
  },
  {
    position: "Data Science Intern",
    company: "Advanced Nano Products Co., Ltd (ANP)",
    location: "Daejeon, South Korea",
    date_from: "May 2023",
    date_to: "Aug 2023",
    description: [
      "Centralized and managed 1000+ physical company contracts by classifying and digitalizing them into electrical database, significantly improving accessibility and optimizing workflow efficiency",
      "Organized and translated company's ESG principles and guideline documents using Microsoft Word"
    ],
    tags: ["Data Management", "Database", "Translation", "Documentation"],
    isActive: true,
    displayOrder: 4
  },
  {
    position: "Development Team Intern",
    company: "Truwin Co Ltd",
    location: "Daejeon, South Korea",
    date_from: "May 2022",
    date_to: "Aug 2022",
    description: [
      "Researched and presented insights on smart healthcare services for international and domestic markets providing data-driven recommendations to guide project development and decision-making",
      "Worked as part of team to collect and analyze experimental data on vehicle motor and battery development"
    ],
    tags: ["Research", "Data Analysis", "Healthcare", "Presentation"],
    isActive: true,
    displayOrder: 5
  },
  {
    position: "AI Engineering Intern",
    company: "Cybermed Inc.",
    location: "Daejeon, South Korea",
    date_from: "Feb 2022",
    date_to: "May 2022",
    description: [
      "Designed algorithm model to optimize processing of $10K+ worth of software sales both internally within company and on website",
      "Crafted customer service chatbot and integrated to system through KakaoTalk API to boost efficiency and convenience for both customers and employees, utilizing SQL to analyze and interpret historical customer inquiries to model chatbot",
      "Organized and standardized company documentation using advanced features in Microsoft Excel and Word",
      "Collaborated as part of team to develop and enhance company's official website using Django"
    ],
    tags: ["AI", "Chatbot", "NLP", "SQL", "Django", "Web Development"],
    isActive: true,
    displayOrder: 6
  },
  {
    position: "Military Police Sergeant and Squad Leader",
    company: "Republic of Korea Air Force - 17th Fighter Wing",
    location: "Cheongju, South Korea",
    date_from: "May 2020",
    date_to: "Feb 2022",
    description: [
      "Supervised team of 50+ military police personnel, providing training, guidance, and coordination during operations",
      "Acted as first responder in emergencies, including accidents, breaches of security, and natural disasters, mitigating risks and ensuring effective resolution",
      "Mediated disputes among military personnel and civilians, utilizing effective communication and negotiation skills to maintain order",
      "Managed entry and exit points at secure facilities, conducting identity verification and preventing unauthorized access",
      "Processed and managed large volumes of sensitive and operational data using Microsoft Excel",
      "Created and formatted official documents, reports, and templates using Microsoft Word for efficient administrative workflows"
    ],
    tags: ["Leadership", "Team Management", "Communication", "Conflict Resolution"],
    isActive: true,
    displayOrder: 7
  },
  {
    position: "Intelligent Infra, Technology Research Center Intern",
    company: "Korea Institute of Science and Technology Information (KISTI)",
    location: "Daejeon, South Korea",
    date_from: "Sep 2019",
    date_to: "Dec 2019",
    description: [
      "Conducted in-depth investigation in Lightweight Deep Learning Model techniques, working closely with post-doctoral researchers engaging in hands-on research and practical implementation of neural network utilizing PyTorch and Caffe",
      "Documented research methodologies and results, translating complex technical processes and findings into English using Microsoft Word for broader accessibility and collaboration",
      "Diagnosed and resolved complex, unidentified errors during model implementation, employing systematic debugging techniques and documenting solutions to enhance reproducibility and future development"
    ],
    tags: ["Deep Learning", "PyTorch", "Caffe", "Research", "Technical Writing"],
    isActive: true,
    displayOrder: 8
  },
  {
    position: "Start-up Education & Support Team Intern",
    company: "Daedeok Innopolis Venture Association (DIVA)",
    location: "Daejeon, South Korea",
    date_from: "Jun 2018",
    date_to: "Jul 2018",
    description: [
      "Managed formal documents and events, conducting research and exploration before events",
      "Translated formal Korean documents to English"
    ],
    tags: ["Documentation", "Translation", "Event Planning"],
    isActive: true,
    displayOrder: 9
  }
];

export const projectsData = [
  {
    name: "Vibe.AI - Voice and Music Cloning Platform",
    position: "Full Stack Developer",
    date_from: "Aug 2024",
    date_to: "Dec 2024",
    description: [
      "Developed innovative platform for voice and music cloning with advanced customization features as senior capstone project at Penn State under agile project management",
      "Designed React.js frontend and Node.js backend, enabling real-time interaction with different APIs",
      "Integrated APIs like Play.ht for voice synthesis and cloning and Musicfy for AI music cover generation",
      "Implemented audio processing capabilities inspired by tools like Play.ht and Musicfy to empower users to personalize voice outputs and music covers"
    ],
    technologies: ["React.js", "Node.js", "JavaScript", "API Integration", "Audio Processing", "Agile"],
    githubUrl: "",
    demoUrl: "",
    isActive: true,
    displayOrder: 1
  },
  {
    name: "Crime Severity Analysis and Clustering in NYC",
    position: "Team Lead",
    date_from: "Aug 2024",
    date_to: "Dec 2024",
    description: [
      "Led research project focused on analyzing and predicting crime severity across NYC using machine learning techniques, integrating diverse datasets to provide actionable insights for urban safety management and resource allocation",
      "Developed comprehensive zip-code-specific dataset by merging NYPD Complaint Data with socio-economic indicators (e.g., income levels, unemployment rates) and environmental variables (e.g., public amenities, police stations) from multiple sources",
      "Applied KMeans clustering to categorize neighborhoods into four levels of crime severity, balancing interpretability and complexity",
      "Utilized Random Forest and XGBoost models to predict crime severity, achieving 94% accuracy by conducting hyperparameter tuning"
    ],
    technologies: ["Python", "Machine Learning", "KMeans", "Random Forest", "XGBoost", "Pandas", "Data Visualization"],
    githubUrl: "",
    demoUrl: "",
    isActive: true,
    displayOrder: 2
  },
  {
    name: "HackPSU - Loneliness Solution Platform",
    position: "Backend Developer",
    date_from: "Oct 2023",
    date_to: "Oct 2023",
    description: [
      "Won Overall 2nd Place, Nittany AI 2nd Place, and Best Use of Google Cloud 1st Place at Penn State's largest hackathon",
      "Developed user messaging web platform powered by machine learning AI and realtime database to address widespread issue of loneliness and isolation",
      "Created matching algorithm finding compatible groups of four people based on criteria such as MBTI, age, hobby, with algorithm refined through NLP and text sentiment analysis from user feedbacks",
      "Integrated Google Cloud Vertex AI API and Firebase database as backend developer, improving machine learning capabilities",
      "Created and deployed algorithm model to Node.js backend by training model using Google Cloud AutoML"
    ],
    technologies: ["Node.js", "Google Cloud", "Firebase", "Vertex AI", "NLP", "Machine Learning"],
    githubUrl: "",
    demoUrl: "",
    isActive: true,
    displayOrder: 3
  },
  {
    name: "Workplace Social Media Activity Research",
    position: "Undergraduate Researcher",
    date_from: "Jul 2023",
    date_to: "Present",
    description: [
      "Conducted research project under guidance of Dr. HyeJoon Park and Prof. Dongwon Lee, investigating impact of social/technical changes on organizational behaviors",
      "Designed and implemented data scraping model using Python libraries such as BeautifulSoup and Selenium to extract and organize detailed information on 200+ U.S. law firms and their lawyers",
      "Utilized Twitter APIs and GoogleSearch Python library to collect over 50,000 tweets from lawyers, enabling insights into social media engagement",
      "Performed sentiment analysis to evaluate patterns in how lawyers and law firms interact and communicate on social platforms"
    ],
    technologies: ["Python", "BeautifulSoup", "Selenium", "Twitter API", "Sentiment Analysis", "Data Scraping"],
    githubUrl: "",
    demoUrl: "",
    isActive: true,
    displayOrder: 4
  },
  {
    name: "Genre-Specific Book Recommendation System",
    position: "",
    date_from: "Jan 2024",
    date_to: "May 2024",
    description: [
      "Developed genre-specific book recommendation system utilizing Amazon book review dataset (~2.86GB) to design and implement system using Alternating Least Squares algorithm",
      "Utilized ICDS supercomputer for processing large-scale dataset, overcoming resource limitations of local machines",
      "Employed Apache Spark to preprocess, clean, and transform data at scale, significantly improving workflow efficiency",
      "Deployed ALS algorithm using Spark MLlib to generate personalized book recommendations",
      "Designed and trained recommendation model, fine-tuning ALS model's hyperparameters to achieve optimal performance evaluated using Root Mean Square Error (RMSE) metrics"
    ],
    technologies: ["Apache Spark", "PySpark", "Machine Learning", "Big Data", "HPC", "Python"],
    githubUrl: "",
    demoUrl: "",
    isActive: true,
    displayOrder: 5
  },
  {
    name: "American Statistical Association DataFest",
    position: "Team Lead",
    date_from: "Apr 2023",
    date_to: "Apr 2023",
    description: [
      "Awarded Best in Show (First Place) by leading team to analyze and interpret real-world datasets provided by American Bar Association",
      "Applied data preprocessing, statistical analytics, and data visualization using R Studio and Tableau",
      "Designed platform to match clients to appropriate attorneys based on experience level, number of cases, and hours spent on certain categories",
      "Analyzed dataset containing client and attorney information to create data-driven matching algorithm"
    ],
    technologies: ["R", "Tableau", "Statistical Analysis", "Data Visualization", "Data Analysis"],
    githubUrl: "",
    demoUrl: "",
    isActive: true,
    displayOrder: 6
  },
  {
    name: "Ladybug Development Club",
    position: "Event Planner",
    date_from: "Jan 2023",
    date_to: "Present",
    description: [
      "Reached out to local restaurants and startups to design and launch official websites using React and Node.js",
      "Enhanced digital presence of local businesses with consistent communication and consulting"
    ],
    technologies: ["React", "Node.js", "Web Development", "Consulting"],
    githubUrl: "",
    demoUrl: "",
    isActive: true,
    displayOrder: 7
  }
];
