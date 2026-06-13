-- Create batches table for better batch management
CREATE TABLE IF NOT EXISTS batches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  course_slug TEXT NOT NULL,
  batch_name TEXT NOT NULL,
  batch_code TEXT UNIQUE NOT NULL, -- e.g., "JB-JUN-2026"
  start_date DATE NOT NULL,
  end_date DATE,
  status TEXT DEFAULT 'active', -- 'active', 'completed', 'upcoming'
  max_students INTEGER DEFAULT 30,
  current_students INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create batch_students table (many-to-many relationship)
CREATE TABLE IF NOT EXISTS batch_students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_id UUID REFERENCES batches(id) ON DELETE CASCADE,
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  enrollment_id UUID REFERENCES enrollments(id) ON DELETE CASCADE,
  joined_date TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'active', -- 'active', 'dropped', 'completed'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(batch_id, student_id)
);

-- Create batch_syllabus_progress table (centralized syllabus tracking for batch)
CREATE TABLE IF NOT EXISTS batch_syllabus_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_id UUID REFERENCES batches(id) ON DELETE CASCADE,
  month_number INTEGER NOT NULL,
  month_title TEXT NOT NULL,
  topics JSONB NOT NULL, -- [{"topic": "Variables", "completed": true, "completed_date": "2026-06-04"}]
  total_topics INTEGER NOT NULL,
  completed_topics INTEGER DEFAULT 0,
  completion_percentage INTEGER DEFAULT 0,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'not_started', -- 'not_started', 'in_progress', 'completed'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(batch_id, month_number)
);

-- Create indexes
CREATE INDEX idx_batches_course_id ON batches(course_id);
CREATE INDEX idx_batches_course_slug ON batches(course_slug);
CREATE INDEX idx_batches_status ON batches(status);
CREATE INDEX idx_batch_students_batch_id ON batch_students(batch_id);
CREATE INDEX idx_batch_students_student_id ON batch_students(student_id);
CREATE INDEX idx_batch_syllabus_batch_id ON batch_syllabus_progress(batch_id);

-- Create trigger to update updated_at
CREATE OR REPLACE FUNCTION update_batches_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_batches_updated_at_trigger
  BEFORE UPDATE ON batches
  FOR EACH ROW
  EXECUTE FUNCTION update_batches_updated_at();

CREATE TRIGGER update_batch_syllabus_updated_at_trigger
  BEFORE UPDATE ON batch_syllabus_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE batch_students ENABLE ROW LEVEL SECURITY;
ALTER TABLE batch_syllabus_progress ENABLE ROW LEVEL SECURITY;

-- RLS Policies for batches (admin only)
CREATE POLICY "Admins can manage batches" ON batches
  FOR ALL USING (true);

-- RLS Policies for batch_students
CREATE POLICY "Admins can manage batch students" ON batch_students
  FOR ALL USING (true);

CREATE POLICY "Students can view their batch" ON batch_students
  FOR SELECT USING (auth.uid()::text = student_id::text);

-- RLS Policies for batch_syllabus_progress
CREATE POLICY "Admins can manage batch syllabus" ON batch_syllabus_progress
  FOR ALL USING (true);

CREATE POLICY "Students can view their batch syllabus" ON batch_syllabus_progress
  FOR SELECT USING (
    batch_id IN (
      SELECT batch_id FROM batch_students WHERE student_id::text = auth.uid()::text
    )
  );
