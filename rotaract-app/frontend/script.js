const API_BASE_URL =
  window.__API_BASE_URL__ ||
  ((window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://localhost:3000'
    : '/api');
const ADMIN_PASSWORD_KEY = 'rotaract-admin-password';
const BOARD_SECTION_ORDER = ['FE Board', 'SE Board', 'TE Board'];
const BOARD_SECTION_CLASS_MAP = {
  'FE Board': 'board-section--fe',
  'SE Board': 'board-section--se',
  'TE Board': 'board-section--te'
};

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

function getText(value, fallback = '-') {
  return value && String(value).trim() ? value : fallback;
}

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

function setupModalHandlers() {
  const modal = document.getElementById('profileModal');
  const closeBtn = document.getElementById('modalCloseBtn');

  if (!modal || modal.dataset.bound === 'true') return;

  modal.dataset.bound = 'true';

  modal.addEventListener('click', event => {
    if (event.target.matches('[data-modal-close]')) {
      closeModal();
    }
  });

  closeBtn?.addEventListener('click', closeModal);

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      closeModal();
    }
  });
}

function animateDialogFromCard(sourceCard) {
  const dialog = document.querySelector('.profile-modal__dialog');
  if (!dialog || !sourceCard || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  const cardRect = sourceCard.getBoundingClientRect();
  const dialogRect = dialog.getBoundingClientRect();

  const translateX = cardRect.left - dialogRect.left;
  const translateY = cardRect.top - dialogRect.top;
  const scaleX = cardRect.width / dialogRect.width;
  const scaleY = cardRect.height / dialogRect.height;

  dialog.animate(
    [
      {
        transform: `translate(${translateX}px, ${translateY}px) scale(${scaleX}, ${scaleY})`,
        opacity: 0.52
      },
      {
        transform: 'translate(0, 0) scale(1, 1)',
        opacity: 1
      }
    ],
    {
      duration: 360,
      easing: 'cubic-bezier(0.22, 0.61, 0.36, 1)'
    }
  );
}

function openModal(member, sourceCard = null) {
  const modal = document.getElementById('profileModal');
  if (!modal) return;

  document.getElementById('modalAvatar').src = getText(member.avatar, 'https://via.placeholder.com/600x400?text=Rotaract+Member');
  document.getElementById('modalAvatar').alt = member.name || 'Rotaract member';
  document.getElementById('profileName').textContent = getText(member.name);
  document.getElementById('modalPost').textContent = `Post: ${getText(member.role)}`;
  document.getElementById('modalDepartment').textContent = `Department: ${getText(member.department)}`;
  document.getElementById('modalBoard').textContent = `Board: ${getText(member.board)}`;
  document.getElementById('modalQuote').textContent = getText(member.quote, 'No quote added yet.');
  document.getElementById('modalWork').textContent = getText(member.work, 'No work description available.');

  const skillsWrap = document.getElementById('modalSkills');
  const skills = normalizeSkills(member.skills);
  skillsWrap.innerHTML = skills.length
    ? skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')
    : '<span class="skill-tag">No skills listed</span>';

  modal.classList.remove('hidden');
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');

  requestAnimationFrame(() => {
    animateDialogFromCard(sourceCard);
  });
}

function closeModal() {
  const modal = document.getElementById('profileModal');
  if (!modal) return;

  modal.classList.add('hidden');
  modal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
}

function getStoredAdminPassword() {
  return sessionStorage.getItem(ADMIN_PASSWORD_KEY) || '';
}

function setStoredAdminPassword(password) {
  sessionStorage.setItem(ADMIN_PASSWORD_KEY, password);
}

function clearStoredAdminPassword() {
  sessionStorage.removeItem(ADMIN_PASSWORD_KEY);
}

function setAdminStatus(message, state = '') {
  const authStatus = document.getElementById('authStatus');
  if (!authStatus) return;

  authStatus.textContent = message;
  authStatus.classList.remove('success', 'error');
  if (state) {
    authStatus.classList.add(state);
  }
}

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

function getAdminHeaders() {
  const password = getStoredAdminPassword();
  if (!password) return null;

  return {
    'Content-Type': 'application/json',
    'x-admin-password': password
  };
}

async function fetchMembersForUser() {
  const loadingState = document.getElementById('loadingState');
  const emptyState = document.getElementById('emptyState');
  const memberGrid = document.getElementById('memberGrid');

  const searchInput = document.getElementById('searchInput');
  const boardFilter = document.getElementById('boardFilter');
  const roleFilter = document.getElementById('roleFilter');

  try {
    if (loadingState) loadingState.classList.remove('hidden');
    if (emptyState) emptyState.classList.add('hidden');

    const query = new URLSearchParams({
      q: searchInput.value.trim(),
      board: boardFilter.value,
      role: roleFilter.value
    });

    const response = await fetch(`${API_BASE_URL}/members/search?${query.toString()}`);
    if (!response.ok) {
      showToast('Unable to fetch members. Make sure the backend is running and PostgreSQL is configured.', true);
      return;
    }

    const members = await response.json();
    renderMembers(members, memberGrid, emptyState);
  } catch (error) {
    showToast(error.message, true);
  } finally {
    if (loadingState) loadingState.classList.add('hidden');
  }
}

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
      <p class="board-section__count">${groupedMembers.get(boardName).length} member(s)</p>
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

function createMemberCard(member, index) {
  const card = document.createElement('article');
  card.className = 'member-card';
  card.tabIndex = 0;
  card.style.setProperty('--stagger', `${index * 45}ms`);

  card.innerHTML = `
    <div class="member-card__media">
      <img class="avatar" src="${getText(member.avatar, 'https://via.placeholder.com/300x200?text=Rotaract+Member')}" alt="${member.name}" />
      <div class="member-card__content">
        <h3>${member.name}</h3>
        <p class="member-card__role">${member.role}</p>
      </div>
    </div>
    <p class="post-pill">${member.role}</p>
    <p class="meta">Board: ${getText(member.board)}</p>
    <div class="social-links">
      ${member.linkedin ? `<a href="${member.linkedin}" target="_blank" rel="noreferrer">LinkedIn</a>` : ''}
      ${member.email ? `<a href="mailto:${member.email}">Email</a>` : ''}
    </div>
  `;

  card.addEventListener('click', event => {
    if (event.target.closest('a')) return;

    card.classList.add('is-clicked');
    setTimeout(() => {
      card.classList.remove('is-clicked');
      openModal(member, card);
    }, 90);
  });

  card.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openModal(member, card);
    }
  });

  return card;
}

