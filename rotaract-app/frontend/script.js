// API endpoint selection: localhost during development, /api when deployed behind a proxy.
const API_BASE_URL =
  window.__API_BASE_URL__ ||
  ((window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://localhost:3000'
    : '/api');
const ADMIN_PASSWORD_KEY = 'rotaract-admin-password';
const ADMIN_ACCESS_KEY = 'rotaract-admin-access-granted';
const CARD_HOVER_OPEN_DELAY_MS = 600;
const DEFAULT_AVATAR_URL = 'https://ui-avatars.com/api/?name=Rotaractor&size=600&rounded=true&bold=true&background=2b2b2f&color=f3dc97&format=png';
const BOARD_SECTION_ORDER = ['TE Board', 'SE Board', 'FE Board'];
const BOARD_SECTION_CLASS_MAP = {
  'FE Board': 'board-section--fe',
  'SE Board': 'board-section--se',
  'TE Board': 'board-section--te'
};
const FILTER_OUT_ANIMATION_MS = 220;

// Small floating message helper used for success/error feedback.
function showToast(message, isError = false) {
  const toast = document.getElementById('toast');
  if (!toast) return;

  toast.textContent = message;
  toast.classList.remove('hidden', 'error');
  if (isError) {
    toast.classList.add('error');
  }

  setTimeout(() => {
    toast.classList.add('hidden');
    toast.classList.remove('error');
  }, 2400);
}

// Returns readable fallback text when a value is empty/null.
function getText(value, fallback = '-') {
  return value && String(value).trim() ? value : fallback;
}

// Ensures all displayed names follow the Rotaractor naming convention.
function formatRotaractorName(name) {
  const cleanName = String(name || '').trim();
  if (!cleanName) {
    return 'Rotaractor';
  }

  if (/^rtr\.\s+/i.test(cleanName) || /^rotaractor\s+/i.test(cleanName)) {
    return cleanName;
  }

  return `Rtr. ${cleanName}`;
}

// Normalizes skills from either array input or comma-separated text.
function normalizeSkills(skills) {
  if (Array.isArray(skills)) {
    return skills.map(skill => String(skill).trim()).filter(Boolean);
  }

  if (typeof skills === 'string' && skills.trim()) {
    return skills
      .split(',')
      .map(skill => skill.trim())
      .filter(Boolean);
  }

  return [];
}

// Normalizes list-like fields (projects/achievements) from text or arrays.
function normalizeTextList(value) {
  if (Array.isArray(value)) {
    return value.map(item => String(item).trim()).filter(Boolean);
  }

  if (typeof value === 'string' && value.trim()) {
    return value
      .split(/[,\n;]+/)
      .map(item => item.trim())
      .filter(Boolean);
  }

  return [];
}

// Uses explicit project data first, then creates highlights from work description.
function deriveProjectHighlights(member) {
  const explicitProjects = normalizeTextList(member.projects);
  if (explicitProjects.length) {
    return explicitProjects;
  }

  return String(member.work || '')
    .split('.')
    .map(item => item.trim())
    .filter(Boolean)
    .slice(0, 4);
}

// Keeps ambient gears running via CSS animation (no scroll coupling).
function setupAmbientGearScrollAnimation() {
  const gears = [...document.querySelectorAll('[data-scroll-gear]')];
  if (!gears.length) return;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  gears.forEach(gear => {
    gear.style.removeProperty('transform');
    if (prefersReducedMotion) {
      gear.style.animation = 'none';
    } else {
      gear.style.removeProperty('animation');
    }
  });
}

// Smoothly fades/lifts existing cards out before new filtered results are rendered.
async function animateCardsOutBeforeRender(memberGrid) {
  if (!memberGrid) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const cards = memberGrid.querySelectorAll('.member-card');
  if (!cards.length) return;

  memberGrid.classList.add('is-filtering-out');
  await new Promise(resolve => setTimeout(resolve, FILTER_OUT_ANIMATION_MS));
  memberGrid.classList.remove('is-filtering-out');
}

// Binds modal close interactions once so events are not duplicated.
function setupModalHandlers() {
  const modal = document.getElementById('profileModal');
  const closeBtn = document.getElementById('modalCloseBtn');

  if (!modal || modal.dataset.bound === 'true') return;

  modal.dataset.bound = 'true';

  closeBtn?.addEventListener('click', closeModal);

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      closeModal();
    }
  });
}

