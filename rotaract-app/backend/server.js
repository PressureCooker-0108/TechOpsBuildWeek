import express from 'express';
import cors from 'cors';
import pool from './db.js';

const app = express();
const PORT = Number(process.env.PORT || 3000);
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'rotaract-admin';
const CORS_ORIGIN = process.env.CORS_ORIGIN || '';

const LEGACY_BOARD_LABELS = ['2023-24', '2024-25'];
const LEGACY_MEMBER_COUNT = 29;

const firstNames = [
  'Aarav', 'Riya', 'Karan', 'Sneha', 'Ishaan', 'Diya', 'Rahul', 'Ananya', 'Vikram', 'Meera',
  'Kabir', 'Priya', 'Arjun', 'Nisha', 'Dev', 'Tanya', 'Rohit', 'Pooja', 'Siddharth', 'Anika',
  'Farhan', 'Lavanya', 'Aditya', 'Simran', 'Naveen', 'Kriti', 'Yash', 'Aditi', 'Harsh', 'Neha',
  'Omkar', 'Sanya', 'Rudra', 'Mitali', 'Parth', 'Ira', 'Ayaan', 'Mrunal', 'Dhruv', 'Ishita',
  'Vedant', 'Samaira', 'Pranav', 'Tanvi', 'Raghav', 'Kiara', 'Manav', 'Palak', 'Viraj', 'Reyansh',
  'Nandini', 'Soham', 'Rashi', 'Atharv', 'Ishani', 'Darsh', 'Avni', 'Tushar', 'Esha', 'Ritwik'
];

const lastNames = [
  'Mehta', 'Sharma', 'Patel', 'Rao', 'Verma', 'Nair', 'Kapoor', 'Iyer', 'Singh', 'Joshi',
  'Sood', 'Menon', 'Das', 'Bhat', 'Malhotra', 'Kulkarni', 'Jain', 'Sen', 'Dutta', 'Sheikh',
  'Prasad', 'Shah', 'Anand', 'Nambiar', 'Vohra', 'Gokhale', 'Deshmukh', 'Chavan', 'Pawar', 'Kadam',
  'Pathak', 'Mishra', 'Agrawal', 'Naik', 'Gaikwad', 'Bendre', 'Rane', 'Mhatre', 'Sawant', 'Khot'
];

const personalityStyles = [
  'a calm systems-thinker who keeps people aligned during busy weeks',
  'an energetic organizer who turns rough ideas into polished execution plans',
  'a patient listener who builds trust before driving decisions',
  'a practical strategist who balances creativity with measurable outcomes',
  'a disciplined finisher who tracks details without losing the big picture',
  'a people-first communicator who keeps meetings focused and positive',
  'an optimistic planner who motivates teams through clear milestones',
  'a curious problem-solver who improves every process after each event',
  'a confident presenter who represents the club with warmth and clarity',
  'a dependable coordinator who quietly removes blockers for the team'
];

const traitTriples = [
  ['Empathetic', 'Decisive', 'Consistent'],
  ['Resourceful', 'Collaborative', 'Composed'],
  ['Visionary', 'Grounded', 'Reliable'],
  ['Analytical', 'Supportive', 'Diligent'],
  ['Creative', 'Structured', 'Accountable'],
  ['Adaptive', 'Clear-headed', 'Service-driven'],
  ['Persuasive', 'Focused', 'Proactive'],
  ['Mentoring', 'Inclusive', 'Detail-oriented']
];

const skillsBank = [
  ['Leadership', 'Public Speaking', 'Conflict Resolution'],
  ['Operations Planning', 'Task Delegation', 'Time Management'],
  ['Event Curation', 'Stakeholder Management', 'Execution'],
  ['Community Outreach', 'Volunteer Coordination', 'Partnership Building'],
  ['Brand Storytelling', 'Social Media Strategy', 'Content Writing'],
  ['Budgeting', 'Documentation', 'Reporting'],
  ['Design Thinking', 'Campaign Planning', 'Presentation'],
  ['Data Tracking', 'Project Coordination', 'Follow-through']
];

