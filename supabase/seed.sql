-- ========================================================
-- INTERN-UP SEED SCRIPT (13 Domains, 65 Tasks)
-- Idempotent: Can be run multiple times safely
-- ========================================================

-- Insert Initial Site Settings
INSERT INTO public.site_settings (id, upi_id, upi_qr_image_url, payment_instructions, support_email, founder_name, founder_title, program_fee, is_bootstrap_completed)
VALUES (
  'default_settings',
  '',
  '',
  'Please scan the UPI QR code or pay ₹100 directly to the official INTERN-UP UPI ID from any UPI app (GPay, PhonePe, Paytm, BHIM). After payment, enter your Transaction Reference (UTR) number below and submit for manual admin verification.',
  'jonathwatsan@gmail.com',
  'Dr. Jonath Watsan',
  'Founder, INTERN-UP',
  100.00,
  false
)
ON CONFLICT (id) DO NOTHING;

-- 1. Web Development
INSERT INTO public.domains (id, slug, name, description, icon_name, is_active, sort_order)
VALUES ('dom_web-development', 'web-development', 'Web Development', 'Master foundational modern web interfaces with HTML5, CSS3, responsive layouts, and interactive JavaScript.', 'Globe', true, 1)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;

INSERT INTO public.tasks (id, domain_id, title, instructions, learning_objective, expected_deliverable, suggested_tools, display_order)
VALUES 
('task_web-development_1', 'dom_web-development', 'Build a responsive personal profile webpage', 'Design and build a clean, semantic HTML5 webpage showcasing your bio, skills, education, and links. Use modern CSS (Flexbox or CSS Grid) to ensure the layout looks great on both mobile screens (375px) and desktop monitors (1200px+).', 'Understand semantic HTML markup, viewport meta tags, CSS media queries, and responsive design fundamentals.', 'A public GitHub repository with index.html, styles.css, and a README documenting your design decisions and live demo link.', 'VS Code, Google Chrome DevTools, HTML5, CSS3', 1),
('task_web-development_2', 'dom_web-development', 'Create an accessible contact form interface', 'Develop an interactive contact form featuring fields for Full Name, Email, Subject, and Message. Implement accessible label bindings (<label for>), client-side constraint validation (required, type="email"), and distinct styling for focus, error, and valid input states.', 'Learn accessible web form design (WCAG contrast, keyboard navigation) and native browser form validation.', 'A GitHub repository containing the form code, CSS styling for validation feedback, and screenshots of keyboard focus states.', 'HTML5 Form Controls, CSS pseudo-classes (:focus-visible, :invalid)', 2),
('task_web-development_3', 'dom_web-development', 'Build a responsive product landing page', 'Create a sleek product or course landing page. Include a sticky navigation bar with smooth scroll, a hero banner with call-to-action buttons, a feature grid with cards, and an FAQ accordion or pricing section. Maintain clean typography and consistent visual hierarchy.', 'Construct structured multi-section landing pages with cohesive design tokens, CSS variables, and fluid typography.', 'A GitHub repository containing the landing page assets and a README describing the page sections and responsiveness breakpoints.', 'HTML5, CSS3, Google Fonts (Inter/Outfit)', 3),
('task_web-development_4', 'dom_web-development', 'Create a simple interactive JavaScript component', 'Build a dynamic JavaScript component such as a theme switcher (Dark/Light mode with localStorage persistence), an image carousel/slider, or an interactive task checklist without external third-party libraries.', 'Gain practical experience with DOM manipulation, browser EventListeners, state management in Vanilla JavaScript, and localStorage API.', 'A GitHub repository with interactive scripts, clear comments explaining DOM selectors, and event handling logic.', 'Vanilla JavaScript (ES6+), Modern Browser DevTools', 4),
('task_web-development_5', 'dom_web-development', 'Combine the work into a documented GitHub repository', 'Consolidate your previous 4 web projects into a single organized portfolio repository or cohesive multi-page showcase. Add a comprehensive README.md with project overview, tech stack, screenshots, setup instructions, and deployment details (e.g. GitHub Pages or Vercel).', 'Master Git version control, branch workflows, professional repository documentation, and static web deployment.', 'A structured, polished GitHub repository with clean folder layout, complete README.md, and optional live demo link.', 'Git, GitHub, GitHub Pages or Vercel', 5)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, instructions = EXCLUDED.instructions;