// Populates and opens the profile modal for a selected member card.
function openModal(member) {
  const modal = document.getElementById('profileModal');
  if (!modal) return;

  const displayName = formatRotaractorName(member.name);

  document.getElementById('modalAvatar').src = getText(member.avatar, DEFAULT_AVATAR_URL);
  document.getElementById('modalAvatar').alt = `${displayName} profile photo`;
  document.getElementById('profileName').textContent = displayName;
  document.getElementById('modalPost').textContent = `Post: ${getText(member.role)}`;
  document.getElementById('modalBoard').textContent = `Board: ${getText(member.board)}`;
  document.getElementById('modalIntro').textContent = getText(member.intro, 'No introduction added yet.');
  document.getElementById('modalQuote').textContent = getText(member.quote, 'No quote added yet.');
  document.getElementById('modalWork').textContent = getText(member.work, 'No work description available.');

  const badgeWrap = document.getElementById('modalBadges');
  const badges = [member.role, member.board].filter(Boolean);
  if (member.linkedin) badges.push('LinkedIn Ready');
  if (member.email) badges.push('Email Reachable');
  badgeWrap.innerHTML = badges.length
    ? badges.map(item => `<span class="profile-badge">${item}</span>`).join('')
    : '<span class="profile-badge">No badges available</span>';

  const achievementsWrap = document.getElementById('modalAchievements');
  const achievements = normalizeTextList(member.achievements);
  achievementsWrap.innerHTML = achievements.length
    ? achievements.map(item => `<article class="profile-list-card">${item}</article>`).join('')
    : '<article class="profile-list-card">No achievements listed yet.</article>';

  const projectsWrap = document.getElementById('modalProjects');
  const projectHighlights = deriveProjectHighlights(member);
  projectsWrap.innerHTML = projectHighlights.length
    ? projectHighlights.map(item => `<article class="profile-list-card">${item}</article>`).join('')
    : '<article class="profile-list-card">No project highlights added yet.</article>';

  const skillsWrap = document.getElementById('modalSkills');
  const skills = normalizeSkills(member.skills);
  skillsWrap.innerHTML = skills.length
    ? skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')
    : '<span class="skill-tag">No skills listed</span>';

  modal.classList.remove('hidden');
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');

  // Fail-safe so modal content is always visible even if animations are interrupted.
  const dialog = modal.querySelector('.profile-modal__dialog');
  if (dialog) {
    dialog.style.opacity = '1';
    dialog.style.transform = 'translateY(0)';
  }

}

// Hides the profile modal and restores page scroll.
function closeModal() {
  const modal = document.getElementById('profileModal');
  if (!modal) return;

  modal.classList.add('hidden');
  modal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
}

// Session storage helpers for admin password state.
function getStoredAdminPassword() {
  return sessionStorage.getItem(ADMIN_PASSWORD_KEY) || '';
}

function setStoredAdminPassword(password) {
  sessionStorage.setItem(ADMIN_PASSWORD_KEY, password);
}

function clearStoredAdminPassword() {
  sessionStorage.removeItem(ADMIN_PASSWORD_KEY);
}

// Updates the auth status line in admin UI.
function setAdminStatus(message, state = '') {
  const authStatus = document.getElementById('authStatus');
  if (!authStatus) return;

  authStatus.textContent = message;
  authStatus.classList.remove('success', 'error');
  if (state) {
    authStatus.classList.add(state);
  }
}

