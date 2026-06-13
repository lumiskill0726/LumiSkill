-- Populate course_syllabus table with syllabus for all courses
-- First, get the actual course IDs from your database

-- Python Basics (python-basics) - 4 months
INSERT INTO course_syllabus (course_id, month_number, title, topics)
SELECT id, 1, 'Getting Started with Python', ARRAY['What is programming?', 'Installing Python', 'Your first "Hello World" program', 'Variables and data types', 'Basic input/output']
FROM courses WHERE slug = 'python-basics'
UNION ALL
SELECT id, 2, 'Control Flow & Functions', ARRAY['If-else statements', 'Loops (for, while)', 'Break and continue', 'Functions basics', 'Parameters and return values']
FROM courses WHERE slug = 'python-basics'
UNION ALL
SELECT id, 3, 'Data Structures', ARRAY['Lists and tuples', 'Dictionaries', 'Sets', 'String manipulation', 'List comprehensions']
FROM courses WHERE slug = 'python-basics'
UNION ALL
SELECT id, 4, 'File Handling & Projects', ARRAY['Reading files', 'Writing files', 'Exception handling', 'Mini projects', 'Final project']
FROM courses WHERE slug = 'python-basics';

-- Python Programming (python-programming) - 6 months
INSERT INTO course_syllabus (course_id, month_number, title, topics)
SELECT id, 1, 'Advanced Python Basics', ARRAY['OOP concepts', 'Classes and objects', 'Inheritance', 'Polymorphism', 'Encapsulation']
FROM courses WHERE slug = 'python-programming'
UNION ALL
SELECT id, 2, 'Python Libraries', ARRAY['NumPy basics', 'Pandas for data', 'Matplotlib visualization', 'Working with APIs', 'JSON handling']
FROM courses WHERE slug = 'python-programming'
UNION ALL
SELECT id, 3, 'Web Development', ARRAY['Flask framework', 'Routes and templates', 'Forms and validation', 'Database integration', 'REST APIs']
FROM courses WHERE slug = 'python-programming'
UNION ALL
SELECT id, 4, 'Data Analysis', ARRAY['Data cleaning', 'Data visualization', 'Statistical analysis', 'Working with CSV/Excel', 'Data pipelines']
FROM courses WHERE slug = 'python-programming'
UNION ALL
SELECT id, 5, 'Advanced Topics', ARRAY['Decorators', 'Generators', 'Context managers', 'Multithreading', 'Async programming']
FROM courses WHERE slug = 'python-programming'
UNION ALL
SELECT id, 6, 'Final Projects', ARRAY['Project planning', 'Building web app', 'Data analysis project', 'API development', 'Deployment']
FROM courses WHERE slug = 'python-programming';

-- Java Programming (java-programming) - 6 months
INSERT INTO course_syllabus (course_id, month_number, title, topics)
SELECT id, 1, 'Advanced Java Concepts', ARRAY['Collections framework', 'Generics', 'Lambda expressions', 'Stream API', 'Functional interfaces']
FROM courses WHERE slug = 'java-programming'
UNION ALL
SELECT id, 2, 'Multithreading', ARRAY['Thread basics', 'Synchronization', 'Executor framework', 'Concurrent collections', 'Thread pools']
FROM courses WHERE slug = 'java-programming'
UNION ALL
SELECT id, 3, 'Database & JDBC', ARRAY['SQL basics', 'JDBC connection', 'PreparedStatement', 'Transaction management', 'Connection pooling']
FROM courses WHERE slug = 'java-programming'
UNION ALL
SELECT id, 4, 'Spring Framework', ARRAY['Spring Core', 'Dependency injection', 'Spring Boot', 'REST APIs', 'Spring Data JPA']
FROM courses WHERE slug = 'java-programming'
UNION ALL
SELECT id, 5, 'Web Development', ARRAY['Servlets', 'JSP', 'Spring MVC', 'Thymeleaf', 'Form handling']
FROM courses WHERE slug = 'java-programming'
UNION ALL
SELECT id, 6, 'Project Development', ARRAY['Project architecture', 'Building REST API', 'Frontend integration', 'Testing', 'Deployment']
FROM courses WHERE slug = 'java-programming';