-- 2. Python Programming
INSERT INTO public.domains (id, slug, name, description, icon_name, is_active, sort_order)
VALUES ('dom_python-programming', 'python-programming', 'Python Programming', 'Learn core Python syntax, algorithmic problem solving, file I/O operations, and data processing utilities.', 'Code2', true, 2)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;

INSERT INTO public.tasks (id, domain_id, title, instructions, learning_objective, expected_deliverable, suggested_tools, display_order)
VALUES 
('task_python-programming_1', 'dom_python-programming', 'Build a command-line calculator', 'Implement an interactive CLI calculator in Python capable of addition, subtraction, multiplication, division, and exponents. Implement robust error handling for division by zero and non-numeric inputs using try-except blocks.', 'Understand Python functions, user input handling, conditional control structures, and basic exception handling.', 'A GitHub repository with calculator.py and a README showing example CLI execution and test cases.', 'Python 3.x, Terminal/CLI, VS Code', 1),
('task_python-programming_2', 'dom_python-programming', 'Create a number guessing game', 'Create a game where the computer picks a random integer within a range (e.g. 1-100). The user guesses numbers with feedback ("Too high", "Too low") until correct. Track attempts, enforce a maximum try limit, and offer a replay option.', 'Master Python while loops, the standard random module, input sanitization, and state tracking across game iterations.', 'A GitHub repository containing game.py and documentation detailing the algorithm and winning conditions.', 'Python 3.x, standard library random', 2),
('task_python-programming_3', 'dom_python-programming', 'Write a program that processes a text file', 'Write a Python utility that reads a local text file, counts the total lines, words, and unique words, computes character frequency, and exports the statistical summary into a newly formatted report file.', 'Practice Python file I/O context managers (with open(...)), string operations, dictionary mapping, and file creation.', 'A GitHub repository with text_analyzer.py, sample input text file, output summary file, and documentation.', 'Python 3.x, os and collections modules', 3),
('task_python-programming_4', 'dom_python-programming', 'Create a basic CSV data-processing script', 'Develop a Python script using the native csv module to read a dataset (e.g., student grades, sales records, or inventory). Filter records matching specific criteria, compute column averages, and output a sorted summary CSV.', 'Understand structured tabular data handling, CSV parsing, data type casting, and filtering logic in Python.', 'A GitHub repository with csv_processor.py, sample CSV data, and a README explaining data filtering logic.', 'Python 3.x, csv module', 4),
('task_python-programming_5', 'dom_python-programming', 'Combine the programs into a documented GitHub repository', 'Organize all 4 Python utilities into a modular repository with a central menu (main.py) or well-structured package folders. Add a professional README.md with prerequisites, installation steps, and CLI usage guides.', 'Learn modular Python project organization, __init__.py packaging basics, PEP 8 styling conventions, and open-source documentation.', 'A GitHub repository with clean directory hierarchy, docstrings, requirements.txt (if any), and full README.', 'Git, GitHub, flake8 or black', 5)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, instructions = EXCLUDED.instructions;

-- 3. Java Programming
INSERT INTO public.domains (id, slug, name, description, icon_name, is_active, sort_order)
VALUES ('dom_java-programming', 'java-programming', 'Java Programming', 'Explore object-oriented programming concepts, Java collections, custom classes, and robust exception handling.', 'Coffee', true, 3)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;

INSERT INTO public.tasks (id, domain_id, title, instructions, learning_objective, expected_deliverable, suggested_tools, display_order)
VALUES 
('task_java-programming_1', 'dom_java-programming', 'Create a console-based calculator', 'Build a Java console application utilizing the Scanner class to perform basic arithmetic calculations. Include a clean menu loop, input validation, and proper method separation for each mathematical operation.', 'Understand Java primitive data types, Scanner input stream, switch-case statements, and static methods.', 'A GitHub repository with Calculator.java and documentation of sample inputs and outputs.', 'JDK 17+, IntelliJ IDEA / Eclipse / VS Code', 1),
('task_java-programming_2', 'dom_java-programming', 'Build a student information class using OOP', 'Design a Student class demonstrating encapsulation with private fields (id, name, course, marks), constructor overloading, getter/setter methods, and a method to calculate grade percentages.', 'Grasp Object-Oriented Programming (OOP) fundamentals: classes, objects, encapsulation, and constructors in Java.', 'A GitHub repository with Student.java and Main.java showing instance creation and method calls.', 'Java OOP, JDK 17+', 2),
('task_java-programming_3', 'dom_java-programming', 'Implement a simple collection-based record manager', 'Create a record manager in Java that uses an ArrayList or HashMap to store, search, display, and remove items (such as book titles or employee records) in memory via a console menu.', 'Learn the Java Collections Framework (List, Map), type parameters (Generics), and iterating over data structures.', 'A GitHub repository with RecordManager.java and test demonstrations documented in the README.', 'Java Collections Framework (ArrayList, HashMap)', 3),
('task_java-programming_4', 'dom_java-programming', 'Create a basic exception-handling example', 'Write a Java program demonstrating defensive coding using try-catch-finally blocks. Handle standard exceptions (e.g. NumberFormatException, ArithmeticException) and create one custom exception class (e.g. InvalidAgeException).', 'Understand checked vs unchecked exceptions, error propagation, custom exception hierarchies, and graceful failure handling.', 'A GitHub repository containing the exception handling code and custom exception class with sample test triggers.', 'Java Exception Hierarchy, JDK 17+', 4),
('task_java-programming_5', 'dom_java-programming', 'Combine the programs into a documented GitHub repository', 'Consolidate the Java exercises into an organized Maven or Gradle project structure (or structured src/ directory). Include a detailed README.md specifying compile and execution commands (javac and java).', 'Standardize Java project directory conventions, build scripts, and reproducible developer documentation.', 'A clean GitHub repository with standardized Java structure and build/run instructions.', 'Git, GitHub, JDK', 5)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, instructions = EXCLUDED.instructions;

