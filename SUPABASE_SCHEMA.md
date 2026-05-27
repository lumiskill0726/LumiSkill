# Supabase Database Schema

## Setup Instructions

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Run the following SQL commands to create the required tables

## Tables

### 1. visitors
Stores data of visitors who fill the initial overlay form

```sql
CREATE TABLE visitors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_agent TEXT,
  ip_address VARCHAR(45)
);

-- Create index for faster queries
CREATE INDEX idx_visitors_email ON visitors(email);
CREATE INDEX idx_visitors_created_at ON visitors(created_at DESC);
```

### 2. form_submissions
Stores all form submissions from contact forms, course enrollments, etc.

```sql
CREATE TABLE form_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  form_type VARCHAR(50) NOT NULL, -- 'contact', 'enrollment', 'demo', etc.
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  message TEXT,
  course_name VARCHAR(255),
  student_class VARCHAR(50),
  parent_name VARCHAR(255),
  additional_data JSONB, -- For any extra fields
  status VARCHAR(50) DEFAULT 'new', -- 'new', 'contacted', 'converted', 'closed'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_form_submissions_email ON form_submissions(email);
CREATE INDEX idx_form_submissions_status ON form_submissions(status);
CREATE INDEX idx_form_submissions_created_at ON form_submissions(created_at DESC);
CREATE INDEX idx_form_submissions_form_type ON form_submissions(form_type);
```

### 3. push_subscriptions
Stores push notification subscriptions

```sql
CREATE TABLE push_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  endpoint TEXT NOT NULL UNIQUE,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index
CREATE INDEX idx_push_subscriptions_created_at ON push_subscriptions(created_at DESC);
```

### 4. admin_users
Stores admin user credentials

```sql
CREATE TABLE admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'admin',
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index
CREATE INDEX idx_admin_users_email ON admin_users(email);
```

## Row Level Security (RLS)

Enable RLS for security:

```sql
-- Enable RLS on all tables
ALTER TABLE visitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE form_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Allow public insert for visitors (from website)
CREATE POLICY "Allow public insert visitors" ON visitors
  FOR INSERT TO anon
  WITH CHECK (true);

-- Allow public insert for form_submissions (from website)
CREATE POLICY "Allow public insert form_submissions" ON form_submissions
  FOR INSERT TO anon
  WITH CHECK (true);

-- Allow public insert for push_subscriptions (from website)
CREATE POLICY "Allow public insert push_subscriptions" ON push_subscriptions
  FOR INSERT TO anon
  WITH CHECK (true);

-- Admin users can only be managed via service role
CREATE POLICY "Service role only for admin_users" ON admin_users
  USING (auth.role() = 'service_role');
```

## Initial Admin User

After creating the tables, you'll need to create an initial admin user. Use the admin setup API route or run this SQL with a bcrypt-hashed password:

```sql
INSERT INTO admin_users (email, password_hash, name, role)
VALUES ('admin@lumiskill.com', 'your_bcrypt_hashed_password_here', 'Admin User', 'admin');
```

## Environment Variables Required

Add these to your `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

You can find these values in your Supabase project settings under API.