// Enables/disables all admin form inputs depending on lock state.
function setAdminFormLocked(isLocked) {
  const memberForm = document.getElementById('memberForm');
  const saveBtn = document.getElementById('saveBtn');
  const cancelEditBtn = document.getElementById('cancelEditBtn');
  const inputs = memberForm ? memberForm.querySelectorAll('input, textarea, button') : [];

  if (memberForm) {
    memberForm.classList.toggle('is-locked', isLocked);
  }

  inputs.forEach(input => {
    input.disabled = isLocked;
  });

  if (saveBtn) saveBtn.disabled = isLocked;
  if (cancelEditBtn) cancelEditBtn.disabled = isLocked;

  const adminPassword = document.getElementById('adminPassword');
  const unlockAdminBtn = document.getElementById('unlockAdminBtn');

  if (adminPassword) adminPassword.disabled = false;
  if (unlockAdminBtn) unlockAdminBtn.disabled = false;
}

// Server-side password verification used by both admin gate and unlock action.
async function verifyAdminPassword(password) {
  const response = await fetch(`${API_BASE_URL}/admin/verify`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-password': password
    },
    body: JSON.stringify({ password })
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.message || 'Invalid admin password.');
  }

  return response.json();
}

// Builds request headers that include the admin password when available.
function getAdminHeaders() {
  const password = getStoredAdminPassword();
  if (!password) return null;

  return {
    'Content-Type': 'application/json',
    'x-admin-password': password
  };
}

// Fetches filtered members for the team page list.
async function fetchMembersForUser() {
  const loadingState = document.getElementById('loadingState');
  const emptyState = document.getElementById('emptyState');
  const memberGrid = document.getElementById('memberGrid');

  const searchInput = document.getElementById('searchInput');
  const boardFilter = document.getElementById('boardFilter');

  try {
    if (loadingState) loadingState.classList.remove('hidden');
    if (emptyState) emptyState.classList.add('hidden');

    const query = new URLSearchParams({
      q: searchInput.value.trim(),
      board: boardFilter.value
    });

    const response = await fetch(`${API_BASE_URL}/members/search?${query.toString()}`);
    if (!response.ok) {
      showToast('Unable to fetch Rotaractors. Make sure the backend is running and PostgreSQL is configured.', true);
      return;
    }

    const members = await response.json();
    await animateCardsOutBeforeRender(memberGrid);
    renderMembers(members, memberGrid, emptyState);
  } catch (error) {
    showToast(error.message, true);
  } finally {
    if (loadingState) loadingState.classList.add('hidden');
  }
}

// Groups members by board and renders sections in TE -> SE -> FE order.
function renderMembers(members, memberGrid, emptyState) {
  if (!memberGrid || !emptyState) return;

  memberGrid.innerHTML = '';
  memberGrid.classList.add('member-grid--sections');

  if (!members.length) {
    emptyState.classList.remove('hidden');
    return;
  }

  emptyState.classList.add('hidden');

  const groupedMembers = members.reduce((groups, member) => {
    const board = member.board && String(member.board).trim()
      ? String(member.board).trim()
      : 'Unassigned Board';

    if (!groups.has(board)) {
      groups.set(board, []);
    }

    groups.get(board).push(member);
    return groups;
  }, new Map());

  const orderedBoards = [...groupedMembers.keys()].sort((left, right) => {
    const leftIndex = BOARD_SECTION_ORDER.indexOf(left);
    const rightIndex = BOARD_SECTION_ORDER.indexOf(right);
    const safeLeftIndex = leftIndex === -1 ? Number.MAX_SAFE_INTEGER : leftIndex;
    const safeRightIndex = rightIndex === -1 ? Number.MAX_SAFE_INTEGER : rightIndex;

    if (safeLeftIndex !== safeRightIndex) {
      return safeLeftIndex - safeRightIndex;
    }

    return left.localeCompare(right);
  });

  let globalCardIndex = 0;

  orderedBoards.forEach(boardName => {
    const boardSection = document.createElement('section');
    boardSection.className = `board-section ${BOARD_SECTION_CLASS_MAP[boardName] || ''}`.trim();

    const heading = document.createElement('div');
    heading.className = 'board-section__header';
    heading.innerHTML = `
      <h2 class="board-section__title">${boardName}</h2>
      <p class="board-section__count">${groupedMembers.get(boardName).length} Rotaractor(s)</p>
    `;

    const boardGrid = document.createElement('div');
    boardGrid.className = 'board-section__grid';

    groupedMembers.get(boardName).forEach(member => {
      const card = createMemberCard(member, globalCardIndex);
      globalCardIndex += 1;
      boardGrid.appendChild(card);
    });

    boardSection.appendChild(heading);
    boardSection.appendChild(boardGrid);
    memberGrid.appendChild(boardSection);
  });
}

