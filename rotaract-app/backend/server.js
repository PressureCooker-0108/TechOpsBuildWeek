import express from 'express';
import cors from 'cors';
import pool from './db.js';

const app = express();
const PORT = Number(process.env.PORT || 3000);
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'rotaract-admin';
const CORS_ORIGIN = process.env.CORS_ORIGIN || '';

const baseMembers = [
  ['Aarav Mehta', 'Club President', 'Leadership', '2024-25', 'https://linkedin.com/in/aarav-mehta', 'aarav.mehta@rotaract.org', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400'],
  ['Riya Sharma', 'Vice President', 'Leadership', '2024-25', 'https://linkedin.com/in/riya-sharma', 'riya.sharma@rotaract.org', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400'],
  ['Karan Patel', 'Secretary', 'Administration', '2024-25', 'https://linkedin.com/in/karan-patel', 'karan.patel@rotaract.org', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400'],
  ['Sneha Rao', 'Treasurer', 'Finance', '2024-25', 'https://linkedin.com/in/sneha-rao', 'sneha.rao@rotaract.org', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400'],
  ['Ishaan Verma', 'Public Relations Lead', 'PR', '2024-25', 'https://linkedin.com/in/ishaan-verma', 'ishaan.verma@rotaract.org', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400'],
  ['Diya Nair', 'Community Service Head', 'Community Service', '2024-25', 'https://linkedin.com/in/diya-nair', 'diya.nair@rotaract.org', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400'],
  ['Rahul Kapoor', 'Membership Coordinator', 'Membership', '2023-24', 'https://linkedin.com/in/rahul-kapoor', 'rahul.kapoor@rotaract.org', 'https://images.unsplash.com/photo-1504593811423-6dd665756598?w=400'],
  ['Ananya Iyer', 'Event Manager', 'Events', '2023-24', 'https://linkedin.com/in/ananya-iyer', 'ananya.iyer@rotaract.org', 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400'],
  ['Vikram Singh', 'Digital Media Lead', 'Media', '2023-24', 'https://linkedin.com/in/vikram-singh', 'vikram.singh@rotaract.org', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400'],
  ['Meera Joshi', 'Professional Development Chair', 'Professional Development', '2024-25', 'https://linkedin.com/in/meera-joshi', 'meera.joshi@rotaract.org', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400'],
  ['Kabir Sood', 'Projects Lead', 'Projects', '2024-25', 'https://linkedin.com/in/kabir-sood', 'kabir.sood@rotaract.org', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400'],
  ['Priya Menon', 'Design Lead', 'Creative', '2024-25', 'https://linkedin.com/in/priya-menon', 'priya.menon@rotaract.org', 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400'],
  ['Arjun Das', 'Technical Coordinator', 'Technology', '2023-24', 'https://linkedin.com/in/arjun-das', 'arjun.das@rotaract.org', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400'],
  ['Nisha Bhat', 'Social Media Manager', 'Media', '2023-24', 'https://linkedin.com/in/nisha-bhat', 'nisha.bhat@rotaract.org', 'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?w=400'],
  ['Dev Malhotra', 'Fundraising Lead', 'Finance', '2024-25', 'https://linkedin.com/in/dev-malhotra', 'dev.malhotra@rotaract.org', 'https://images.unsplash.com/photo-1504593811423-6dd665756598?w=400'],
  ['Tanya Kulkarni', 'Community Outreach Lead', 'Community Service', '2024-25', 'https://linkedin.com/in/tanya-kulkarni', 'tanya.kulkarni@rotaract.org', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400'],
  ['Rohit Jain', 'Logistics Coordinator', 'Operations', '2023-24', 'https://linkedin.com/in/rohit-jain', 'rohit.jain@rotaract.org', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400'],
  ['Pooja Sen', 'Alumni Relations Lead', 'Relations', '2024-25', 'https://linkedin.com/in/pooja-sen', 'pooja.sen@rotaract.org', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400'],
  ['Siddharth Rao', 'Program Coordinator', 'Programs', '2024-25', 'https://linkedin.com/in/siddharth-rao', 'siddharth.rao@rotaract.org', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400'],
  ['Anika Dutta', 'Public Image Coordinator', 'PR', '2023-24', 'https://linkedin.com/in/anika-dutta', 'anika.dutta@rotaract.org', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400'],
  ['Farhan Sheikh', 'International Service Lead', 'International Service', '2024-25', 'https://linkedin.com/in/farhan-sheikh', 'farhan.sheikh@rotaract.org', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400'],
  ['Lavanya Iyer', 'Content Strategist', 'Creative', '2024-25', 'https://linkedin.com/in/lavanya-iyer', 'lavanya.iyer@rotaract.org', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400'],
  ['Aditya Rao', 'Club Mentor', 'Leadership', '2023-24', 'https://linkedin.com/in/aditya-rao', 'aditya.rao@rotaract.org', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400'],
  ['Simran Kaur', 'Volunteer Coordinator', 'Membership', '2024-25', 'https://linkedin.com/in/simran-kaur', 'simran.kaur@rotaract.org', 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400'],
  ['Naveen Prasad', 'Data Analyst', 'Technology', '2024-25', 'https://linkedin.com/in/naveen-prasad', 'naveen.prasad@rotaract.org', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400'],
  ['Kriti Shah', 'Workshop Coordinator', 'Events', '2023-24', 'https://linkedin.com/in/kriti-shah', 'kriti.shah@rotaract.org', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400'],
  ['Yash Anand', 'Partnerships Lead', 'Relations', '2024-25', 'https://linkedin.com/in/yash-anand', 'yash.anand@rotaract.org', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400'],
  ['Aditi Nambiar', 'Wellness Coordinator', 'Member Care', '2024-25', 'https://linkedin.com/in/aditi-nambiar', 'aditi.nambiar@rotaract.org', 'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?w=400'],
  ['Harsh Vohra', 'Club Secretary Assistant', 'Administration', '2023-24', 'https://linkedin.com/in/harsh-vohra', 'harsh.vohra@rotaract.org', 'https://images.unsplash.com/photo-1504593811423-6dd665756598?w=400']
];

const quoteBank = [
  'Small, steady actions create the biggest community impact.',
  'Service is strongest when it is consistent and collaborative.',
  'Good leadership listens first and acts with purpose.',
  'Impact grows when ideas are shared freely and executed well.',
  'Behind every successful event is a team that trusted one another.',
  'Professional growth and service can move forward together.',
  'Meaningful work is built with empathy, discipline, and joy.',
  'The best clubs turn good intentions into reliable habits.'
];

const skillsBank = [
  ['Leadership', 'Planning', 'Public Speaking'],
  ['Strategy', 'Teamwork', 'Communication'],
  ['Operations', 'Coordination', 'Decision Making'],
  ['Finance', 'Analytics', 'Organization'],
  ['Media', 'Design', 'Content Writing'],
  ['Community Outreach', 'Empathy', 'Event Support'],
  ['Tech', 'Problem Solving', 'Documentation'],
  ['Networking', 'Partnerships', 'Presentation']
];

const workBank = [
  'Leads the club vision, keeps the board aligned, and supports every major initiative.',
  'Helps coordinate board tasks, supports planning, and keeps communication flowing.',
  'Manages club administration, documentation, and internal coordination.',
  'Tracks finances, supports budgeting, and keeps project spending transparent.',
  'Builds awareness through social content, branding, and outreach campaigns.',
  'Coordinates community service projects, volunteer efforts, and local partnerships.',
  'Supports programs, event operations, and member engagement activities.',
  'Helps with design, digital media, and creative presentations for the club.'
];

const seedRows = baseMembers.map((member, index) => ({
  name: member[0],
  role: member[1],
  department: member[2],
  board: member[3],
  linkedin: member[4],
  email: member[5],
  avatar: member[6],
  quote: quoteBank[index % quoteBank.length],
  skills: skillsBank[index % skillsBank.length],
  work: workBank[index % workBank.length]
}));

let usingDatabase = false;
let localMembers = seedRows.map((member, index) => ({
  id: index + 1,
  ...member
}));
let nextLocalId = localMembers.length + 1;

app.use(cors(CORS_ORIGIN ? { origin: CORS_ORIGIN } : undefined));
app.use(express.json());

function requireAdmin(req, res, next) {
  const incomingPassword = req.headers['x-admin-password'];

  if (incomingPassword !== ADMIN_PASSWORD) {
    return res.status(401).json({ message: 'Unauthorized. Invalid admin password.' });
  }

  return next();
}

async function tryQuery(query, values = []) {
  return pool.query(query, values);
}

async function ensureMembersTable() {
  await tryQuery(`
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
      work TEXT
    )
  `);

  await tryQuery('ALTER TABLE members ADD COLUMN IF NOT EXISTS quote TEXT');
  await tryQuery('ALTER TABLE members ADD COLUMN IF NOT EXISTS skills TEXT[]');
  await tryQuery('ALTER TABLE members ADD COLUMN IF NOT EXISTS work TEXT');
}

async function seedMembersIfEmpty() {
  const { rows } = await tryQuery('SELECT COUNT(*)::int AS count FROM members');
  if (rows[0].count > 0) {
    return;
  }

  for (const member of seedRows) {
    await tryQuery(
      `
        INSERT INTO members (name, role, department, board, linkedin, email, avatar, quote, skills, work)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      `,
      [member.name, member.role, member.department, member.board, member.linkedin, member.email, member.avatar, member.quote, member.skills, member.work]
    );
  }
}

async function initializeDatabase() {
  await ensureMembersTable();
  await seedMembersIfEmpty();
  usingDatabase = true;
}

function matchMember(member, filters) {
  const { q = '', board = '', department = '', role = '' } = filters;
  const search = q.trim().toLowerCase();
  const fields = [member.name, member.role, member.department, member.board].join(' ').toLowerCase();

  const matchesSearch = !search || fields.includes(search);
  const matchesBoard = !board || member.board === board;
  const matchesDepartment = !department || member.department === department;
  const matchesRole = !role || member.role === role;

  return matchesSearch && matchesBoard && matchesDepartment && matchesRole;
}

function normalizeSkills(value) {
  if (Array.isArray(value)) {
    return value.map(skill => String(skill).trim()).filter(Boolean);
  }

  if (typeof value === 'string' && value.trim()) {
    return value
      .split(',')
      .map(skill => skill.trim())
      .filter(Boolean);
  }

  return [];
}

function normalizeMemberPayload(body) {
  return {
    name: String(body.name || '').trim(),
    role: String(body.role || '').trim(),
    department: String(body.department || '').trim(),
    board: String(body.board || '').trim() || null,
    linkedin: String(body.linkedin || '').trim() || null,
    email: String(body.email || '').trim() || null,
    avatar: String(body.avatar || '').trim() || null,
    quote: String(body.quote || '').trim() || null,
    skills: normalizeSkills(body.skills),
    work: String(body.work || '').trim() || null
  };
}

function filterLocalMembers(filters) {
  return localMembers.filter(member => matchMember(member, filters)).sort((a, b) => a.id - b.id);
}

async function getMembers(filters = {}) {
  if (!usingDatabase) {
    return filterLocalMembers(filters);
  }

  const { q = '', board = '', department = '', role = '' } = filters;
  const values = [];
  let query = 'SELECT * FROM members WHERE 1=1';

  if (q.trim()) {
    values.push(`%${q.trim()}%`);
    query += ` AND (name ILIKE $${values.length} OR role ILIKE $${values.length} OR department ILIKE $${values.length} OR board ILIKE $${values.length})`;
  }

  if (board) {
    values.push(board);
    query += ` AND board = $${values.length}`;
  }

  if (department) {
    values.push(department);
    query += ` AND department = $${values.length}`;
  }

  if (role) {
    values.push(role);
    query += ` AND role = $${values.length}`;
  }

  query += ' ORDER BY id ASC';
  const result = await tryQuery(query, values);
  return result.rows;
}

async function addMember(payload) {
  if (!usingDatabase) {
    const member = { id: nextLocalId++, ...payload };
    localMembers.push(member);
    return member;
  }

  const result = await tryQuery(
    `
      INSERT INTO members (name, role, department, board, linkedin, email, avatar, quote, skills, work)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `,
    [payload.name, payload.role, payload.department, payload.board || null, payload.linkedin || null, payload.email || null, payload.avatar || null, payload.quote || null, payload.skills || null, payload.work || null]
  );
  return result.rows[0];
}

async function updateMember(id, payload) {
  if (!usingDatabase) {
    const index = localMembers.findIndex(member => member.id === id);
    if (index === -1) return null;

    localMembers[index] = { id, ...payload };
    return localMembers[index];
  }

  const result = await tryQuery(
    `
      UPDATE members
      SET name = $1, role = $2, department = $3, board = $4, linkedin = $5, email = $6, avatar = $7, quote = $8, skills = $9, work = $10
      WHERE id = $11
      RETURNING *
    `,
    [payload.name, payload.role, payload.department, payload.board || null, payload.linkedin || null, payload.email || null, payload.avatar || null, payload.quote || null, payload.skills || null, payload.work || null, id]
  );
  return result.rows[0] || null;
}

async function deleteMember(id) {
  if (!usingDatabase) {
    const index = localMembers.findIndex(member => member.id === id);
    if (index === -1) return false;
    localMembers.splice(index, 1);
    return true;
  }

  const result = await tryQuery('DELETE FROM members WHERE id = $1 RETURNING *', [id]);
  return result.rows.length > 0;
}

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'rotaract-api', storage: usingDatabase ? 'postgresql' : 'memory' });
});

app.post('/admin/verify', (req, res) => {
  const incomingPassword = req.headers['x-admin-password'] || req.body?.password;

  if (incomingPassword !== ADMIN_PASSWORD) {
    return res.status(401).json({ message: 'Invalid admin password.' });
  }

  return res.json({ ok: true });
});

app.get('/members', async (req, res) => {
  try {
    res.json(await getMembers(req.query));
  } catch (error) {
    console.error('Error fetching members:', error);
    res.status(500).json({ message: 'Failed to fetch members.' });
  }
});

app.get('/members/search', async (req, res) => {
  try {
    res.json(await getMembers(req.query));
  } catch (error) {
    console.error('Error searching members:', error);
    res.status(500).json({ message: 'Failed to search members.' });
  }
});

app.post('/members', requireAdmin, async (req, res) => {
  try {
    const payload = normalizeMemberPayload(req.body);

    if (!payload.name || !payload.role || !payload.department) {
      return res.status(400).json({ message: 'Name, role, and department are required.' });
    }

    const member = await addMember(payload);

    res.status(201).json(member);
  } catch (error) {
    console.error('Error adding member:', error);
    res.status(500).json({ message: 'Failed to add member.' });
  }
});

app.put('/members/:id', requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ message: 'Invalid member ID.' });
    }

    const payload = normalizeMemberPayload(req.body);

    if (!payload.name || !payload.role || !payload.department) {
      return res.status(400).json({ message: 'Name, role, and department are required.' });
    }

    const member = await updateMember(id, payload);

    if (!member) {
      return res.status(404).json({ message: 'Member not found.' });
    }

    res.json(member);
  } catch (error) {
    console.error('Error updating member:', error);
    res.status(500).json({ message: 'Failed to update member.' });
  }
});

app.delete('/members/:id', requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ message: 'Invalid member ID.' });
    }

    const deleted = await deleteMember(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Member not found.' });
    }

    res.json({ message: 'Member deleted successfully.' });
  } catch (error) {
    console.error('Error deleting member:', error);
    res.status(500).json({ message: 'Failed to delete member.' });
  }
});

async function startServer() {
  try {
    try {
      await initializeDatabase();
      console.log('PostgreSQL connected. Using database-backed storage.');
    } catch (dbError) {
      usingDatabase = false;
      console.warn('PostgreSQL unavailable. Falling back to in-memory data so the app stays usable.');
      console.warn(dbError.message);
    }

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

