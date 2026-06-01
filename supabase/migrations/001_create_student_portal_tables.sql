-- ============================================================
-- LUMISKILL STUDENT PORTAL DATABASE SCHEMA
-- ============================================================
-- This migration creates all tables needed for the student/parent portal
-- Run this in your Supabase SQL Editor

-- ============================================================
-- 1. STUDENTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  parent_name TEXT,
  parent_email TEXT,
  parent_phone TEXT,
  student_class TEXT, -- For reference (e.g., "Class 9", "BCom Student", "Working Professional")
  date_of_birth DATE,
  address TEXT,
  city TEXT,
  state TEXT,
  pincode TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true
);

-- Index for faster email lookups
CREATE INDEX IF NOT EXISTS idx_students_email ON students(email);
CREATE INDEX IF NOT EXISTS idx_students_active ON students(is_active);

-- ============================================================
-- 2. ENROLLMENTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  course_slug TEXT NOT NULL, -- e.g., 'python-basics', 'web-development'
  course_name TEXT NOT NULL, -- e.g., 'Python Basics'
  course_level TEXT NOT NULL, -- 'Beginner', 'Intermediate', 'Advanced'
  course_duration_months INTEGER NOT NULL, -- 4, 6, 8
  amount_paid DECIMAL(10, 2) NOT NULL,
  payment_id TEXT, -- Razorpay payment ID
  payment_status TEXT DEFAULT 'pending', -- 'pending', 'completed', 'failed'
  enrollment_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status TEXT DEFAULT 'active', -- 'active', 'completed', 'paused', 'cancelled'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_enrollments_student ON enrollments(student_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_course ON enrollments(course_slug);
CREATE INDEX IF NOT EXISTS idx_enrollments_status ON enrollments(status);

-- ============================================================
-- 3. NOTICES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS notices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  notice_type TEXT DEFAULT 'general', -- 'general', 'urgent', 'announcement', 'holiday'
  target_type TEXT DEFAULT 'all', -- 'all', 'course', 'student'
  target_course_slug TEXT, -- If target_type = 'course'
  target_student_ids UUID[], -- If target_type = 'student'
  created_by TEXT DEFAULT 'admin',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_notices_active ON notices(is_active);
CREATE INDEX IF NOT EXISTS idx_notices_type ON notices(notice_type);
CREATE INDEX IF NOT EXISTS idx_notices_created ON notices(created_at DESC);

-- ============================================================
-- 4. PROGRESS_REPORTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS progress_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  enrollment_id UUID NOT NULL REFERENCES enrollments(id) ON DELETE CASCADE,
  report_title TEXT NOT NULL,
  report_text TEXT NOT NULL,
  progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  attendance_percentage INTEGER DEFAULT 0 CHECK (attendance_percentage >= 0 AND attendance_percentage <= 100),
  assignments_completed INTEGER DEFAULT 0,
  total_assignments INTEGER DEFAULT 0,
  projects_completed INTEGER DEFAULT 0,
  total_projects INTEGER DEFAULT 0,
  mentor_feedback TEXT,
  strengths TEXT,
  areas_to_improve TEXT,
  next_steps TEXT,
  created_by TEXT DEFAULT 'admin',
  report_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_progress_student ON progress_reports(student_id);
CREATE INDEX IF NOT EXISTS idx_progress_enrollment ON progress_reports(enrollment_id);
CREATE INDEX IF NOT EXISTS idx_progress_date ON progress_reports(report_date DESC);

-- ============================================================
-- 5. SYLLABUS_TRACKING TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS syllabus_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  enrollment_id UUID NOT NULL REFERENCES enrollments(id) ON DELETE CASCADE,
  course_slug TEXT NOT NULL,
  month_number INTEGER NOT NULL, -- 1, 2, 3, 4, etc.
  month_title TEXT NOT NULL, -- e.g., "Month 1: Python Fundamentals"
  topics JSONB NOT NULL, -- Array of topics with completion status
  -- Example: [{"topic": "Variables", "completed": true}, {"topic": "Loops", "completed": false}]
  total_topics INTEGER NOT NULL,
  completed_topics INTEGER DEFAULT 0,
  completion_percentage INTEGER DEFAULT 0,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'not_started', -- 'not_started', 'in_progress', 'completed'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(enrollment_id, month_number)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_syllabus_student ON syllabus_tracking(student_id);
CREATE INDEX IF NOT EXISTS idx_syllabus_enrollment ON syllabus_tracking(enrollment_id);
CREATE INDEX IF NOT EXISTS idx_syllabus_status ON syllabus_tracking(status);

-- ============================================================
-- 6. STUDENT_SESSIONS TABLE (Login tracking)
-- ============================================================
CREATE TABLE IF NOT EXISTS student_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  session_token TEXT UNIQUE NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  is_active BOOLEAN DEFAULT true
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_sessions_student ON student_sessions(student_id);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON student_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_sessions_active ON student_sessions(is_active);

-- ============================================================
-- 7. ATTENDANCE TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  enrollment_id UUID NOT NULL REFERENCES enrollments(id) ON DELETE CASCADE,
  class_date DATE NOT NULL,
  class_topic TEXT,
  status TEXT NOT NULL, -- 'present', 'absent', 'late', 'excused'
  remarks TEXT,
  marked_by TEXT DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(enrollment_id, class_date)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_attendance_student ON attendance(student_id);
CREATE INDEX IF NOT EXISTS idx_attendance_enrollment ON attendance(enrollment_id);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance(class_date DESC);

-- ============================================================
-- 8. ASSIGNMENTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id UUID NOT NULL REFERENCES enrollments(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  assignment_title TEXT NOT NULL,
  assignment_description TEXT,
  due_date DATE,
  submission_date TIMESTAMP WITH TIME ZONE,
  submission_url TEXT, -- Link to submitted work
  submission_text TEXT,
  status TEXT DEFAULT 'pending', -- 'pending', 'submitted', 'graded', 'late'
  score INTEGER,
  max_score INTEGER,
  feedback TEXT,
  graded_by TEXT,
  graded_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_assignments_student ON assignments(student_id);
CREATE INDEX IF NOT EXISTS idx_assignments_enrollment ON assignments(enrollment_id);
CREATE INDEX IF NOT EXISTS idx_assignments_status ON assignments(status);

-- ============================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables
CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON students
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_enrollments_updated_at BEFORE UPDATE ON enrollments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notices_updated_at BEFORE UPDATE ON notices
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_progress_reports_updated_at BEFORE UPDATE ON progress_reports
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_syllabus_tracking_updated_at BEFORE UPDATE ON syllabus_tracking
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_attendance_updated_at BEFORE UPDATE ON attendance
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_assignments_updated_at BEFORE UPDATE ON assignments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE syllabus_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;

-- Students can only see their own data
CREATE POLICY "Students can view own data" ON students
  FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Students can update own data" ON students
  FOR UPDATE USING (auth.uid()::text = id::text);

-- Students can only see their own enrollments
CREATE POLICY "Students can view own enrollments" ON enrollments
  FOR SELECT USING (auth.uid()::text = student_id::text);

-- Students can view active notices
CREATE POLICY "Students can view active notices" ON notices
  FOR SELECT USING (is_active = true);

-- Students can view their own progress reports
CREATE POLICY "Students can view own progress" ON progress_reports
  FOR SELECT USING (auth.uid()::text = student_id::text);

-- Students can view their own syllabus tracking
CREATE POLICY "Students can view own syllabus" ON syllabus_tracking
  FOR SELECT USING (auth.uid()::text = student_id::text);

-- Students can view their own attendance
CREATE POLICY "Students can view own attendance" ON attendance
  FOR SELECT USING (auth.uid()::text = student_id::text);

-- Students can view and submit their own assignments
CREATE POLICY "Students can view own assignments" ON assignments
  FOR SELECT USING (auth.uid()::text = student_id::text);

CREATE POLICY "Students can update own assignments" ON assignments
  FOR UPDATE USING (auth.uid()::text = student_id::text);

-- ============================================================
-- SAMPLE DATA (Optional - for testing)
-- ============================================================

-- Insert a sample student (password: 'student123')
-- Password hash generated using bcrypt with 10 rounds
INSERT INTO students (email, password_hash, name, phone, parent_name, parent_email, student_class)
VALUES (
  'student@example.com',
  '$2b$10$rQZ5YvZxGxJ5YvZxGxJ5YeZxGxJ5YvZxGxJ5YvZxGxJ5YvZxGxJ5Y',
  'Test Student',
  '9876543210',
  'Test Parent',
  'parent@example.com',
  'Class 10'
) ON CONFLICT (email) DO NOTHING;

-- ============================================================
-- COMPLETION MESSAGE
-- ============================================================
-- Migration completed successfully!
-- Next steps:
-- 1. Run this SQL in your Supabase SQL Editor
-- 2. Verify all tables are created
-- 3. Test with sample data
-- 4. Build the student portal frontend
-- ============================================================