// Creates one interactive card with delayed hover flip and click-to-open modal.
function createMemberCard(member, index) {
  const card = document.createElement('article');
  card.className = 'member-card';
  card.tabIndex = 0;
  const staggerDelay = Math.min(index * 70, 700);
  card.style.setProperty('--stagger', `${staggerDelay}ms`);
  const displayName = formatRotaractorName(member.name);
  const quote = getText(member.quote, 'Lead with service, grow with purpose.');
  const contactLinks = [
    member.email
      ? `<a href="mailto:${member.email}">Email</a>`
      : '',
    member.linkedin
      ? `<a href="${member.linkedin}" target="_blank" rel="noreferrer">LinkedIn</a>`
      : ''
  ].filter(Boolean);
  const socialBadges = [member.role, member.board]
    .filter(Boolean)
    .map(item => `<span class="member-card__badge">${item}</span>`)
    .join('');

  card.innerHTML = `
    <div class="member-card__flip">
      <div class="member-card__face member-card__face--front">
        <div class="member-card__media">
          <img class="avatar" src="${getText(member.avatar, DEFAULT_AVATAR_URL)}" alt="${displayName}" />
          <div class="member-card__content">
            <h3>${displayName}</h3>
          </div>
        </div>
        <p class="post-pill">${getText(member.role)}</p>
        <p class="meta">Board: ${getText(member.board)}</p>
      </div>
      <div class="member-card__face member-card__face--back">
        <p class="member-card__quote">"${quote}"</p>
        <div class="social-links member-card__back-links">
          ${contactLinks.length
            ? contactLinks.join('')
            : '<span class="member-card__no-contact">Contact details unavailable</span>'}
        </div>
        <div class="member-card__badges">
          ${socialBadges || '<span class="member-card__badge">Rotaractor</span>'}
        </div>
      </div>
    </div>
  `;

  let hoverTimer = null;

  const clearHoverTimer = () => {
    if (!hoverTimer) return;
    clearTimeout(hoverTimer);
    hoverTimer = null;
  };

  const scheduleOpen = () => {
    clearHoverTimer();
    hoverTimer = setTimeout(() => {
      card.classList.add('is-hover-open');
      hoverTimer = null;
    }, CARD_HOVER_OPEN_DELAY_MS);
  };

  const closeFlip = () => {
    clearHoverTimer();
    card.classList.remove('is-hover-open');
  };

  card.addEventListener('mouseenter', scheduleOpen);
  card.addEventListener('mouseleave', closeFlip);
  card.addEventListener('focusin', scheduleOpen);
  card.addEventListener('focusout', event => {
    if (!card.contains(event.relatedTarget)) {
      closeFlip();
    }
  });

  card.addEventListener('click', event => {
    if (event.target.closest('a')) return;
    event.stopPropagation();
    openModal(member);
  });

  card.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openModal(member);
    }
  });

  return card;
}

