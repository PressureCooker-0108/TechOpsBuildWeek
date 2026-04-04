import express from 'express';
import cors from 'cors';
import pool from './db.js';

const app = express();
const PORT = Number(process.env.PORT || 3000);
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'rotaract-admin';
const CORS_ORIGIN = process.env.CORS_ORIGIN || '';

const LEGACY_BOARD_LABELS = ['2023-24', '2024-25'];
const LEGACY_MEMBER_COUNT = 29;
const PREVIOUS_SEED_MEMBER_COUNT = 73;
const PREVIOUS_SEED_EMAIL_MARKERS = [
  'aarav.mehta@rotaract.org',
  'riya.sharma@rotaract.org',
  'karan.patel@rotaract.org'
];
const CURRENT_SEED_EMAIL_MARKERS = [
  'vedant.patwardhan@rotaract.org',
  'ishita.deshpande@rotaract.org',
  'soham.kulkarni@rotaract.org'
];

const firstNames = [
  'Vian', 'Aadhya', 'Shaurya', 'Myra', 'Krish', 'Anvi', 'Yuvan', 'Samruddhi', 'Ariv', 'Ishaani',
  'Nivaan', 'Ritika', 'Aarush', 'Trisha', 'Hridaan', 'Tanisha', 'Laksh', 'Mihika', 'Vihaan', 'Saanvi',
  'Atharva', 'Kashvi', 'Rudransh', 'Prachi', 'Devansh', 'Ira', 'Tanish', 'Sakshi', 'Abeer', 'Aarohi',
  'Reyansh', 'Mrunmayi', 'Samar', 'Eesha', 'Arham', 'Prisha', 'Advik', 'Niyati', 'Parv', 'Suhani',
  'Yashas', 'Niharika', 'Ayaan', 'Rhea', 'Soham', 'Apeksha', 'Pranay', 'Bhavya', 'Ishir', 'Kritika',
  'Ritvik', 'Manasi', 'Dhruv', 'Samiksha', 'Ved', 'Harini', 'Kiaan', 'Sharvari', 'Neil', 'Tanmayi'
];

const lastNames = [
  'Patwardhan', 'Deshpande', 'Kulkarni', 'Apte', 'Bhave', 'Lele', 'Gadgil', 'Oak', 'Ketkar', 'Khare',
  'Bhosale', 'Jadhav', 'Shirke', 'Pingle', 'Puranik', 'Sathe', 'Thatte', 'Inamdar', 'Pathare', 'Gore',
  'Sane', 'Bhuskute', 'Kanetkar', 'Mokashi', 'Chitale', 'Natu', 'Bapat', 'Agashe', 'Gokhale', 'Bhavekar',
  'Joshi', 'Pawar', 'Shinde', 'Mane', 'Raut', 'Kale', 'Dhamale', 'Chougule', 'Wagh', 'Khot'
];

const personalityStyles = [
  'a mission-focused planner who remains calm under operational pressure',
  'an energetic collaborator who converts intent into executable task maps',
  'a thoughtful listener who aligns teammates before taking action',
  'a systems-driven organizer who prevents confusion through clear ownership',
  'a creative problem-solver who improves workflows after every event cycle',
  'a reliable executor who quietly ensures deadlines are never missed',
  'a people-first volunteer leader who keeps everyone engaged and accountable',
  'a strategic communicator who makes complex plans easy to follow',
  'a detail-oriented contributor who strengthens quality at each handoff point',
  'a confident facilitator who brings structure to fast-moving initiatives'
];

const traitTriples = [
  ['Empathetic', 'Disciplined', 'Dependable'],
  ['Strategic', 'Collaborative', 'Calm'],
  ['Analytical', 'Supportive', 'Consistent'],
  ['Resourceful', 'Proactive', 'Grounded'],
  ['Creative', 'Accountable', 'Patient'],
  ['Curious', 'Organized', 'Service-minded'],
  ['Persuasive', 'Focused', 'Positive'],
  ['Adaptive', 'Inclusive', 'Execution-oriented']
];