-- Java & DSA (java-dsa) - 8 months
INSERT INTO course_syllabus (course_id, month_number, title, topics)
SELECT id, 1, 'Arrays & Strings', ARRAY['Array operations', 'Two pointers', 'Sliding window', 'String manipulation', 'Pattern matching']
FROM courses WHERE slug = 'java-dsa'
UNION ALL
SELECT id, 2, 'Linked Lists', ARRAY['Singly linked list', 'Doubly linked list', 'Circular linked list', 'Fast & slow pointers', 'List reversal']
FROM courses WHERE slug = 'java-dsa'
UNION ALL
SELECT id, 3, 'Stacks & Queues', ARRAY['Stack implementation', 'Queue implementation', 'Deque', 'Priority queue', 'Monotonic stack']
FROM courses WHERE slug = 'java-dsa'
UNION ALL
SELECT id, 4, 'Trees & BST', ARRAY['Binary trees', 'Tree traversals', 'Binary search tree', 'AVL trees', 'Tree problems']
FROM courses WHERE slug = 'java-dsa'
UNION ALL
SELECT id, 5, 'Graphs', ARRAY['Graph representation', 'BFS & DFS', 'Shortest path', 'Topological sort', 'Union find']
FROM courses WHERE slug = 'java-dsa'
UNION ALL
SELECT id, 6, 'Dynamic Programming', ARRAY['DP basics', 'Memoization', 'Tabulation', 'Classic DP problems', 'Optimization']
FROM courses WHERE slug = 'java-dsa'
UNION ALL
SELECT id, 7, 'Advanced Algorithms', ARRAY['Greedy algorithms', 'Backtracking', 'Divide & conquer', 'Bit manipulation', 'Math algorithms']
FROM courses WHERE slug = 'java-dsa'
UNION ALL
SELECT id, 8, 'Interview Prep', ARRAY['Problem solving', 'System design basics', 'Mock interviews', 'LeetCode practice', 'Interview tips']
FROM courses WHERE slug = 'java-dsa';

-- Web Development (web-development) - 6 months
INSERT INTO course_syllabus (course_id, month_number, title, topics)
SELECT id, 1, 'HTML & CSS Basics', ARRAY['HTML structure', 'Semantic HTML', 'CSS selectors', 'Flexbox', 'Grid layout']
FROM courses WHERE slug = 'web-development'
UNION ALL
SELECT id, 2, 'JavaScript Fundamentals', ARRAY['Variables & data types', 'Functions', 'DOM manipulation', 'Events', 'ES6 features']
FROM courses WHERE slug = 'web-development'
UNION ALL
SELECT id, 3, 'React Basics', ARRAY['Components', 'Props & state', 'Hooks', 'Event handling', 'Conditional rendering']
FROM courses WHERE slug = 'web-development'
UNION ALL
SELECT id, 4, 'Advanced React', ARRAY['Context API', 'React Router', 'Forms', 'API integration', 'State management']
FROM courses WHERE slug = 'web-development'
UNION ALL
SELECT id, 5, 'Backend Basics', ARRAY['Node.js', 'Express.js', 'REST APIs', 'MongoDB', 'Authentication']
FROM courses WHERE slug = 'web-development'
UNION ALL
SELECT id, 6, 'Full Project', ARRAY['Project planning', 'Frontend development', 'Backend development', 'Integration', 'Deployment']
FROM courses WHERE slug = 'web-development';