const quoteBank = [
  'Service becomes sustainable when systems and empathy move together.',
  'Leadership is helping others perform at their best, consistently.',
  'Good clubs are built in meetings, but great clubs are built in follow-through.',
  'Impact is not one big day; it is many small actions done well.',
  'Clarity reduces stress and helps volunteers deliver with confidence.',
  'We do not chase applause; we chase outcomes that help people.',
  'The best teams document what works and improve what does not.',
  'Rotaract grows strongest when every member feels seen and trusted.'
];

const projectPool = [
  'Blood Donation Drive',
  'Village Literacy Mentoring',
  'Menstrual Health Awareness Camp',
  'Campus Plastic-Free Campaign',
  'Career Sprint for School Students',
  'Inter-College Service Hackathon',
  'E-waste Collection Week',
  'Youth Mental Wellness Circle',
  'Lake Cleanup Action Day',
  'Digital Skills for NGOs'
];

const teBoardProfiles = [
  {
    name: 'Aarav Mehta',
    role: 'Club President',
    department: 'Leadership',
    focus: 'overall club strategy, board alignment, and inter-club collaborations',
    personality: 'a steady, high-accountability leader who keeps the club mission-first even during peak pressure',
    traits: ['Strategic', 'Empathetic', 'Disciplined'],
    skills: ['Leadership', 'Public Speaking', 'Decision Making'],
    achievements: [
      'Led 4 cross-board flagship initiatives with consistent volunteer retention',
      'Built a weekly execution review rhythm that improved task closure rates by 38%',
      'Represented the club at district forums and secured 3 partnership opportunities'
    ],
    projects: ['Signature Service Calendar', 'Board Performance Dashboard', 'District Collaboration Forum'],
    quote: 'A strong club is built when people trust both the vision and the process.'
  },
  {
    name: 'Riya Sharma',
    role: 'Vice President',
    department: 'Leadership',
    focus: 'execution governance, issue escalation, and member engagement systems',
    personality: 'an energetic operator who translates broad goals into week-by-week action plans',
    traits: ['Proactive', 'Supportive', 'Structured'],
    skills: ['Operations Planning', 'Communication', 'Coordination'],
    achievements: [
      'Designed execution trackers used by all boards for event readiness',
      'Mentored 20+ coordinators on planning and team communication basics',
      'Reduced event-day task spillover through pre-event simulation checklists'
    ],
    projects: ['Execution Playbook', 'Coordinator Mentorship Pods', 'Monthly Retrospective Framework'],
    quote: 'Momentum comes from clarity, not urgency.'
  },
  {
    name: 'Karan Patel',
    role: 'Secretary',
    department: 'Administration',
    focus: 'documentation quality, compliance timelines, and institutional communication',
    personality: 'a detail-focused communicator who keeps institutional memory clean and actionable',
    traits: ['Organized', 'Composed', 'Reliable'],
    skills: ['Documentation', 'Meeting Facilitation', 'Reporting'],
    achievements: [
      'Standardized MOM templates adopted across all major meetings',
      'Digitized committee records to improve handover quality',
      'Maintained 100% on-time documentation for district submissions'
    ],
    projects: ['Central Records Hub', 'Board Handover Kit', 'Policy Quick-Reference Guide'],
    quote: 'What gets documented well gets executed well.'
  },
  {
    name: 'Diya Nair',
    role: 'Director - Club Service',
    department: 'Club Service',
    focus: 'member experience, culture rituals, and internal bonding initiatives',
    personality: 'a warm community-builder who designs experiences that make members feel included from day one',
    traits: ['Inclusive', 'Creative', 'Consistent'],
    skills: ['Member Engagement', 'Program Design', 'Facilitation'],
    achievements: [
      'Ran onboarding circles that improved first-month retention significantly',
      'Launched monthly reflection meets to sustain member motivation',
      'Created peer-support squads for smoother event volunteering'
    ],
    projects: ['Welcome Week Journey', 'Member Pulse Check-ins', 'Peer Buddy Network'],
    quote: 'Club culture is built in small moments of care.'
  },
  {
    name: 'Farhan Sheikh',
    role: 'Director - Community Service',
    department: 'Community Service',
    focus: 'high-impact field projects, NGO partnerships, and outcome tracking',
    personality: 'a grounded field coordinator who pushes for impact metrics, not just activity counts',
    traits: ['Service-driven', 'Practical', 'Persistent'],
    skills: ['Community Outreach', 'Volunteer Management', 'Partnerships'],
    achievements: [
      'Coordinated long-cycle community projects with repeat volunteer cohorts',
      'Built collaboration pipelines with local NGOs and civic bodies',
      'Introduced post-project impact reflection notes for board reviews'
    ],
    projects: ['Neighborhood Action Network', 'Weekend Service Program', 'Impact Reflection Framework'],
    quote: 'If we listen first, we can serve better and longer.'
  },
  {
    name: 'Meera Joshi',
    role: 'Director - Personal Development',
    department: 'Personal Development',
    focus: 'learning pathways, leadership readiness, and professional skill development',
    personality: 'a growth-oriented mentor who blends practical career guidance with confidence-building workshops',
    traits: ['Mentoring', 'Insightful', 'Encouraging'],
    skills: ['Workshop Design', 'Mentoring', 'Career Guidance'],
    achievements: [
      'Built skill tracks for communication, leadership, and project ownership',
      'Hosted alumni-led masterclasses with high member participation',
      'Created personal development checkpoints used by multiple teams'
    ],
    projects: ['Leadership Ladder Series', 'Mock Interview Labs', 'Career Storytelling Sessions'],
    quote: 'Service and self-growth should progress side by side.'
  },
  {
    name: 'Lavanya Iyer',
    role: 'Director - International Service',
    department: 'International Service',
    focus: 'global fellowship collaborations, cultural exchange events, and SDG-linked initiatives',
    personality: 'a globally curious planner who turns international networking into meaningful learning for members',
    traits: ['Curious', 'Diplomatic', 'Forward-looking'],
    skills: ['Cross-cultural Communication', 'Program Curation', 'Networking'],
    achievements: [
      'Initiated virtual exchanges with Rotaract clubs across multiple regions',
      'Mapped projects to SDG goals for better strategic positioning',
      'Developed a collaboration toolkit for inter-club coordination'
    ],
    projects: ['Global Fellowship Dialogues', 'SDG Story Exchange', 'Cross-Border Project Sprint'],
    quote: 'International service starts with curiosity and respect.'
  }
];