-- 4. Artificial Intelligence
INSERT INTO public.domains (id, slug, name, description, icon_name, is_active, sort_order)
VALUES ('dom_artificial-intelligence', 'artificial-intelligence', 'Artificial Intelligence', 'Understand the foundations of AI systems, rule-based reasoning, sample data curation, and ethical considerations.', 'Cpu', true, 4)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;

INSERT INTO public.tasks (id, domain_id, title, instructions, learning_objective, expected_deliverable, suggested_tools, display_order)
VALUES 
('task_artificial-intelligence_1', 'dom_artificial-intelligence', 'Explain one practical AI use case', 'Research and write a concise technical paper analyzing one real-world AI application. Detail the problem, input data, AI technique used, and business impact.', 'Learn to evaluate real-world AI applications critically.', 'A GitHub repository containing a Markdown document (AI_USE_CASE.md).', 'Markdown, Academic/Industry Sources, VS Code', 1),
('task_artificial-intelligence_2', 'dom_artificial-intelligence', 'Build a rule-based question-answering demo', 'Develop an expert-system style rule-based QA assistant in Python. Given user keywords, output structured guidance.', 'Understand deterministic decision trees, knowledge representation, and rule-based inference.', 'A GitHub repository with qa_bot.py and predefined rules.', 'Python 3.x, regex or string matching', 2),
('task_artificial-intelligence_3', 'dom_artificial-intelligence', 'Prepare a small, clearly documented sample dataset', 'Curate a small, clean dataset of 50-100 entries for an AI task. Document features, label schemas, and preprocessing steps.', 'Learn data collection ethics, data annotation guidelines, and balance/bias awareness.', 'A GitHub repository containing dataset.json/csv with DATA_DICTIONARY.md.', 'CSV/JSON, Data Annotation practices', 3),
('task_artificial-intelligence_4', 'dom_artificial-intelligence', 'Create a basic AI concept demonstration', 'Build a simple demonstration illustrating a core AI concept, such as a nearest-neighbor classification script or A* pathfinding.', 'Gain intuitive understanding of algorithmic decision-making and heuristics.', 'A GitHub repository with working code and demonstration outputs.', 'Python 3.x, Matplotlib or CLI output', 4),
('task_artificial-intelligence_5', 'dom_artificial-intelligence', 'Document the demo, limitations, and learning outcomes', 'Write a comprehensive technical report summarizing your AI demonstrations. Detail assumptions made, failure modes, potential biases, and ethical limitations.', 'Synthesize AI learning outcomes, document engineering limitations, and discuss AI safety.', 'A polished GitHub repository with comprehensive README.md and technical report.', 'Markdown, Git, GitHub', 5)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, instructions = EXCLUDED.instructions;

-- 5. Machine Learning
INSERT INTO public.domains (id, slug, name, description, icon_name, is_active, sort_order)
VALUES ('dom_machine-learning', 'machine-learning', 'Machine Learning', 'Learn the core end-to-end machine learning pipeline: preprocessing, model training, evaluation metrics, and analysis.', 'Binary', true, 5)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;

