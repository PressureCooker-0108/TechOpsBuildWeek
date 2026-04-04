-- Create database (run this command in psql first):
-- CREATE DATABASE rotaract_db;

CREATE TABLE IF NOT EXISTS members (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  department TEXT NOT NULL,
  board TEXT,
  linkedin TEXT,
  email TEXT,
  avatar TEXT,
  quote TEXT,
  skills TEXT[],
  work TEXT,
  intro TEXT,
  achievements TEXT
);

ALTER TABLE members ADD COLUMN IF NOT EXISTS quote TEXT;
ALTER TABLE members ADD COLUMN IF NOT EXISTS skills TEXT[];
ALTER TABLE members ADD COLUMN IF NOT EXISTS work TEXT;
ALTER TABLE members ADD COLUMN IF NOT EXISTS intro TEXT;
ALTER TABLE members ADD COLUMN IF NOT EXISTS achievements TEXT;

DO $$
DECLARE
  names text[] := ARRAY[
    'Aarav Mehta', 'Riya Sharma', 'Karan Patel', 'Sneha Rao', 'Ishaan Verma', 'Diya Nair',
    'Rahul Kapoor', 'Ananya Iyer', 'Vikram Singh', 'Meera Joshi', 'Kabir Sood', 'Priya Menon',
    'Arjun Das', 'Nisha Bhat', 'Dev Malhotra', 'Tanya Kulkarni', 'Rohit Jain', 'Pooja Sen',
    'Siddharth Rao', 'Anika Dutta', 'Farhan Sheikh', 'Lavanya Iyer', 'Aditya Rao', 'Simran Kaur',
    'Naveen Prasad', 'Kriti Shah', 'Yash Anand', 'Aditi Nambiar', 'Harsh Vohra'
  ];
  roles text[] := ARRAY[
    'Club President', 'Vice President', 'Secretary', 'Treasurer', 'Public Relations Lead', 'Community Service Head',
    'Membership Coordinator', 'Event Manager', 'Digital Media Lead', 'Professional Development Chair', 'Projects Lead', 'Design Lead',
    'Technical Coordinator', 'Social Media Manager', 'Fundraising Lead', 'Community Outreach Lead', 'Logistics Coordinator', 'Alumni Relations Lead',
    'Program Coordinator', 'Public Image Coordinator', 'International Service Lead', 'Content Strategist', 'Club Mentor', 'Volunteer Coordinator',
    'Data Analyst', 'Workshop Coordinator', 'Partnerships Lead', 'Wellness Coordinator', 'Club Secretary Assistant'
  ];
  departments text[] := ARRAY[
    'Leadership', 'Leadership', 'Administration', 'Finance', 'PR', 'Community Service',
    'Membership', 'Events', 'Media', 'Professional Development', 'Projects', 'Creative',
    'Technology', 'Media', 'Finance', 'Community Service', 'Operations', 'Relations',
    'Programs', 'PR', 'International Service', 'Creative', 'Leadership', 'Membership',
    'Technology', 'Events', 'Relations', 'Member Care', 'Administration'
  ];
  boards text[] := ARRAY[
    '2024-25', '2024-25', '2024-25', '2024-25', '2024-25', '2024-25',
    '2023-24', '2023-24', '2023-24', '2024-25', '2024-25', '2024-25',
    '2023-24', '2023-24', '2024-25', '2024-25', '2023-24', '2024-25',
    '2024-25', '2023-24', '2024-25', '2024-25', '2023-24', '2024-25',
    '2024-25', '2023-24', '2024-25', '2024-25', '2023-24'
  ];
  linkedins text[] := ARRAY[
    'https://linkedin.com/in/aarav-mehta', 'https://linkedin.com/in/riya-sharma', 'https://linkedin.com/in/karan-patel', 'https://linkedin.com/in/sneha-rao', 'https://linkedin.com/in/ishaan-verma', 'https://linkedin.com/in/diya-nair',
    'https://linkedin.com/in/rahul-kapoor', 'https://linkedin.com/in/ananya-iyer', 'https://linkedin.com/in/vikram-singh', 'https://linkedin.com/in/meera-joshi', 'https://linkedin.com/in/kabir-sood', 'https://linkedin.com/in/priya-menon',
    'https://linkedin.com/in/arjun-das', 'https://linkedin.com/in/nisha-bhat', 'https://linkedin.com/in/dev-malhotra', 'https://linkedin.com/in/tanya-kulkarni', 'https://linkedin.com/in/rohit-jain', 'https://linkedin.com/in/pooja-sen',
    'https://linkedin.com/in/siddharth-rao', 'https://linkedin.com/in/anika-dutta', 'https://linkedin.com/in/farhan-sheikh', 'https://linkedin.com/in/lavanya-iyer', 'https://linkedin.com/in/aditya-rao', 'https://linkedin.com/in/simran-kaur',
    'https://linkedin.com/in/naveen-prasad', 'https://linkedin.com/in/kriti-shah', 'https://linkedin.com/in/yash-anand', 'https://linkedin.com/in/aditi-nambiar', 'https://linkedin.com/in/harsh-vohra'
  ];
  emails text[] := ARRAY[
    'aarav.mehta@rotaract.org', 'riya.sharma@rotaract.org', 'karan.patel@rotaract.org', 'sneha.rao@rotaract.org', 'ishaan.verma@rotaract.org', 'diya.nair@rotaract.org',
    'rahul.kapoor@rotaract.org', 'ananya.iyer@rotaract.org', 'vikram.singh@rotaract.org', 'meera.joshi@rotaract.org', 'kabir.sood@rotaract.org', 'priya.menon@rotaract.org',
    'arjun.das@rotaract.org', 'nisha.bhat@rotaract.org', 'dev.malhotra@rotaract.org', 'tanya.kulkarni@rotaract.org', 'rohit.jain@rotaract.org', 'pooja.sen@rotaract.org',
    'siddharth.rao@rotaract.org', 'anika.dutta@rotaract.org', 'farhan.sheikh@rotaract.org', 'lavanya.iyer@rotaract.org', 'aditya.rao@rotaract.org', 'simran.kaur@rotaract.org',
    'naveen.prasad@rotaract.org', 'kriti.shah@rotaract.org', 'yash.anand@rotaract.org', 'aditi.nambiar@rotaract.org', 'harsh.vohra@rotaract.org'
  ];
  avatars text[] := ARRAY[
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
    'https://images.unsplash.com/photo-1504593811423-6dd665756598?w=400', 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400', 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400',
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400', 'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?w=400', 'https://images.unsplash.com/photo-1504593811423-6dd665756598?w=400', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400', 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400', 'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?w=400', 'https://images.unsplash.com/photo-1504593811423-6dd665756598?w=400'
  ];
  quote_bank text[] := ARRAY[
    'Small, steady actions create the biggest community impact.',
    'Service is strongest when it is consistent and collaborative.',
    'Good leadership listens first and acts with purpose.',
    'Impact grows when ideas are shared freely and executed well.',
    'Behind every successful event is a team that trusted one another.',
    'Professional growth and service can move forward together.',
    'Meaningful work is built with empathy, discipline, and joy.',
    'The best clubs turn good intentions into reliable habits.'
  ];
  skills_bank text[][] := ARRAY[
    ARRAY['Leadership', 'Planning', 'Public Speaking']::text[],
    ARRAY['Strategy', 'Teamwork', 'Communication']::text[],
    ARRAY['Operations', 'Coordination', 'Decision Making']::text[],
    ARRAY['Finance', 'Analytics', 'Organization']::text[],
    ARRAY['Media', 'Design', 'Content Writing']::text[],
    ARRAY['Community Outreach', 'Empathy', 'Event Support']::text[],
    ARRAY['Tech', 'Problem Solving', 'Documentation']::text[],
    ARRAY['Networking', 'Partnerships', 'Presentation']::text[]
  ];
  work_bank text[] := ARRAY[
    'Leads the club vision, keeps the board aligned, and supports every major initiative.',
    'Helps coordinate board tasks, supports planning, and keeps communication flowing.',
    'Manages club administration, documentation, and internal coordination.',
    'Tracks finances, supports budgeting, and keeps project spending transparent.',
    'Builds awareness through social content, branding, and outreach campaigns.',
    'Coordinates community service projects, volunteer efforts, and local partnerships.',
    'Supports programs, event operations, and member engagement activities.',
    'Helps with design, digital media, and creative presentations for the club.'
  ];
  i int;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM members) THEN
    FOR i IN 1..array_length(names, 1) LOOP
      INSERT INTO members (name, role, department, board, linkedin, email, avatar, quote, skills, work, intro, achievements)
      VALUES (
        names[i],
        roles[i],
        departments[i],
        boards[i],
        linkedins[i],
        emails[i],
        avatars[i],
        quote_bank[((i - 1) % array_length(quote_bank, 1)) + 1],
        skills_bank[((i - 1) % array_length(skills_bank, 1)) + 1],
        work_bank[((i - 1) % array_length(work_bank, 1)) + 1],
        'I am ' || names[i] || ', serving as ' || roles[i] || ' in Rotaract and focused on consistent contribution.',
        'Contributed to key club initiatives and helped deliver member-focused activities throughout the term.'
      );
    END LOOP;
  END IF;
END $$;