const seRoleBlueprints = [
  { role: 'Joint Secretary', department: 'Administration', focus: 'agenda tracking and documentation follow-ups' },
  { role: 'Deputy Treasurer', department: 'Finance', focus: 'budget checkpoints and spending reports' },
  { role: 'Public Image Lead', department: 'Public Relations', focus: 'campaign messaging and audience engagement' },
  { role: 'Club Service Coordinator', department: 'Club Service', focus: 'member bonding activities and attendance rhythms' },
  { role: 'Community Service Coordinator', department: 'Community Service', focus: 'field volunteer planning with NGO partners' },
  { role: 'Personal Development Coordinator', department: 'Personal Development', focus: 'training calendars and speaker outreach' },
  { role: 'International Service Coordinator', department: 'International Service', focus: 'global project communication and exchange planning' },
  { role: 'Sponsorship Lead', department: 'Relations', focus: 'sponsor conversations and partner servicing' },
  { role: 'Logistics Lead', department: 'Operations', focus: 'event flow mapping and execution readiness' },
  { role: 'Design Lead', department: 'Creative', focus: 'visual storytelling and campaign creatives' },
  { role: 'Social Media Lead', department: 'Media', focus: 'content pipeline and publishing quality' },
  { role: 'Volunteer Engagement Lead', department: 'Membership', focus: 'volunteer onboarding and shift planning' },
  { role: 'Event Experience Lead', department: 'Events', focus: 'event format design and attendee feedback loops' },
  { role: 'Impact Measurement Lead', department: 'Strategy', focus: 'outcome tracking and review dashboards' },
  { role: 'Campus Outreach Lead', department: 'Community Service', focus: 'student outreach and awareness initiatives' },
  { role: 'Innovation Projects Lead', department: 'Projects', focus: 'pilot initiatives and rapid experimentation' },
  { role: 'Training Content Lead', department: 'Personal Development', focus: 'curriculum design and skill micro-modules' },
  { role: 'Technology Operations Lead', department: 'Technology', focus: 'workflow automations and tool support' }
];