INSERT INTO public.tasks (id, domain_id, title, instructions, learning_objective, expected_deliverable, suggested_tools, display_order)
VALUES 
('task_machine-learning_1', 'dom_machine-learning', 'Prepare a small sample dataset', 'Acquire a standard benchmark dataset. Inspect column distributions, null values, categorical variables, and descriptive statistics.', 'Understand dataset acquisition, exploratory inspection, and feature types.', 'A GitHub repository containing a script loading and profiling the dataset.', 'Python, Pandas, NumPy', 1),
('task_machine-learning_2', 'dom_machine-learning', 'Perform basic data cleaning', 'Implement data preprocessing: impute missing values, encode categorical variables, and scale numerical features.', 'Master data transformation techniques and preventing data leakage.', 'A GitHub repository containing preprocessing code showing before-and-after states.', 'Python, Scikit-Learn', 2),
('task_machine-learning_3', 'dom_machine-learning', 'Train a simple introductory model', 'Split dataset into train/test partitions (80/20). Train an introductory machine learning model (Linear/Logistic Regression or Decision Tree).', 'Learn train/test splitting methodology, model fitting, and hyperparameter awareness.', 'A GitHub repository demonstrating model fitting on training data.', 'Python, Scikit-Learn', 3),
('task_machine-learning_4', 'dom_machine-learning', 'Evaluate it using an appropriate metric', 'Evaluate your trained model on unseen test data. Compute MSE/R2 for regression, or confusion matrix, accuracy, and F1-score for classification.', 'Understand quantitative model evaluation and metric selection criteria.', 'A GitHub repository containing evaluation scripts with printed metric summaries.', 'Scikit-Learn metrics, Matplotlib', 4),
('task_machine-learning_5', 'dom_machine-learning', 'Document the model, results, and limitations', 'Create a final model card and summary report in your repository README. Explain model performance and recommendations.', 'Learn model governance, clear ML reporting standards, and objective evaluation.', 'A well-documented GitHub repository with complete pipeline code and README.', 'Git, GitHub, Markdown', 5)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, instructions = EXCLUDED.instructions;

-- 6. Data Science
INSERT INTO public.domains (id, slug, name, description, icon_name, is_active, sort_order)
VALUES ('dom_data-science', 'data-science', 'Data Science', 'Extract insights from real-world data through exploratory analysis, cleaning, descriptive statistics, and visualization.', 'LineChart', true, 6)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;

INSERT INTO public.tasks (id, domain_id, title, instructions, learning_objective, expected_deliverable, suggested_tools, display_order)
VALUES 
('task_data-science_1', 'dom_data-science', 'Load a small public dataset', 'Select and load a public CSV or JSON dataset. Print schema information, data shapes, and preview top records.', 'Learn automated data loading and preliminary schema verification.', 'A GitHub repository with a Python script or notebook documenting dataset source.', 'Python, Pandas, Jupyter', 1),
('task_data-science_2', 'dom_data-science', 'Clean missing or inconsistent values', 'Identify null values, duplicate entries, and inconsistent formatting. Clean and standardize the dataset programmatically.', 'Develop rigorous data sanitization workflows and maintain data fidelity.', 'A GitHub repository with cleaning script and documented summary of anomalies.', 'Python, Pandas', 2),
('task_data-science_3', 'dom_data-science', 'Calculate descriptive statistics', 'Compute key summary statistics across relevant columns: mean, median, standard deviation, IQR, and correlations.', 'Grasp foundational applied statistical concepts and measure central tendency.', 'A GitHub repository with statistics generation scripts and summary tables.', 'Pandas, NumPy, Scipy', 3),
('task_data-science_4', 'dom_data-science', 'Create simple exploratory visualizations', 'Generate at least 3 exploratory visual charts: a histogram, a scatter plot, and a bar/box plot.', 'Learn exploratory data visualization principles and visual encoding of data.', 'A GitHub repository with visualization code and exported PNG charts.', 'Matplotlib, Seaborn', 4),
('task_data-science_5', 'dom_data-science', 'Document the analysis and conclusions', 'Synthesize your findings into an executive summary report detailing key insights, observed trends, and recommendations.', 'Bridge technical data science findings with clear, actionable communication.', 'A GitHub repository with clean analysis scripts, charts, and a comprehensive README.', 'Markdown, GitHub', 5)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, instructions = EXCLUDED.instructions;

-- 7. Data Analytics
INSERT INTO public.domains (id, slug, name, description, icon_name, is_active, sort_order)
VALUES ('dom_data-analytics', 'data-analytics', 'Data Analytics', 'Transform raw business metrics into actionable dashboards, category breakdowns, and analytical reports.', 'BarChart3', true, 7)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;