// Renders top stat cards and animates numbers.
function renderStats(members) {
  const stats = document.getElementById('stats');
  if (!stats) return;

  const posts = new Set(members.map(member => member.role));
  const boards = new Set(members.map(member => member.board).filter(Boolean));

  const data = [
    { label: 'Total Rotaractors', value: members.length },
    { label: 'Posts', value: posts.size },
    { label: 'Boards', value: boards.size }
  ];

  stats.innerHTML = data
    .map(item => `
      <div class="stat-card">
        <div class="value">${item.value}</div>
        <div class="label">${item.label}</div>
      </div>
    `)
    .join('');

  const statValues = stats.querySelectorAll('.value');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  statValues.forEach((element, index) => {
    const target = Number(data[index]?.value || 0);
    if (prefersReducedMotion) {
      element.textContent = `${target}`;
      return;
    }

    element.textContent = '0';
    const duration = 900;
    const start = performance.now();

    const tick = now => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      element.textContent = `${Math.round(target * eased)}`;

      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    };

    requestAnimationFrame(tick);
  });
}

// Populates board dropdown options from currently loaded dataset.
function fillFilterOptions(members) {
  const boardFilter = document.getElementById('boardFilter');

  if (!boardFilter) return;

  const boards = [...new Set(members.map(member => member.board).filter(Boolean))].sort();

  boards.forEach(board => {
    const option = document.createElement('option');
    option.value = board;
    option.textContent = board;
    boardFilter.appendChild(option);
  });
}

// Bootstraps team page interactions (fetching, filters, modal, animations).
async function initializeUserPage() {
  const searchInput = document.getElementById('searchInput');
  if (!searchInput) return;

  setupModalHandlers();
  setupAmbientGearScrollAnimation();

  try {
    const response = await fetch(`${API_BASE_URL}/members`);
    if (!response.ok) {
      showToast('Unable to load initial Rotaractor data.', true);
      return;
    }

    const allMembers = await response.json();
    renderStats(allMembers);
    fillFilterOptions(allMembers);
    await fetchMembersForUser();
  } catch (error) {
    showToast(error.message, true);
  }

  // Small debounce so search feels responsive without over-requesting.
  let timer;
  searchInput.addEventListener('input', () => {
    clearTimeout(timer);
    timer = setTimeout(fetchMembersForUser, 250);
  });

  ['boardFilter'].forEach(id => {
    const element = document.getElementById(id);
    if (element) {
      element.addEventListener('change', fetchMembersForUser);
    }
  });
}