const feRoleBlueprints = [
  { role: 'Service Coordinator', department: 'Community Service', focus: 'on-ground volunteer support and activity execution' },
  { role: 'Event Coordinator', department: 'Events', focus: 'session logistics and participant support' },
  { role: 'Public Image Coordinator', department: 'Public Relations', focus: 'event coverage and story amplification' },
  { role: 'Digital Media Coordinator', department: 'Media', focus: 'social posting and visual consistency' },
  { role: 'Creative Coordinator', department: 'Creative', focus: 'design assets and campaign creatives' },
  { role: 'Membership Coordinator', department: 'Membership', focus: 'new-member support and engagement touchpoints' },
  { role: 'Projects Coordinator', department: 'Projects', focus: 'task follow-up and initiative documentation' },
  { role: 'Operations Coordinator', department: 'Operations', focus: 'materials, venue flow, and volunteer movement' },
  { role: 'Fundraising Coordinator', department: 'Finance', focus: 'fundraiser execution and donor communication' },
  { role: 'Personal Development Coordinator', department: 'Personal Development', focus: 'workshop operations and learning support' },
  { role: 'International Service Coordinator', department: 'International Service', focus: 'exchange session support and research' },
  { role: 'Tech Support Coordinator', department: 'Technology', focus: 'forms, trackers, and digital process support' }
];