-- Full Stack Web Dev (full-stack-web-dev) - 10 months
INSERT INTO course_syllabus (course_id, month_number, title, topics)
SELECT id, 1, 'Frontend Foundations', ARRAY['HTML5', 'CSS3', 'Responsive design', 'Bootstrap', 'Tailwind CSS']
FROM courses WHERE slug = 'full-stack-web-dev'
UNION ALL
SELECT id, 2, 'JavaScript Mastery', ARRAY['Advanced JS', 'Async programming', 'Promises', 'Fetch API', 'Error handling']
FROM courses WHERE slug = 'full-stack-web-dev'
UNION ALL
SELECT id, 3, 'React Development', ARRAY['React fundamentals', 'Hooks', 'Context', 'Redux', 'Next.js']
FROM courses WHERE slug = 'full-stack-web-dev'
UNION ALL
SELECT id, 4, 'Backend with Node', ARRAY['Node.js', 'Express', 'Middleware', 'REST APIs', 'GraphQL']
FROM courses WHERE slug = 'full-stack-web-dev'
UNION ALL
SELECT id, 5, 'Databases', ARRAY['SQL basics', 'PostgreSQL', 'MongoDB', 'Prisma ORM', 'Database design']
FROM courses WHERE slug = 'full-stack-web-dev'
UNION ALL
SELECT id, 6, 'Authentication & Security', ARRAY['JWT', 'OAuth', 'Session management', 'Security best practices', 'CORS']
FROM courses WHERE slug = 'full-stack-web-dev'
UNION ALL
SELECT id, 7, 'Testing & DevOps', ARRAY['Unit testing', 'Integration testing', 'CI/CD', 'Docker', 'Git workflows']
FROM courses WHERE slug = 'full-stack-web-dev'
UNION ALL
SELECT id, 8, 'Cloud & Deployment', ARRAY['AWS basics', 'Vercel', 'Netlify', 'Environment variables', 'Monitoring']
FROM courses WHERE slug = 'full-stack-web-dev'
UNION ALL
SELECT id, 9, 'Advanced Topics', ARRAY['WebSockets', 'Microservices', 'Caching', 'Performance optimization', 'SEO']
FROM courses WHERE slug = 'full-stack-web-dev'
UNION ALL
SELECT id, 10, 'Capstone Project', ARRAY['Project planning', 'Architecture design', 'Development', 'Testing', 'Deployment']
FROM courses WHERE slug = 'full-stack-web-dev';

-- AI & Automation (ai-automation) - 8 months
INSERT INTO course_syllabus (course_id, month_number, title, topics)
SELECT id, 1, 'Python for AI', ARRAY['Python basics', 'NumPy', 'Pandas', 'Matplotlib', 'Data preprocessing']
FROM courses WHERE slug = 'ai-automation'
UNION ALL
SELECT id, 2, 'Machine Learning Basics', ARRAY['Supervised learning', 'Regression', 'Classification', 'Model evaluation', 'Scikit-learn']
FROM courses WHERE slug = 'ai-automation'
UNION ALL
SELECT id, 3, 'Deep Learning', ARRAY['Neural networks', 'TensorFlow', 'Keras', 'CNN basics', 'Transfer learning']
FROM courses WHERE slug = 'ai-automation'
UNION ALL
SELECT id, 4, 'Natural Language Processing', ARRAY['Text preprocessing', 'Word embeddings', 'Sentiment analysis', 'Text classification', 'Transformers']
FROM courses WHERE slug = 'ai-automation'
UNION ALL
SELECT id, 5, 'Computer Vision', ARRAY['Image processing', 'Object detection', 'Image classification', 'OpenCV', 'YOLO']
FROM courses WHERE slug = 'ai-automation'
UNION ALL
SELECT id, 6, 'Automation with Python', ARRAY['Web scraping', 'Selenium', 'API automation', 'Task scheduling', 'Email automation']
FROM courses WHERE slug = 'ai-automation'
UNION ALL
SELECT id, 7, 'AI Model Deployment', ARRAY['Flask APIs', 'FastAPI', 'Model serving', 'Docker', 'Cloud deployment']
FROM courses WHERE slug = 'ai-automation'
UNION ALL
SELECT id, 8, 'Final AI Project', ARRAY['Problem definition', 'Data collection', 'Model building', 'Deployment', 'Presentation']
FROM courses WHERE slug = 'ai-automation';