INSERT INTO public.tasks (id, domain_id, title, instructions, learning_objective, expected_deliverable, suggested_tools, display_order)
VALUES 
('task_data-analytics_1', 'dom_data-analytics', 'Prepare a sample business dataset', 'Create or import a structured business dataset representing sales transactions or orders with categorical and quantitative fields.', 'Understand business operational data models and essential key performance metrics.', 'A GitHub repository containing the dataset file and documentation of field definitions.', 'CSV, Excel, or Python Pandas', 1),
('task_data-analytics_2', 'dom_data-analytics', 'Calculate key summary metrics', 'Calculate core business metrics: Total Revenue, Average Order Value (AOV), Total Transactions, and Profit Margins.', 'Learn formulaic KPI definition and aggregation techniques.', 'A GitHub repository with scripts computing aggregate metrics and printing summary tables.', 'Python (Pandas) or SQL', 2),
('task_data-analytics_3', 'dom_data-analytics', 'Analyze category-wise performance', 'Group data by segment. Compute revenue share, best-performing products, and lowest-performing cohorts.', 'Master group-by aggregation, cohort segmentation, and contribution analysis.', 'A GitHub repository with category analysis scripts and ranked tables.', 'Pandas groupby or SQL GROUP BY', 3),
('task_data-analytics_4', 'dom_data-analytics', 'Create a basic dashboard or visualization', 'Build a visual dashboard summary displaying revenue trends and category comparisons.', 'Understand dashboard layout conventions, chart hierarchy, and high-impact visual analytics.', 'A GitHub repository with dashboard script/code and generated dashboard visuals.', 'Matplotlib, Seaborn, Streamlit', 4),
('task_data-analytics_5', 'dom_data-analytics', 'Write a concise findings report', 'Author a professional analytical findings report summarizing key observations, revenue drivers, risks, and recommendations.', 'Cultivate data storytelling and stakeholder reporting skills.', 'A complete GitHub repository with dataset, scripts, charts, and a detailed README.', 'Markdown, GitHub', 5)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, instructions = EXCLUDED.instructions;

-- 8. Android Development
INSERT INTO public.domains (id, slug, name, description, icon_name, is_active, sort_order)
VALUES ('dom_android-development', 'android-development', 'Android Development', 'Build native Android UI components, multi-screen navigation, form handling, and list adapters with Kotlin/Java.', 'Smartphone', true, 8)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;

INSERT INTO public.tasks (id, domain_id, title, instructions, learning_objective, expected_deliverable, suggested_tools, display_order)
VALUES 
('task_android-development_1', 'dom_android-development', 'Create a basic Android application screen', 'Setup an Android Studio project. Design a clean welcome screen with a logo, app title, description, and primary action button.', 'Understand Android Studio project structure and basic UI layout composition.', 'A GitHub repository containing the Android project code and a screenshot.', 'Android Studio, Kotlin or Java, Jetpack Compose / XML', 1),
('task_android-development_2', 'dom_android-development', 'Implement navigation between two screens', 'Configure navigation between two screens using Android Navigation Component or Intent extras, passing a text parameter.', 'Master Activity/Fragment lifecycles and navigation parameter passing.', 'A GitHub repository with navigation code and an animated GIF or screenshots.', 'Android Navigation Component or Intents', 2),
('task_android-development_3', 'dom_android-development', 'Create a simple input form', 'Build a form screen containing inputs for User Name, Email, and Age with validation. Display a toast or snackbar confirmation.', 'Learn user input handling, input filters, keyboard actions, and feedback.', 'A GitHub repository containing the form implementation and validation code.', 'Android EditText / TextField, Toast / Snackbar', 3),
('task_android-development_4', 'dom_android-development', 'Display a list of sample records', 'Implement a scrollable list (RecyclerView or LazyColumn) displaying at least 10 items with card styling, icon, and title.', 'Master memory-efficient list virtualization and custom item view holders.', 'A GitHub repository with list adapter/LazyColumn implementation and dataset.', 'RecyclerView or Jetpack Compose LazyColumn', 4),
('task_android-development_5', 'dom_android-development', 'Document the application and its setup', 'Document the Android project in your README: Android SDK requirements, gradle build configuration, and emulator instructions.', 'Develop complete Android application documentation and build awareness.', 'A well-structured GitHub repository with source code and detailed README.', 'Git, GitHub, Gradle', 5)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, instructions = EXCLUDED.instructions;