function renderStats(members) {
  const stats = document.getElementById('stats');
  if (!stats) return;

  const posts = new Set(members.map(member => member.role));
  const boards = new Set(members.map(member => member.board).filter(Boolean));

  const data = [
    { label: 'Total Members', value: members.length },
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

function fillFilterOptions(members) {
  const boardFilter = document.getElementById('boardFilter');
  const roleFilter = document.getElementById('roleFilter');

  if (!boardFilter || !roleFilter) return;

  const boards = [...new Set(members.map(member => member.board).filter(Boolean))].sort();
  const roles = [...new Set(members.map(member => member.role).filter(Boolean))].sort();

  boards.forEach(board => {
    const option = document.createElement('option');
    option.value = board;
    option.textContent = board;
    boardFilter.appendChild(option);
  });


  roles.forEach(role => {
    const option = document.createElement('option');
    option.value = role;
    option.textContent = role;
    roleFilter.appendChild(option);
  });
}

async function initializeUserPage() {
  const searchInput = document.getElementById('searchInput');
  if (!searchInput) return;

  setupModalHandlers();

  try {
    const response = await fetch(`${API_BASE_URL}/members`);
    if (!response.ok) {
      showToast('Unable to load initial member data.', true);
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

  ['boardFilter', 'roleFilter'].forEach(id => {
    const element = document.getElementById(id);
    if (element) {
      element.addEventListener('change', fetchMembersForUser);
    }
  });
}

async function initializeAdminPage() {
  const memberForm = document.getElementById('memberForm');
  if (!memberForm) return;

  const memberIdField = document.getElementById('memberId');
  const adminLoading = document.getElementById('adminLoading');
  const adminPasswordInput = document.getElementById('adminPassword');
  const unlockAdminBtn = document.getElementById('unlockAdminBtn');

  const fields = {
    name: document.getElementById('name'),
    role: document.getElementById('role'),
    department: document.getElementById('department'),
    board: document.getElementById('board'),
    linkedin: document.getElementById('linkedin'),
    email: document.getElementById('email'),
    avatar: document.getElementById('avatar'),
    quote: document.getElementById('quote'),
    skills: document.getElementById('skills'),
    work: document.getElementById('work')
  };

  const resetForm = () => {
    memberIdField.value = '';
    memberForm.reset();
  };

  const loadAdminMembers = async () => {
    try {
      adminLoading.classList.remove('hidden');

      const response = await fetch(`${API_BASE_URL}/members`);
      if (!response.ok) {
        showToast('Unable to fetch members for admin panel. Start the backend and ensure PostgreSQL is running.', true);
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
    setAdminStatus('Unlocked. You can now add, edit, and delete members.', 'success');
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
    fields.department.value = member.department || '';
    fields.board.value = member.board || '';
    fields.linkedin.value = member.linkedin || '';
    fields.email.value = member.email || '';
    fields.avatar.value = member.avatar || '';
    fields.quote.value = member.quote || '';
    fields.skills.value = normalizeSkills(member.skills).join(', ');
    fields.work.value = member.work || '';

    showToast(`Editing ${member.name}`);
  };

  const getProtectedHeaders = () => getAdminHeaders();

  const onDeleteClick = async id => {
    if (!getStoredAdminPassword()) {
      showToast('Unlock the admin panel first.', true);
      return;
    }

    const yes = window.confirm('Delete this member? This cannot be undone.');
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

      showToast('Member deleted successfully.');
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
      department: fields.department.value.trim(),
      board: fields.board.value.trim(),
      linkedin: fields.linkedin.value.trim(),
      email: fields.email.value.trim(),
      avatar: fields.avatar.value.trim(),
      quote: fields.quote.value.trim(),
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

      showToast(isEditing ? 'Member updated successfully.' : 'Member added successfully.');
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

function renderAdminTable(members, onEditClick, onDeleteClick) {
  const tbody = document.getElementById('memberTableBody');
  if (!tbody) return;

  tbody.innerHTML = '';

  members.forEach(member => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${member.name}</td>
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

initializeUserPage();
initializeAdminPage();