// Bootstraps admin page interactions (auth, form CRUD, image management).
async function initializeAdminPage() {
  const memberForm = document.getElementById('memberForm');
  if (!memberForm) return;

  const hasAdminAccess = await ensureAdminPageAccess();
  if (!hasAdminAccess) return;

  document.body.classList.remove('admin-gated');

  const memberIdField = document.getElementById('memberId');
  const adminLoading = document.getElementById('adminLoading');
  const adminPasswordInput = document.getElementById('adminPassword');
  const unlockAdminBtn = document.getElementById('unlockAdminBtn');
  const avatarUploadInput = document.getElementById('avatarUpload');
  const avatarPreview = document.getElementById('avatarPreview');
  const clearAvatarBtn = document.getElementById('clearAvatarBtn');

  const fields = {
    name: document.getElementById('name'),
    role: document.getElementById('role'),
    board: document.getElementById('board'),
    linkedin: document.getElementById('linkedin'),
    email: document.getElementById('email'),
    avatar: document.getElementById('avatar'),
    quote: document.getElementById('quote'),
    intro: document.getElementById('intro'),
    achievements: document.getElementById('achievements'),
    projects: document.getElementById('projects'),
    skills: document.getElementById('skills'),
    work: document.getElementById('work')
  };

  const updateAvatarPreview = avatarValue => {
    if (!avatarPreview) return;

    const src = String(avatarValue || '').trim();
    if (!src) {
      avatarPreview.classList.add('hidden');
      avatarPreview.removeAttribute('src');
      return;
    }

    avatarPreview.src = src;
    avatarPreview.classList.remove('hidden');
  };

  const resetForm = () => {
    memberIdField.value = '';
    memberForm.reset();
    updateAvatarPreview('');
    if (avatarUploadInput) avatarUploadInput.value = '';
  };

  const loadAdminMembers = async () => {
    try {
      adminLoading.classList.remove('hidden');

      const response = await fetch(`${API_BASE_URL}/members`);
      if (!response.ok) {
        showToast('Unable to fetch Rotaractors for admin panel. Start the backend and ensure PostgreSQL is running.', true);
        return;
      }

      const members = await response.json();
      renderAdminTable(members, onEditClick, onDeleteClick);
    } catch (error) {
      showToast(error.message, true);
    } finally {
      adminLoading.classList.add('hidden');
    }
  };

  const lockAdminPanel = message => {
    clearStoredAdminPassword();
    setAdminFormLocked(true);
    setAdminStatus(message || 'Locked. Enter the admin password to enable add/edit/delete actions.', 'error');
  };

  const unlockAdminPanel = async password => {
    const trimmedPassword = password.trim();
    if (!trimmedPassword) {
      throw new Error('Please enter the admin password.');
    }

    await verifyAdminPassword(trimmedPassword);
    setStoredAdminPassword(trimmedPassword);
    setAdminFormLocked(false);
    setAdminStatus('Unlocked. You can now add, edit, and delete Rotaractor records.', 'success');
    showToast('Admin panel unlocked.');
  };

  const onEditClick = member => {
    if (!getStoredAdminPassword()) {
      showToast('Unlock the admin panel first.', true);
      return;
    }

    memberIdField.value = member.id;

    fields.name.value = member.name || '';
    fields.role.value = member.role || '';
    fields.board.value = member.board || '';
    fields.linkedin.value = member.linkedin || '';
    fields.email.value = member.email || '';
    fields.avatar.value = member.avatar || '';
    fields.quote.value = member.quote || '';
    fields.intro.value = member.intro || '';
    fields.achievements.value = member.achievements || '';
    fields.projects.value = normalizeTextList(member.projects).join(', ');
    fields.skills.value = normalizeSkills(member.skills).join(', ');
    fields.work.value = member.work || '';
    updateAvatarPreview(fields.avatar.value);

    showToast(`Editing ${formatRotaractorName(member.name)}`);
  };

  const getProtectedHeaders = () => getAdminHeaders();

  const onDeleteClick = async id => {
    if (!getStoredAdminPassword()) {
      showToast('Unlock the admin panel first.', true);
      return;
    }

    const yes = window.confirm('Delete this Rotaractor record? This cannot be undone.');
    if (!yes) return;

    try {
      const headers = getProtectedHeaders();
      if (!headers) {
        showToast('Unlock the admin panel first.', true);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/members/${id}`, {
        method: 'DELETE',
        headers
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        if (response.status === 401) {
          lockAdminPanel('Password expired or incorrect. Please unlock again.');
          showToast('Admin password is incorrect.', true);
          return;
        }

        showToast(body.message || 'Delete failed.', true);
        return;
      }

      showToast('Rotaractor deleted successfully.');
      await loadAdminMembers();
      resetForm();
    } catch (error) {
      showToast(error.message, true);
    }
  };

  memberForm.addEventListener('submit', async event => {
    event.preventDefault();

    const headers = getProtectedHeaders();
    if (!headers) {
      showToast('Unlock the admin panel first.', true);
      return;
    }

    const payload = {
      name: fields.name.value.trim(),
      role: fields.role.value.trim(),
      board: fields.board.value.trim(),
      linkedin: fields.linkedin.value.trim(),
      email: fields.email.value.trim(),
      avatar: fields.avatar.value.trim(),
      quote: fields.quote.value.trim(),
      intro: fields.intro.value.trim(),
      achievements: fields.achievements.value.trim(),
      projects: normalizeTextList(fields.projects.value),
      skills: normalizeSkills(fields.skills.value),
      work: fields.work.value.trim()
    };

    const isEditing = Boolean(memberIdField.value);
    const endpoint = isEditing
      ? `${API_BASE_URL}/members/${memberIdField.value}`
      : `${API_BASE_URL}/members`;

    try {
      const response = await fetch(endpoint, {
        method: isEditing ? 'PUT' : 'POST',
        headers,
        body: JSON.stringify(payload)
      });

      const body = await response.json().catch(() => ({}));
      if (!response.ok) {
        if (response.status === 401) {
          lockAdminPanel('Password expired or incorrect. Please unlock again.');
          showToast('Admin password is incorrect.', true);
          return;
        }

        showToast(body.message || 'Operation failed.', true);
        return;
      }

      showToast(isEditing ? 'Rotaractor updated successfully.' : 'Rotaractor added successfully.');
      await loadAdminMembers();
      resetForm();
    } catch (error) {
      showToast(error.message, true);
    }
  });

  const cancelEditBtn = document.getElementById('cancelEditBtn');
  cancelEditBtn.addEventListener('click', () => {
    if (!getStoredAdminPassword()) {
      showToast('Unlock the admin panel first.', true);
      return;
    }

    resetForm();
  });

  fields.avatar.addEventListener('input', () => {
    updateAvatarPreview(fields.avatar.value);
  });

  avatarUploadInput?.addEventListener('change', event => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = loadEvent => {
      const imageData = String(loadEvent.target?.result || '');
      fields.avatar.value = imageData;
      updateAvatarPreview(imageData);
      showToast('Avatar uploaded successfully.');
    };
    reader.readAsDataURL(file);
  });

  clearAvatarBtn?.addEventListener('click', () => {
    fields.avatar.value = '';
    if (avatarUploadInput) avatarUploadInput.value = '';
    updateAvatarPreview('');
  });

  unlockAdminBtn.addEventListener('click', async () => {
    try {
      await unlockAdminPanel(adminPasswordInput.value);
      await loadAdminMembers();
    } catch (error) {
      lockAdminPanel(error.message);
      showToast(error.message, true);
    }
  });

  adminPasswordInput.addEventListener('keydown', async event => {
    if (event.key === 'Enter') {
      event.preventDefault();
      unlockAdminBtn.click();
    }
  });

  const savedPassword = getStoredAdminPassword();
  if (savedPassword) {
    try {
      await unlockAdminPanel(savedPassword);
    } catch (error) {
      lockAdminPanel(error.message);
    }
  } else {
    lockAdminPanel();
  }

  await loadAdminMembers();
}

// First-level gate: asks password before showing any admin UI.
async function ensureAdminPageAccess() {
  if (sessionStorage.getItem(ADMIN_ACCESS_KEY) === 'true') {
    return true;
  }

  const password = window.prompt('Enter admin password to access this page:');
  const trimmedPassword = password ? password.trim() : '';

  if (!trimmedPassword) {
    window.location.replace('./index.html');
    return false;
  }

  try {
    await verifyAdminPassword(trimmedPassword);
    setStoredAdminPassword(trimmedPassword);
    sessionStorage.setItem(ADMIN_ACCESS_KEY, 'true');
    return true;
  } catch (error) {
    window.alert('Access denied. Redirecting to Team page.');
    window.location.replace('./index.html');
    return false;
  }
}

// Draws admin table rows and wires edit/delete buttons.
function renderAdminTable(members, onEditClick, onDeleteClick) {
  const tbody = document.getElementById('memberTableBody');
  if (!tbody) return;

  tbody.innerHTML = '';

  members.forEach(member => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${formatRotaractorName(member.name)}</td>
      <td>${member.role}</td>
      <td>${getText(member.board)}</td>
      <td class="actions">
        <button type="button" class="outline" data-edit-id="${member.id}">Edit</button>
        <button type="button" class="danger" data-delete-id="${member.id}">Delete</button>
      </td>
    `;

    tbody.appendChild(row);
  });

  tbody.querySelectorAll('[data-edit-id]').forEach(button => {
    button.addEventListener('click', () => {
      const member = members.find(item => item.id === Number(button.dataset.editId));
      if (member) onEditClick(member);
    });
  });

  tbody.querySelectorAll('[data-delete-id]').forEach(button => {
    button.addEventListener('click', () => {
      onDeleteClick(Number(button.dataset.deleteId));
    });
  });
}

// Initialize both pages safely: each initializer exits early if its DOM is absent.
initializeUserPage();
initializeAdminPage();