-- 9. UI/UX Design
INSERT INTO public.domains (id, slug, name, description, icon_name, is_active, sort_order)
VALUES ('dom_ui-ux-design', 'ui-ux-design', 'UI/UX Design', 'Master user-centered design, persona development, wireframing, high-fidelity UI design, and user journey mapping.', 'Palette', true, 9)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;

INSERT INTO public.tasks (id, domain_id, title, instructions, learning_objective, expected_deliverable, suggested_tools, display_order)
VALUES 
('task_ui-ux-design_1', 'dom_ui-ux-design', 'Define a target user and problem', 'Select a problem statement. Write a design brief articulating the problem, target audience, core constraints, and user goals.', 'Understand user research fundamentals, problem scoping, and design brief authoring.', 'A GitHub repository containing DESIGN_BRIEF.md with problem statements.', 'Figma, Notion, or Markdown', 1),
('task_ui-ux-design_2', 'dom_ui-ux-design', 'Create user personas or brief user requirements', 'Develop 2 distinct user personas representing primary users. Detail demographics, behaviors, pain points, and motivations.', 'Learn persona development, user empathy mapping, and requirement scoping.', 'A GitHub repository with persona cards in the docs folder.', 'Figma, Canva, or Markdown', 2),
('task_ui-ux-design_3', 'dom_ui-ux-design', 'Draw a basic wireframe', 'Create low-fidelity wireframes for 3 key screens focusing on layout structure, content hierarchy, and information density.', 'Understand structural wireframing, layout balance, and content-first interface planning.', 'A GitHub repository containing exported wireframe images and annotations.', 'Figma, Whimsical, Balsamiq', 3),
('task_ui-ux-design_4', 'dom_ui-ux-design', 'Create a high-fidelity screen design', 'Design high-fidelity versions of your screens. Define a consistent design system (typography scale, spacing grid, color palette).', 'Apply visual design principles: hierarchy, accessibility standards (WCAG AA), and component consistency.', 'A GitHub repository containing exported high-fidelity screen mockups and Figma link.', 'Figma / Penpot', 4),
('task_ui-ux-design_5', 'dom_ui-ux-design', 'Document the design decisions and user flow', 'Compile a comprehensive case study documenting the entire process: problem definition, wireframes, iterations, and user flow.', 'Master UX case study presentation and design rationalization for stakeholders.', 'A polished GitHub repository with all assets, diagrams, and README case study.', 'Git, GitHub, Figma', 5)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, instructions = EXCLUDED.instructions;

-- 10. Cybersecurity
INSERT INTO public.domains (id, slug, name, description, icon_name, is_active, sort_order)
VALUES ('dom_cybersecurity', 'cybersecurity', 'Cybersecurity', 'Learn defensive cybersecurity principles, OWASP Top 10 vulnerabilities, safe log analysis, and defensive security checklists.', 'ShieldCheck', true, 10)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;

INSERT INTO public.tasks (id, domain_id, title, instructions, learning_objective, expected_deliverable, suggested_tools, display_order)
VALUES 
('task_cybersecurity_1', 'dom_cybersecurity', 'Identify common web security risks', 'Research and author a defensive report on 3 common OWASP Top 10 web vulnerabilities (SQLi, XSS, IDOR). Explain causes, impact, and standard remediation.', 'Understand common web vulnerabilities, threat modeling, and preventative design.', 'A GitHub repository containing OWASP_ANALYSIS.md with defensive mitigations.', 'Markdown, OWASP Documentation', 1),
('task_cybersecurity_2', 'dom_cybersecurity', 'Create a password-strength explanation demo', 'Build a client-side or Python defensive tool evaluating password strength. Check length, character entropy, and common dictionary words safely.', 'Understand authentication security, entropy calculation, and user security guidance.', 'A GitHub repository with password_evaluator.py or HTML/JS demo.', 'Python or Vanilla JavaScript (client-side only)', 2),
('task_cybersecurity_3', 'dom_cybersecurity', 'Analyze safe sample security logs', 'Analyze a synthetic web server log file. Write a script to identify potential anomaly patterns: repeated 404s, suspicious SQL characters, or bursts.', 'Understand defensive security logging and anomaly detection.', 'A GitHub repository with log_analyzer.py, sample log file, and incident report.', 'Python standard library (re, datetime)', 3),
('task_cybersecurity_4', 'dom_cybersecurity', 'Document secure coding practices', 'Create a defensive secure coding standard guide covering parameterization, input sanitization, output encoding, HTTPS, and secure cookies.', 'Master secure software development lifecycle (SSDLC) principles and coding guidelines.', 'A GitHub repository containing SECURE_CODING_GUIDELINES.md.', 'Markdown, Git, GitHub', 4),
('task_cybersecurity_5', 'dom_cybersecurity', 'Prepare a defensive security checklist', 'Compile an end-to-end defensive deployment checklist for a modern web application: server hardening, firewall rules, dependency auditing, and secrets management.', 'Consolidate operational cybersecurity knowledge and defensive infrastructure posture.', 'A complete GitHub repository with code examples and defensive checklist README.', 'Markdown, GitHub', 5)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, instructions = EXCLUDED.instructions;