const skillsBank = [
  ['Leadership', 'Facilitation', 'Decision Making'],
  ['Execution Planning', 'Delegation', 'Time Management'],
  ['Event Operations', 'Coordination', 'Follow-through'],
  ['Community Outreach', 'Volunteer Management', 'Partnership Building'],
  ['Brand Communication', 'Social Media Planning', 'Content Writing'],
  ['Budget Tracking', 'Documentation', 'Process Discipline'],
  ['Design Support', 'Campaign Structuring', 'Presentation'],
  ['Data Logging', 'Review Cadence', 'Continuous Improvement']
];

const quoteBank = [
  'Impact compounds when service is structured and sincere.',
  'Leadership is consistency when no one is watching.',
  'A strong board values preparation as much as enthusiasm.',
  'Every meaningful project begins with listening.',
  'Execution quality is an act of respect for volunteers and beneficiaries.',
  'We serve best when we collaborate without ego.',
  'Good documentation protects future teams from repeating mistakes.',
  'Rotaract culture grows when responsibility is shared.'
];

const projectPool = [
  'Rural Reading Fellowship',
  'City Cleanliness Micro-Drives',
  'STEM Exposure Sessions',
  'Community Health Awareness Camp',
  'Student Financial Literacy Week',
  'Inclusive Campus Access Audit',
  'Green Transport Awareness Campaign',
  'Youth Mental Health Support Circle',
  'Blood Stem Cell Registration Camp',
  'NGO Digital Ops Accelerator'
];