function slugifyName(name) {
  return String(name || '')
    .toLowerCase()
    .replace(/[^a-z\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

function pickProjects(index) {
  return [
    projectPool[index % projectPool.length],
    projectPool[(index + 3) % projectPool.length],
    projectPool[(index + 6) % projectPool.length]
  ];
}

function buildUniqueName(seedIndex, usedNames) {
  let index = seedIndex;
  while (index < seedIndex + 300) {
    const first = firstNames[index % firstNames.length];
    const last = lastNames[(index * 3 + 5) % lastNames.length];
    const candidate = `${first} ${last}`;
    if (!usedNames.has(candidate)) {
      usedNames.add(candidate);
      return candidate;
    }
    index += 1;
  }

  const fallback = `Member ${seedIndex + 1}`;
  usedNames.add(fallback);
  return fallback;
}

function buildGeneratedMember({ name, role, department, board, focus, index, boardTone }) {
  const traits = traitTriples[index % traitTriples.length];
  const skills = skillsBank[index % skillsBank.length];
  const style = personalityStyles[index % personalityStyles.length];
  const projects = pickProjects(index);
  const slug = slugifyName(name);

  return {
    name: normalizeRotaractorName(name),
    role,
    department,
    board,
    linkedin: `https://linkedin.com/in/${slug}`,
    email: `${slug.replace(/-/g, '.')}@rotaract.org`,
    avatar: `https://i.pravatar.cc/400?img=${(index % 70) + 1}`,
    quote: quoteBank[index % quoteBank.length],
    skills,
    work: `${boardTone} Focuses on ${focus} while ensuring execution quality and volunteer confidence stay high across the board.`,
    intro: `${normalizeRotaractorName(name)} is ${style}. Traits: ${traits.join(', ')}.`,
    achievements: [
      `Coordinated ${18 + (index % 19)} volunteers during major activities`,
      `Delivered ${2 + (index % 4)} board collaborations with measurable outcomes`,
      `Built ${1 + (index % 3)} reusable templates that improved planning speed`
    ].join('; '),
    projects
  };
}

function buildBoardMembers({ board, count, startIndex, roleBlueprints, usedNames, boardTone }) {
  return Array.from({ length: count }, (_, offset) => {
    const blueprint = roleBlueprints[offset % roleBlueprints.length];
    const index = startIndex + offset;
    const name = buildUniqueName(index, usedNames);

    return buildGeneratedMember({
      name,
      role: blueprint.role,
      department: blueprint.department,
      board,
      focus: blueprint.focus,
      index,
      boardTone
    });
  });
}

const usedNames = new Set(teBoardProfiles.map(profile => profile.name));

const teSeedRows = teBoardProfiles.map((profile, index) => {
  const slug = slugifyName(profile.name);
  return {
    name: normalizeRotaractorName(profile.name),
    role: profile.role,
    department: profile.department,
    board: 'TE Board',
    linkedin: `https://linkedin.com/in/${slug}`,
    email: `${slug.replace(/-/g, '.')}@rotaract.org`,
    avatar: `https://i.pravatar.cc/400?img=${(index % 70) + 1}`,
    quote: profile.quote,
    skills: profile.skills,
    work: `Provides senior leadership for ${profile.focus} and mentors emerging board members through execution planning.`,
    intro: `${normalizeRotaractorName(profile.name)} is ${profile.personality}. Traits: ${profile.traits.join(', ')}.`,
    achievements: profile.achievements.join('; '),
    projects: profile.projects
  };
});

const seSeedRows = buildBoardMembers({
  board: 'SE Board',
  count: 18,
  startIndex: 30,
  roleBlueprints: seRoleBlueprints,
  usedNames,
  boardTone: 'As a mid-senior contributor,'
});

const feSeedRows = buildBoardMembers({
  board: 'FE Board',
  count: 48,
  startIndex: 120,
  roleBlueprints: feRoleBlueprints,
  usedNames,
  boardTone: 'As an execution-focused FE Rotaractor,'
});

const seedRows = [...teSeedRows, ...seSeedRows, ...feSeedRows];

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
      work TEXT,
      intro TEXT,
      achievements TEXT,
      projects TEXT[]
    )
  `);

  await tryQuery('ALTER TABLE members ADD COLUMN IF NOT EXISTS quote TEXT');
  await tryQuery('ALTER TABLE members ADD COLUMN IF NOT EXISTS skills TEXT[]');
  await tryQuery('ALTER TABLE members ADD COLUMN IF NOT EXISTS work TEXT');
  await tryQuery('ALTER TABLE members ADD COLUMN IF NOT EXISTS intro TEXT');
  await tryQuery('ALTER TABLE members ADD COLUMN IF NOT EXISTS achievements TEXT');
  await tryQuery('ALTER TABLE members ADD COLUMN IF NOT EXISTS projects TEXT[]');

  await tryQuery(`
    UPDATE members
    SET name = CONCAT('Rtr. ', BTRIM(name))
    WHERE name IS NOT NULL
      AND BTRIM(name) <> ''
      AND name !~* '^(rtr\\.\\s+|rotaractor\\s+)'
  `);
}

async function seedMembersIfEmpty() {
  const { rows } = await tryQuery(`
    SELECT
      COUNT(*)::int AS count,
      COUNT(*) FILTER (WHERE board = ANY($1::text[]))::int AS legacy_board_count
    FROM members
  `, [LEGACY_BOARD_LABELS]);

  const stats = rows[0] || { count: 0, legacy_board_count: 0 };
  const hasLegacyDataset = stats.count === LEGACY_MEMBER_COUNT || stats.legacy_board_count > 0;

  if (stats.count > 0 && !hasLegacyDataset) {
    return;
  }

  if (hasLegacyDataset) {
    await tryQuery('TRUNCATE TABLE members RESTART IDENTITY');
  }

  for (const member of seedRows) {
    await tryQuery(
      `
        INSERT INTO members (name, role, department, board, linkedin, email, avatar, quote, skills, work, intro, achievements, projects)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      `,
      [member.name, member.role, member.department, member.board, member.linkedin, member.email, member.avatar, member.quote, member.skills, member.work, member.intro, member.achievements, member.projects]
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

function normalizeTextList(value) {
  if (Array.isArray(value)) {
    return value.map(item => String(item).trim()).filter(Boolean);
  }

  if (typeof value === 'string' && value.trim()) {
    return value
      .split(/[\n,;]+/)
      .map(item => item.trim())
      .filter(Boolean);
  }

  return [];
}

function normalizeRotaractorName(value) {
  const cleanName = String(value || '').trim();
  if (!cleanName) {
    return '';
  }

  if (/^rtr\.\s+/i.test(cleanName) || /^rotaractor\s+/i.test(cleanName)) {
    return cleanName;
  }

  return `Rtr. ${cleanName}`;
}

function normalizeBoardLabel(value) {
  const cleanBoard = String(value || '').trim();
  if (!cleanBoard) {
    return null;
  }

  const normalized = cleanBoard.toLowerCase();
  const aliases = {
    'fe': 'FE Board',
    'fe board': 'FE Board',
    'first year': 'FE Board',
    'se': 'SE Board',
    'se board': 'SE Board',
    'second year': 'SE Board',
    'te': 'TE Board',
    'te board': 'TE Board',
    'third year': 'TE Board'
  };

  return aliases[normalized] || cleanBoard;
}

function normalizeMemberPayload(body) {
  return {
    name: normalizeRotaractorName(body.name),
    role: String(body.role || '').trim(),
    department: String(body.department || '').trim(),
    board: normalizeBoardLabel(body.board),
    linkedin: String(body.linkedin || '').trim() || null,
    email: String(body.email || '').trim() || null,
    avatar: String(body.avatar || '').trim() || null,
    quote: String(body.quote || '').trim() || null,
    skills: normalizeSkills(body.skills),
    work: String(body.work || '').trim() || null,
    intro: String(body.intro || '').trim() || null,
    achievements: String(body.achievements || '').trim() || null,
    projects: normalizeTextList(body.projects)
  };
}

function filterLocalMembers(filters) {
  return localMembers
    .filter(member => matchMember(member, filters))
    .sort((a, b) => a.id - b.id)
    .map(member => ({
      ...member,
      name: normalizeRotaractorName(member.name)
    }));
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
  return result.rows.map(member => ({
    ...member,
    name: normalizeRotaractorName(member.name)
  }));
}

async function addMember(payload) {
  if (!usingDatabase) {
    const member = { id: nextLocalId++, ...payload };
    localMembers.push(member);
    return member;
  }

  const result = await tryQuery(
    `
      INSERT INTO members (name, role, department, board, linkedin, email, avatar, quote, skills, work, intro, achievements, projects)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *
    `,
    [
      payload.name,
      payload.role,
      payload.department,
      payload.board || null,
      payload.linkedin || null,
      payload.email || null,
      payload.avatar || null,
      payload.quote || null,
      payload.skills || null,
      payload.work || null,
      payload.intro || null,
      payload.achievements || null,
      payload.projects || null
    ]
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
      SET name = $1, role = $2, department = $3, board = $4, linkedin = $5, email = $6, avatar = $7, quote = $8, skills = $9, work = $10, intro = $11, achievements = $12, projects = $13
      WHERE id = $14
      RETURNING *
    `,
    [
      payload.name,
      payload.role,
      payload.department,
      payload.board || null,
      payload.linkedin || null,
      payload.email || null,
      payload.avatar || null,
      payload.quote || null,
      payload.skills || null,
      payload.work || null,
      payload.intro || null,
      payload.achievements || null,
      payload.projects || null,
      id
    ]
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