-- 11. Cloud Computing
INSERT INTO public.domains (id, slug, name, description, icon_name, is_active, sort_order)
VALUES ('dom_cloud-computing', 'cloud-computing', 'Cloud Computing', 'Explore cloud service models (IaaS, PaaS, SaaS), cloud architecture design, security policies, and deployment monitoring.', 'Cloud', true, 11)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;

INSERT INTO public.tasks (id, domain_id, title, instructions, learning_objective, expected_deliverable, suggested_tools, display_order)
VALUES 
('task_cloud-computing_1', 'dom_cloud-computing', 'Explain basic cloud service models', 'Write a comparative technical document explaining IaaS, PaaS, and SaaS models. Provide concrete examples and compare shared responsibility.', 'Understand cloud computing taxonomy, shared responsibility security, and infrastructure delegation.', 'A GitHub repository containing CLOUD_MODELS.md with comparative tables.', 'Markdown, Cloud provider documentation', 1),
('task_cloud-computing_2', 'dom_cloud-computing', 'Create a small cloud architecture diagram', 'Design a high-availability cloud architecture diagram for a web app: DNS -> Load Balancer -> Web App Instances -> Managed DB + Object Storage.', 'Learn cloud architectural patterns: decoupling, redundancy, scalability, and multi-tier topologies.', 'A GitHub repository with architecture diagram (PNG/SVG) and architectural decision record.', 'Draw.io, Lucidchart, Excalidraw, or Mermaid', 2),
('task_cloud-computing_3', 'dom_cloud-computing', 'Configure a permitted introductory cloud service or simulation', 'Deploy a static web application or serverless function on a free cloud tier (Vercel, Cloudflare Pages, Netlify) or run a local cloud simulation using LocalStack.', 'Gain hands-on experience deploying code to cloud-managed edge/serverless environments.', 'A GitHub repository containing deployed code, deployment configuration, and live URL or simulation logs.', 'Vercel, Cloudflare Pages, Netlify, or LocalStack', 3),
('task_cloud-computing_4', 'dom_cloud-computing', 'Document access-control and security considerations', 'Document Identity and Access Management (IAM) best practices: Principle of Least Privilege, RBAC, MFA, and safe credential management.', 'Understand cloud security fundamentals, IAM policies, and cloud credential hygiene.', 'A GitHub repository containing CLOUD_SECURITY.md with sample IAM policy JSON structures.', 'Markdown, IAM policy samples', 4),
('task_cloud-computing_5', 'dom_cloud-computing', 'Prepare a deployment and monitoring checklist', 'Create an operations and observability checklist: health check endpoints, uptime monitoring, log aggregation, alerting thresholds, and backup schedules.', 'Learn cloud site reliability engineering (SRE) basics, monitoring, and proactive alerting.', 'A GitHub repository with complete architecture diagrams, configs, and comprehensive README.', 'Markdown, Git, GitHub', 5)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, instructions = EXCLUDED.instructions;

-- 12. Internet of Things
INSERT INTO public.domains (id, slug, name, description, icon_name, is_active, sort_order)
VALUES ('dom_iot', 'iot', 'Internet of Things', 'Understand IoT architecture, sensor data simulation, telemetry message protocols (MQTT/HTTP), and monitoring displays.', 'Cpu', true, 12)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;