const teBoardProfiles = [
  {
    name: 'Vedant Patwardhan',
    role: 'Club President',
    department: 'Leadership',
    focus: 'club strategy, board governance, and long-term service planning',
    personality: 'a composed systems-leader who balances vision with disciplined execution',
    traits: ['Strategic', 'Grounded', 'Mentoring'],
    skills: ['Leadership', 'Public Speaking', 'Execution Governance'],
    achievements: [
      'Spearheaded 5 board-wide initiatives with stable volunteer continuity',
      'Introduced review dashboards that improved closure reliability across teams',
      'Secured strategic partnerships through district and civic collaboration meetings'
    ],
    projects: ['Annual Impact Blueprint', 'Leadership Review Cadence', 'District Collaboration Exchange'],
    quote: 'Vision only matters when teams can execute it together.'
  },
  {
    name: 'Ishita Deshpande',
    role: 'Vice President',
    department: 'Leadership',
    focus: 'cross-board execution alignment, bottleneck resolution, and team accountability',
    personality: 'an execution-first leader who turns broad goals into actionable timelines',
    traits: ['Proactive', 'Structured', 'Supportive'],
    skills: ['Operations Planning', 'Escalation Management', 'Coordination'],
    achievements: [
      'Deployed board-level execution trackers used in all flagship events',
      'Mentored coordinators on planning discipline and cross-functional communication',
      'Reduced event-day slippages through readiness rehearsals and checklists'
    ],
    projects: ['Execution Playbook 2.0', 'Coordinator Mentorship Pods', 'Issue Escalation Matrix'],
    quote: 'Clarity creates speed; confusion creates delay.'
  },
  {
    name: 'Soham Kulkarni',
    role: 'Secretary',
    department: 'Administration',
    focus: 'institutional records, communication hygiene, and governance documentation',
    personality: 'a detail-oriented communicator who keeps records precise and accessible',
    traits: ['Organized', 'Reliable', 'Composed'],
    skills: ['Documentation', 'Minutes Writing', 'Process Reporting'],
    achievements: [
      'Standardized meeting records and handover templates for all functional teams',
      'Built a searchable digital records repository for board continuity',
      'Maintained timely submission quality for compliance and district reporting'
    ],
    projects: ['Records Intelligence Hub', 'Committee Handover Kit', 'Policy Snapshot Manual'],
    quote: 'Precision in records protects momentum in execution.'
  },
  {
    name: 'Aarya Bhosale',
    role: 'Director - Club Service',
    department: 'Club Service',
    focus: 'member wellbeing, club culture rituals, and retention systems',
    personality: 'a warm community architect who designs belonging-focused club experiences',
    traits: ['Inclusive', 'Creative', 'Consistent'],
    skills: ['Member Engagement', 'Culture Design', 'Facilitation'],
    achievements: [
      'Designed onboarding circles that improved first-month integration',
      'Launched recurring reflection spaces to sustain volunteer morale',
      'Created peer buddy loops for stronger team collaboration'
    ],
    projects: ['Welcome Journey Program', 'Member Pulse Sprints', 'Peer Buddy Network'],
    quote: 'Belonging is the foundation of sustained service.'
  },
  {
    name: 'Reyansh Jadhav',
    role: 'Director - Community Service',
    department: 'Community Service',
    focus: 'field impact execution, NGO collaboration, and service outcome tracking',
    personality: 'a pragmatic field leader who values measurable community outcomes',
    traits: ['Service-driven', 'Practical', 'Persistent'],
    skills: ['Community Outreach', 'Volunteer Management', 'Partnership Building'],
    achievements: [
      'Scaled recurring community initiatives with stable volunteer rosters',
      'Built trusted NGO coordination pipelines for long-cycle projects',
      'Added post-campaign impact reviews for board learning loops'
    ],
    projects: ['Community Action Grid', 'Weekend Field Service', 'Impact Review Framework'],
    quote: 'Service quality improves when we measure what changes.'
  },
  {
    name: 'Nandini Gokhale',
    role: 'Director - Personal Development',
    department: 'Personal Development',
    focus: 'member growth pathways, capability-building, and leadership readiness',
    personality: 'a growth mentor who combines career clarity with confidence-building',
    traits: ['Mentoring', 'Insightful', 'Encouraging'],
    skills: ['Workshop Design', 'Mentoring', 'Career Development'],
    achievements: [
      'Designed skill tracks for communication, leadership, and ownership',
      'Coordinated alumni-led masterclasses with high engagement rates',
      'Established development checkpoints for longitudinal member growth'
    ],
    projects: ['Leadership Ladder Series', 'Career Simulation Labs', 'Growth Reflection Pods'],
    quote: 'A stronger member builds a stronger service ecosystem.'
  },
  {
    name: 'Pranav Apte',
    role: 'Director - International Service',
    department: 'International Service',
    focus: 'global club collaboration, SDG-linked dialogue, and cross-cultural learning initiatives',
    personality: 'a globally aware planner who turns networks into meaningful service exchanges',
    traits: ['Curious', 'Diplomatic', 'Forward-looking'],
    skills: ['Cross-cultural Communication', 'Program Curation', 'Networking'],
    achievements: [
      'Initiated international exchange forums with multiple Rotaract chapters',
      'Mapped key initiatives to SDG objectives for strategic clarity',
      'Built reusable templates for cross-club planning and communication'
    ],
    projects: ['Global Fellowship Dialogues', 'SDG Exchange Circles', 'Cross-Border Collaboration Sprint'],
    quote: 'Global understanding begins with respectful collaboration.'
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
const EXPECTED_SEED_MEMBER_COUNT = seedRows.length;
const MIN_CURRENT_SEED_MARKERS_PRESENT = 2;

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
      COUNT(*) FILTER (WHERE board = ANY($1::text[]))::int AS legacy_board_count,
      COUNT(*) FILTER (WHERE email = ANY($2::text[]))::int AS previous_seed_marker_count,
      COUNT(*) FILTER (WHERE email = ANY($3::text[]))::int AS current_seed_marker_count
    FROM members
  `, [LEGACY_BOARD_LABELS, PREVIOUS_SEED_EMAIL_MARKERS, CURRENT_SEED_EMAIL_MARKERS]);

  const stats = rows[0] || {
    count: 0,
    legacy_board_count: 0,
    previous_seed_marker_count: 0,
    current_seed_marker_count: 0
  };
  const hasLegacyDataset =
    stats.count === LEGACY_MEMBER_COUNT
    || stats.count === PREVIOUS_SEED_MEMBER_COUNT
    || stats.legacy_board_count > 0
    || stats.previous_seed_marker_count > 0;
  const hasCurrentDataset =
    stats.count === EXPECTED_SEED_MEMBER_COUNT
    && stats.current_seed_marker_count >= MIN_CURRENT_SEED_MARKERS_PRESENT;

  if (stats.count > 0 && !hasLegacyDataset && hasCurrentDataset) {
    return;
  }

  if (stats.count > 0) {
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

