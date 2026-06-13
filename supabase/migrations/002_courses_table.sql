-- Create courses table
CREATE TABLE IF NOT EXISTS courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  long_description TEXT,
  level TEXT NOT NULL,
  duration_months INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  icon TEXT,
  badge TEXT,
  badge_type TEXT,
  is_active BOOLEAN DEFAULT true,
  students_enrolled INTEGER DEFAULT 0,
  next_batch_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create course_syllabus table (for storing syllabus modules)
CREATE TABLE IF NOT EXISTS course_syllabus (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  month_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  topics TEXT[] NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(course_id, month_number)
);

-- Create course_faqs table
CREATE TABLE IF NOT EXISTS course_faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_courses_slug ON courses(slug);
CREATE INDEX idx_courses_is_active ON courses(is_active);
CREATE INDEX idx_course_syllabus_course_id ON course_syllabus(course_id);
CREATE INDEX idx_course_faqs_course_id ON course_faqs(course_id);

-- Insert sample courses from your courses.js data
INSERT INTO courses (slug, title, subtitle, description, long_description, level, duration_months, price, icon, badge, badge_type, next_batch_date, is_active) VALUES
('java-basics', 'Java Basics', 'Beginner', 'Start your coding journey with Java — learn syntax, variables, and simple programs. A perfect first step into programming.', 'This course is designed specifically for Class 6–8 students with zero prior coding experience. Through fun exercises, games, and simple programs, your child will build a strong foundation in programming logic using Java — the world''s most widely used language.', 'Beginner', 4, 4999.00, '☕', 'Beginner Friendly', 'fun', '2026-07-01', true),
('python-basics', 'Python Basics', 'Beginner', 'Learn Python — the world''s most beginner-friendly language. Build simple programs and develop logical thinking skills.', 'Python is the #1 language for beginners and professionals alike. Used by Google, Netflix, NASA, and every AI company in the world. In this course, Class 6–8 students learn Python through fun mini-projects, interactive exercises, and exciting challenges.', 'Beginner', 4, 5999.00, '🐍', 'Most Popular', 'popular', '2026-07-01', true),
('python-programming', 'Python Programming', 'Intermediate', 'Advance your Python skills with OOP, functions, and real mini-projects. Build practical programs from scratch.', 'This is where Python gets exciting. Class 9–10 students move beyond the basics into Object-Oriented Programming (OOP), file handling, and building real programs that actually solve problems.', 'Beginner–Intermediate', 6, 7999.00, '🐍', 'Best Seller', 'bestseller', '2026-07-15', true),
('web-development', 'Web Development', 'Intermediate', 'Build stunning websites from scratch. Learn HTML5, CSS3 and JavaScript to create real projects you can show off to the world.', 'Web development is the most visible and rewarding skill to learn. Your child will go from zero to building stunning, responsive websites using HTML5, CSS3, and JavaScript.', 'Beginner–Intermediate', 6, 9999.00, '🌐', '🔥 Trending', 'trending', '2026-07-15', true),
('java-programming', 'Java Programming', 'Intermediate', 'Master Java with OOP, functions, and hands-on mini-projects. Build a strong foundation for advanced courses.', 'Java is the backbone of enterprise software, Android apps, and competitive programming. This 6-month course takes Class 9–10 students deep into Java — covering OOP, collections, and real project development.', 'Intermediate', 6, 8999.00, '☕', 'High Demand', 'advanced', '2026-08-01', true),
('java-dsa', 'Java & DSA', 'Advanced', 'Master Java and Data Structures & Algorithms — the foundation for cracking top coding interviews and building enterprise apps.', 'DSA (Data Structures & Algorithms) is the single most important skill for getting into top engineering colleges (IIT/NIT) and cracking tech interviews at companies like Google, Amazon, and Microsoft.', 'Intermediate–Advanced', 8, 11999.00, '🌳', 'Advanced', 'advanced', '2026-08-01', true),
('ai-automation', 'AI & Automation', 'Advanced', 'Build AI apps — the skill of the future, today! Step into the future with Python & APIs.', 'AI is not the future — it''s the present. Companies are hiring AI engineers at record salaries. This course teaches Class 11–12 students to build real AI applications using Python.', 'Intermediate', 6, 9999.00, '🤖', '🔥 Hot', 'trending', '2026-08-15', true),
('full-stack-web-dev', 'Full Stack Web Dev', 'Advanced', 'Build complete apps — front to back! Become a full stack developer with React, Node.js, and databases.', 'Full stack development is the most in-demand skill in the job market. This comprehensive 8-month course takes Class 11–12 students from frontend (React) to backend (Node.js) to database (MongoDB).', 'Advanced', 8, 14999.00, '🚀', 'Career Ready', 'new', '2026-09-01', true);

-- Insert sample syllabus for Java Basics
INSERT INTO course_syllabus (course_id, month_number, title, topics) 
SELECT id, 1, 'Getting Started with Java', ARRAY['What is programming?', 'Setting up Java environment', 'Your first "Hello World" program', 'Variables and data types', 'Arithmetic operators']
FROM courses WHERE slug = 'java-basics';

INSERT INTO course_syllabus (course_id, month_number, title, topics) 
SELECT id, 2, 'Control Flow', ARRAY['If-else conditions', 'Nested conditions', 'Switch statements', 'Simple calculator project', 'Debugging basics']
FROM courses WHERE slug = 'java-basics';

INSERT INTO course_syllabus (course_id, month_number, title, topics) 
SELECT id, 3, 'Loops & Repetition', ARRAY['For loops', 'While loops', 'Do-while loops', 'Number patterns', 'Mini game: Number guessing game']
FROM courses WHERE slug = 'java-basics';

INSERT INTO course_syllabus (course_id, month_number, title, topics) 
SELECT id, 4, 'Functions & Mini Projects', ARRAY['Introduction to methods/functions', 'Parameters and return values', 'Arrays basics', 'Final project: Simple quiz game', 'Course certificate']
FROM courses WHERE slug = 'java-basics';

-- Insert sample FAQs for Java Basics
INSERT INTO course_faqs (course_id, question, answer, display_order)
SELECT id, 'Does my child need a laptop?', 'Yes, any basic laptop or desktop with 4GB RAM is sufficient. We will guide you in setting up the Java environment.', 1
FROM courses WHERE slug = 'java-basics';

INSERT INTO course_faqs (course_id, question, answer, display_order)
SELECT id, 'Are classes live or recorded?', 'All classes are 100% live with a real mentor. No boring recorded videos!', 2
FROM courses WHERE slug = 'java-basics';

INSERT INTO course_faqs (course_id, question, answer, display_order)
SELECT id, 'What if my child misses a class?', 'No worries! We provide a recording of every class and free makeup sessions.', 3
FROM courses WHERE slug = 'java-basics';

-- Update enrollments table to reference courses table
ALTER TABLE enrollments 
ADD COLUMN IF NOT EXISTS course_id UUID REFERENCES courses(id) ON DELETE SET NULL;

-- Create index on course_id in enrollments
CREATE INDEX IF NOT EXISTS idx_enrollments_course_id ON enrollments(course_id);

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_course_syllabus_updated_at BEFORE UPDATE ON course_syllabus
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_course_faqs_updated_at BEFORE UPDATE ON course_faqs
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