INSERT INTO public.tasks (id, domain_id, title, instructions, learning_objective, expected_deliverable, suggested_tools, display_order)
VALUES 
('task_iot_1', 'dom_iot', 'Explain a basic sensor-based system', 'Write a technical overview explaining the components of an IoT ecosystem: edge sensor nodes, microcontrollers, gateways, cloud broker, and application layer.', 'Understand end-to-end IoT system architecture and edge vs cloud processing.', 'A GitHub repository containing IOT_ARCHITECTURE.md with system block diagrams.', 'Markdown, Diagrams.net / Mermaid', 1),
('task_iot_2', 'dom_iot', 'Create a simple sensor simulation', 'Write a Python or JavaScript simulation script that generates realistic periodic sensor readings with random noise. Format data as structured JSON.', 'Understand time-series telemetry data generation, sampling intervals, and JSON payload serialization.', 'A GitHub repository containing sensor_simulator.py or sensor_simulator.js emitting continuous readings.', 'Python 3.x or Node.js', 2),
('task_iot_3', 'dom_iot', 'Document the data flow', 'Document the protocol payload journey from sensor simulation to a central receiver using MQTT or HTTP POST. Detail MQTT topics, QoS levels, and packet sizes.', 'Master IoT messaging protocols, bandwidth constraints, and lightweight pub-sub patterns.', 'A GitHub repository containing PROTOCOL_DOCUMENTATION.md with sequence diagrams.', 'Markdown, Mermaid Sequence Diagram', 3),
('task_iot_4', 'dom_iot', 'Prepare a basic monitoring interface or diagram', 'Create a simple webpage or console dashboard reading your simulated sensor stream and displaying current metrics with visual warnings for threshold breaches.', 'Understand real-time metric visualization, alert triggering, and telemetry UI design.', 'A GitHub repository with the monitoring script/page and screenshots of active telemetry.', 'HTML/CSS/JS or Python curses/CLI', 4),
('task_iot_5', 'dom_iot', 'Document the design and safety considerations', 'Author a final report covering IoT physical constraints: power consumption strategies (deep sleep), network resilience, offline buffering, and firmware security.', 'Synthesize low-power engineering principles, reliability, and edge device safety.', 'A GitHub repository containing the simulator, documentation, diagrams, and README report.', 'Git, GitHub, Markdown', 5)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, instructions = EXCLUDED.instructions;

-- 13. Database Management
INSERT INTO public.domains (id, slug, name, description, icon_name, is_active, sort_order)
VALUES ('dom_database-management', 'database-management', 'Database Management', 'Design normalized relational schemas, write ACID compliant CRUD operations, complex JOIN queries, and performance indexes.', 'Database', true, 13)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;

INSERT INTO public.tasks (id, domain_id, title, instructions, learning_objective, expected_deliverable, suggested_tools, display_order)
VALUES 
('task_database-management_1', 'dom_database-management', 'Design a simple relational schema', 'Design an Entity-Relationship (ER) model for an e-commerce or library system containing at least 3 related entities. Define primary keys, foreign keys, and cardinalities.', 'Understand database normalization (1NF, 2NF, 3NF), relational integrity, and entity relationships.', 'A GitHub repository containing an ER diagram and schema definition documentation.', 'Draw.io, dbdiagram.io, or Mermaid ER Diagram', 1),
('task_database-management_2', 'dom_database-management', 'Create tables with appropriate relationships', 'Write standard SQL DDL CREATE TABLE statements implementing the designed schema with primary keys, foreign keys, NOT NULL, and CHECK constraints.', 'Master SQL DDL syntax, constraint enforcement, and column data type selection.', 'A GitHub repository containing schema.sql with executable table definitions.', 'PostgreSQL, SQLite, or MySQL', 2),
('task_database-management_3', 'dom_database-management', 'Write basic CRUD SQL queries', 'Write SQL statements to INSERT sample realistic records into all tables, SELECT data with WHERE and ORDER BY, UPDATE safely, and DELETE test records.', 'Practice SQL Data Manipulation Language (DML) and query execution.', 'A GitHub repository containing crud_queries.sql with commented explanations.', 'SQL CLI, DBeaver, or pgAdmin', 3),
('task_database-management_4', 'dom_database-management', 'Write JOIN and aggregation queries', 'Compose advanced SQL queries utilizing INNER JOIN, LEFT JOIN, GROUP BY, and aggregate functions (COUNT, SUM, AVG) along with HAVING filters.', 'Master multi-table relational joins, data aggregation, and analytical query construction.', 'A GitHub repository containing advanced_queries.sql and expected query results.', 'PostgreSQL, SQLite, or MySQL', 4),
('task_database-management_5', 'dom_database-management', 'Document the schema, sample data, and queries', 'Assemble a comprehensive SQL documentation repository: schema diagrams, setup scripts, data dictionaries, query execution plans (EXPLAIN), and index optimization notes.', 'Develop complete database engineering documentation and query optimization awareness.', 'A complete GitHub repository with schema.sql, seed.sql, queries.sql, and comprehensive README.', 'Git, GitHub, Markdown', 5)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, instructions = EXCLUDED.instructions;
