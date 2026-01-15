const photoInput = document.getElementById("photo");
const photoLabel = document.getElementById("photo-label");
const avatar = document.getElementById("avatar");

const fields = {
  name: {
    input: document.getElementById("name"),
    preview: document.getElementById("preview-name"),
    fallback: "Your Name",
  },
  pronouns: {
    input: document.getElementById("pronouns"),
    preview: document.getElementById("preview-pronouns"),
    fallback: "",
  },
  location: {
    input: document.getElementById("location"),
    preview: document.getElementById("preview-location"),
    fallback: "Location",
  },
  distance: {
    input: document.getElementById("distance"),
    preview: document.getElementById("preview-distance"),
    fallback: "",
    formatter: (value) =>
      value ? `Looking for someone ≤ ${value} km` : "",
  },
  experienceYears: {
    input: document.getElementById("experience-years"),
    preview: document.getElementById("preview-level"),
    fallback: "Junior dater with 0 years of experience",
    formatter: (value) => {
      const years = Number(value);
      const safeYears = Number.isFinite(years) ? Math.max(0, years) : 0;
      const yearLabel = safeYears === 1 ? "1 year" : `${safeYears} years`;
      if (safeYears < 2) {
        return `Junior dater with ${yearLabel} of exp.`;
      }
      if (safeYears <= 6) {
        return `Mid-level dater with ${yearLabel} of exp.`;
      }
      return `Senior dater with ${yearLabel} of exp.`;
    },
  },
  age: {
    input: document.getElementById("age"),
    preview: document.getElementById("preview-age"),
    fallback: "Age",
    formatter: (value) => (value ? `Age ${value}` : "Age"),
  },
  height: {
    input: document.getElementById("height"),
    preview: document.getElementById("preview-height"),
    fallback: "Height",
  },
  education: {
    input: document.getElementById("education"),
    preview: document.getElementById("preview-education"),
    fallback: "",
  },
  zodiac: {
    input: document.getElementById("zodiac"),
    preview: document.getElementById("preview-zodiac"),
    fallback: "Zodiac",
  },
};

const listFields = {
  songs: {
    input: document.getElementById("songs"),
    preview: document.getElementById("preview-songs"),
    fallback: [],
  },
  artists: {
    input: document.getElementById("artists"),
    preview: document.getElementById("preview-artists"),
    fallback: [],
  },
};

const skillsInput = document.getElementById("skills");
const skillsPreview = document.getElementById("preview-skills");
const experienceList = document.getElementById("experience-list");
const addExperienceButton = document.getElementById("add-experience");
const experiencePreview = document.getElementById("preview-relationship-experience");
const relationshipSummary = document.getElementById("preview-relationship-summary");
const downloadButton = document.getElementById("download-pdf");
const downloadButtonPreview = document.getElementById("download-pdf-preview");
const linksPrimary = document.getElementById("preview-links-primary");
const linksSecondary = document.getElementById("preview-links-secondary");
const bannerLinkSelect = document.getElementById("banner-link");
const profileCodeInput = document.getElementById("profile-code");
const randomizeResumeButton = document.getElementById("randomize-resume");
const randomizeNote = document.getElementById("randomize-note");
const saveProgressButton = document.getElementById("save-progress");
const importCodeButton = document.getElementById("import-code");
const shareLinkedInButton = document.getElementById("share-linkedin");
const shareLinkedInNote = document.getElementById("share-linkedin-note");
const shareLinkWrap = document.getElementById("share-link");
const shareUrlInput = document.getElementById("share-url");
const copyShareUrlButton = document.getElementById("copy-share-url");
const getShareLinkButton = document.getElementById("get-share-link");
const shareLinkError = document.getElementById("share-link-error");
const removePhotoButton = document.getElementById("remove-photo");
const photoHint = document.getElementById("photo-hint");
const coverName = document.getElementById("cover-name");
const coverLink = document.getElementById("cover-link");
const previewPanel = document.querySelector(".preview-panel");
const previewActions = document.querySelector(".preview-actions");
const resumeStage = document.getElementById("resume-stage");

const linkedinInput = document.getElementById("linkedin");
const githubInput = document.getElementById("github");
const websiteInput = document.getElementById("website");
const instagramInput = document.getElementById("instagram");
const randomizeButton = document.getElementById("randomize-profile");

let relationshipCounter = 0;
let hasUserUploadedPhoto = false;
let randomizeNoteDismissed = false;

const monthMap = {
  jan: 0,
  feb: 1,
  mar: 2,
  apr: 3,
  may: 4,
  jun: 5,
  jul: 6,
  aug: 7,
  sep: 8,
  oct: 9,
  nov: 10,
  dec: 11,
};

const setText = (element, value, fallback) => {
  element.textContent = value || fallback;
};

const characterAssetFiles = [
  "duck.png",
  "duck2.png",
  "cat.png",
  "cat2.png",
  "croco.png",
  "croco2.png",
  "flappy bird.png",
  "flappy bird2.png",
  "hipster whale.png",
  "hipster whale2.png",
  "koala.png",
  "koala2.png",
  "nyan cat.png",
  "nyan cat2.png",
  "penguin.png",
  "penguin2.png",
  "pig.png",
  "pig2.png",
  "platypus.png",
  "platypus2.png",
  "puffer.png",
  "puffer2.png",
  "shark.png",
  "shark2.png",
  "snail.png",
  "snail2.png",
  "unicorn.png",
  "unicorn2.png",
  "whale.png",
  "whale2.png",
];

const characterAssets = characterAssetFiles.map((file) => `character-assets/${file}`);
const frontCharacterAssets = characterAssets.filter((_, index) => index % 2 === 0);

const getDefaultCharacterAsset = () => frontCharacterAssets[0] || characterAssets[0];

const formatCharacterLabel = (src) => {
  const base = src.split("/").pop()?.replace(/\.[^.]+$/, "") || src;
  return base.replace(/([a-z])(\d+)/gi, "$1 $2").replace(/(^|\\s)\\w/g, (m) => m.toUpperCase());
};

const updateCharacterLabel = (src) => {
  if (!photoLabel) {
    return;
  }
  photoLabel.textContent = formatCharacterLabel(src);
};

const populateCharacterSelect = () => {
  if (!photoInput) {
    return;
  }
  photoInput.min = "0";
  photoInput.max = String(Math.max(frontCharacterAssets.length - 1, 0));
  photoInput.step = "1";
  photoInput.value = "0";
  updateCharacterLabel(getDefaultCharacterAsset());
};

const getSelectedCharacterAsset = () => {
  if (!photoInput) {
    return getDefaultCharacterAsset();
  }
  const index = Number.parseInt(photoInput.value, 10);
  if (Number.isNaN(index) || !frontCharacterAssets[index]) {
    return getDefaultCharacterAsset();
  }
  return frontCharacterAssets[index];
};

const setSelectedCharacterAsset = (src) => {
  if (!photoInput) {
    return;
  }
  const index = frontCharacterAssets.indexOf(src);
  photoInput.value = String(index >= 0 ? index : 0);
  updateCharacterLabel(frontCharacterAssets[index >= 0 ? index : 0]);
};

const getAvatarText = () => {
  if (avatar.querySelector("img")) {
    return "";
  }
  return avatar.textContent.trim();
};

const ensureAvatarBadge = () => {
  if (!avatar.querySelector(".avatar-date")) {
    const badge = document.createElement("span");
    badge.className = "avatar-date";
    badge.textContent = "DATE";
    avatar.appendChild(badge);
  }
};

const getAvatarInitials = (name) =>
  name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0].toUpperCase())
    .join("");

const setAvatarText = (text) => {
  const value = text.trim();
  if (!value) {
    updateAvatarPlaceholder();
    return;
  }
  const isHint = value.toLowerCase() === "upload a photo";
  const className = isHint ? "avatar-hint" : "avatar-initials";
  avatar.innerHTML = `<span class="${className}">${value}</span>`;
  ensureAvatarBadge();
};

const updateAvatarPlaceholder = () => {
  if (avatar.querySelector("img")) {
    return;
  }
  const img = document.createElement("img");
  img.src = getDefaultCharacterAsset();
  img.alt = "Profile character";
  avatar.innerHTML = "";
  avatar.appendChild(img);
  ensureAvatarBadge();
};

populateCharacterSelect();

const parseMonthYear = (value) => {
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  const isoMatch = trimmed.match(/^(\d{4})-(\d{2})$/);
  if (isoMatch) {
    const year = Number(isoMatch[1]);
    const monthIndex = Number(isoMatch[2]) - 1;
    if (monthIndex >= 0 && monthIndex <= 11) {
      return { year, month: monthIndex };
    }
  }

  const wordMatch = trimmed.match(/^([A-Za-z]+)\s+(\d{4})$/);
  if (wordMatch) {
    const key = wordMatch[1].slice(0, 3).toLowerCase();
    const year = Number(wordMatch[2]);
    if (Object.prototype.hasOwnProperty.call(monthMap, key)) {
      return { year, month: monthMap[key] };
    }
  }

  return null;
};

const monthsBetween = (startValue, endValue) => {
  const start = parseMonthYear(startValue);
  if (!start) {
    return null;
  }

  const endText = endValue.trim();
  const end = !endText || /present/i.test(endText)
    ? (() => {
        const now = new Date();
        return { year: now.getFullYear(), month: now.getMonth() };
      })()
    : parseMonthYear(endText);

  if (!end) {
    return null;
  }

  const totalMonths = (end.year - start.year) * 12 + (end.month - start.month) + 1;
  if (totalMonths < 1) {
    return null;
  }
  return totalMonths;
};

const formatMonths = (months) => {
  if (!months) {
    return null;
  }
  if (months < 12) {
    return months === 1 ? "1 month" : `${months} months`;
  }
  const years = Math.floor(months / 12);
  const remainder = months % 12;
  const yearLabel = years === 1 ? "1 year" : `${years} years`;
  if (!remainder) {
    return yearLabel;
  }
  const monthLabel = remainder === 1 ? "1 month" : `${remainder} months`;
  return `${yearLabel} ${monthLabel}`;
};

const getRelationshipType = (roles) => {
  const types = roles.map((role) => role.type).filter(Boolean);
  if (types.includes("marriage")) {
    return "marriage";
  }
  if (types.includes("relationship")) {
    return "relationship";
  }
  if (types.includes("other")) {
    return "other";
  }
  return "relationship";
};

const formatRoleType = (type) => {
  if (!type) {
    return "Relationship";
  }
  if (type === "other") {
    return "Talking stage";
  }
  if (type === "coparent") {
    return "Co-parent";
  }
  if (type === "polygamous") {
    return "Polygamous relationship";
  }
  if (type === "sneaky") {
    return "Sneaky link";
  }
  if (type === "eyecontactship") {
    return "Eyecontactship";
  }
  if (type === "emotional") {
    return "Emotional situationship";
  }
  if (type === "bestfriend") {
    return "Neighbour";
  }
  return type.charAt(0).toUpperCase() + type.slice(1);
};

const getSentenceType = (type) => {
  return type === "marriage" ? "marriage" : "relationship";
};

const createRoleCard = (relationshipId, roleNumber) => {
  const role = document.createElement("div");
  role.className = "role-card";
  role.dataset.roleId = String(roleNumber);
  role.innerHTML = `
    <div class="role-header">
      <h5>Role ${roleNumber}</h5>
      <button type="button" class="btn-link" data-remove-role>Remove role</button>
    </div>
    <div class="field">
      <label>Stage</label>
      <select data-role-field="type">
        <option value="relationship">Relationship</option>
        <option value="coparent">Co-parent</option>
        <option value="polygamous">Polygamous relationship</option>
        <option value="sneaky">Sneaky link</option>
        <option value="eyecontactship">Eyecontactship</option>
        <option value="emotional">Emotional situationship</option>
        <option value="marriage">Marriage</option>
        <option value="other">Talking stage</option>
        <option value="bestfriend">Neighbour</option>
      </select>
    </div>
    <div class="field-group">
      <div class="field">
        <label>Start date</label>
        <input type="text" data-role-field="start" placeholder="Jan 2024" />
      </div>
      <div class="field">
        <label>End date</label>
        <input type="text" data-role-field="end" placeholder="Present" />
      </div>
    </div>
    <div class="field">
      <label>What you learned (no negative comments about them)</label>
      <input type="text" data-role-field="summary" placeholder="Learned how to communicate better" />
    </div>
    <div class="field-group">
      <div class="field" data-role-location>
        <label>City</label>
        <input type="text" data-role-field="location" placeholder="Toronto" />
      </div>
      <div class="field checkbox-row">
        <input type="checkbox" data-role-field="remote" id="remote-${relationshipId}-${roleNumber}" />
        <label for="remote-${relationshipId}-${roleNumber}">Remote</label>
      </div>
    </div>
  `;
  return role;
};

const reorderRoleCards = (card) => {
  const roleList = card.querySelector("[data-role-list]");
  if (!roleList) {
    return;
  }
  const roles = Array.from(roleList.querySelectorAll(".role-card"));
  roles
    .sort((a, b) => Number(b.dataset.roleId || "0") - Number(a.dataset.roleId || "0"))
    .forEach((role) => roleList.appendChild(role));
};

const syncRoleCardIds = (card) => {
  const relationshipId = card.dataset.relationshipId;
  Array.from(card.querySelectorAll(".role-card")).forEach((role) => {
    const roleId = role.dataset.roleId;
    const title = role.querySelector(".role-header h5");
    if (title) {
      title.textContent = `Role ${roleId}`;
    }
    const remoteInput = role.querySelector('[data-role-field="remote"]');
    const remoteLabel = role.querySelector('label[for^="remote-"]');
    if (remoteInput && remoteLabel) {
      const nextId = `remote-${relationshipId}-${roleId}`;
      remoteInput.id = nextId;
      remoteLabel.setAttribute("for", nextId);
    }
  });
};

const updateRelationshipCardId = (card, nextId) => {
  card.dataset.relationshipId = String(nextId);
  const label = card.querySelector(".relationship-label");
  if (label) {
    label.textContent = `Relationship ${nextId}`;
  }
  const appUsedInput = card.querySelector('[data-field="appUsed"]');
  const appUsedLabel = card.querySelector('label[for^="app-used-"]');
  if (appUsedInput && appUsedLabel) {
    const nextAppId = `app-used-${nextId}`;
    appUsedInput.id = nextAppId;
    appUsedLabel.setAttribute("for", nextAppId);
  }
  syncRoleCardIds(card);
  const personInput = card.querySelector('[data-field="person"]');
  if (personInput) {
    const selected = personInput.value;
    const options = getPersonOptions(nextId);
    const normalized = selected
      ? normalizePersonSelection(selected, nextId)
      : options[2];
    personInput.innerHTML = options
      .map((option) => `<option value="${option}">${option}</option>`)
      .join("");
    personInput.value = options.includes(normalized) ? normalized : options[2];
  }
};

const reorderRelationshipCards = () => {
  const cards = Array.from(experienceList.querySelectorAll(".experience-card"));
  cards
    .sort(
      (a, b) =>
        Number(b.dataset.relationshipId || "0") - Number(a.dataset.relationshipId || "0")
    )
    .forEach((card) => experienceList.appendChild(card));
};

const createExperienceCard = () => {
  relationshipCounter += 1;
  const wrapper = document.createElement("div");
  wrapper.className = "experience-card";
  wrapper.dataset.relationshipId = String(relationshipCounter);
  wrapper.dataset.roleCount = "0";
  wrapper.innerHTML = `
    <div class="experience-header">
      <h4 class="relationship-label">Relationship ${relationshipCounter}</h4>
      <button type="button" class="btn-link" data-remove>Remove</button>
    </div>
    <div class="field">
      <label>Person</label>
      <select data-field="person">
        ${getPersonOptions(relationshipCounter)
          .map((option) => `<option value="${option}">${option}</option>`)
          .join("")}
      </select>
    </div>
    <div class="checkbox-row">
      <input type="checkbox" data-field="appUsed" id="app-used-${relationshipCounter}" />
      <label for="app-used-${relationshipCounter}">
        <span data-app-label>Hinge/Tinder/Bumble/other app helped me land this relationship</span>
      </label>
    </div>
    <div class="field-group app-fields is-hidden" data-app-fields>
      <div class="field">
        <label>App</label>
        <select data-field="appName">
          <option value="">Select one</option>
          <option value="Hinge">Hinge</option>
          <option value="Tinder">Tinder</option>
          <option value="Bumble">Bumble</option>
          <option value="Other">Other</option>
        </select>
      </div>
      <div class="field is-hidden">
        <label>Other app</label>
        <input type="text" data-field="appOther" placeholder="Coffee Meets Bagel" />
      </div>
    </div>
    <div class="experience-controls">
      <button type="button" class="btn-outline" data-add-role>Add role</button>
    </div>
    <div class="role-list" data-role-list></div>
  `;

  const roleList = wrapper.querySelector("[data-role-list]");
  wrapper.dataset.roleCount = "1";
  roleList.appendChild(createRoleCard(relationshipCounter, 1));
  return wrapper;
};

const getRelationshipData = () => {
  const cards = Array.from(experienceList.querySelectorAll(".experience-card"));
  return cards.map((card) => {
    const getValue = (selector) => card.querySelector(selector)?.value.trim() || "";
    const appUsed = card.querySelector('[data-field="appUsed"]')?.checked || false;
    const appName = getValue('[data-field="appName"]');
    const appOther = getValue('[data-field="appOther"]');

    const roles = Array.from(card.querySelectorAll(".role-card")).map((role) => {
      const getRoleValue = (selector) => role.querySelector(selector)?.value.trim() || "";
      return {
        type: getRoleValue('[data-role-field="type"]'),
        start: getRoleValue('[data-role-field="start"]'),
        end: getRoleValue('[data-role-field="end"]'),
        summary: getRoleValue('[data-role-field="summary"]'),
        location: getRoleValue('[data-role-field="location"]'),
        remote: role.querySelector('[data-role-field="remote"]')?.checked || false,
      };
    });

    const person = getValue('[data-field="person"]');

    return {
      person,
      appUsed,
      appName,
      appOther,
      roles,
    };
  });
};

const updateRelationshipSummary = (relationships) => {
  const marriedPeople = relationships
    .filter((item) => getRelationshipType(item.roles) === "marriage")
    .map((item) => item.person)
    .filter(Boolean);
  const primaryMarried = marriedPeople[0] || "";
  const additionalMarried = marriedPeople.slice(1);
  const people = relationships
    .filter((item) => getRelationshipType(item.roles) !== "marriage")
    .map((item) => item.person)
    .filter(Boolean)
    .concat(additionalMarried);

  const normalizePerson = (value) =>
    value
      .toLowerCase()
      .replace(/\b(some|another)\b/g, "")
      .replace(/\s+/g, " ")
      .trim();

  const formatPeopleList = (list) => {
    if (!list.length) {
      return "N/A";
    }
    const normalized = list.map(normalizePerson).filter(Boolean);
    const counts = normalized.reduce((acc, person) => {
      acc[person] = (acc[person] || 0) + 1;
      return acc;
    }, {});
    const indices = Object.keys(counts).reduce((acc, person) => {
      acc[person] = 0;
      return acc;
    }, {});
    return normalized
      .map((person) => {
        if (counts[person] > 1) {
          indices[person] += 1;
          return `${person}${indices[person]}`;
        }
        return person;
      })
      .join(", ");
  };

  const applySharedIndices = (prevList, marriedList) => {
    const combined = prevList.concat(marriedList);
    if (!combined.length) {
      return { prevText: "N/A", marriedText: "N/A" };
    }
    const normalized = combined.map(normalizePerson).filter(Boolean);
    const counts = normalized.reduce((acc, person) => {
      acc[person] = (acc[person] || 0) + 1;
      return acc;
    }, {});
    const indices = Object.keys(counts).reduce((acc, person) => {
      acc[person] = 0;
      return acc;
    }, {});

    const withIndices = normalized.map((person) => {
      if (counts[person] > 1) {
        indices[person] += 1;
        return `${person}${indices[person]}`;
      }
      return person;
    });

    const prevLabels = withIndices.slice(0, prevList.length);
    const marriedLabels = withIndices.slice(prevList.length);
    return {
      prevText: prevLabels.length ? prevLabels.join(", ") : "N/A",
      marriedText: marriedLabels.length ? marriedLabels.join(", ") : "N/A",
    };
  };

  const { prevText, marriedText } = applySharedIndices(
    people,
    primaryMarried ? [primaryMarried] : []
  );
  relationshipSummary.textContent = `Married @ ${marriedText} | Prev @ ${prevText}`;
};

const updateLinksPreview = () => {
  const linkedin = linkedinInput.value.trim();
  const github = githubInput.value.trim();
  const website = websiteInput.value.trim();
  const instagram = instagramInput.value.trim();

  linksPrimary.innerHTML = "";
  linksSecondary.innerHTML = "";

  const primaryLinks = [];
  if (linkedin) {
    primaryLinks.push({
      label: `linkedin.com/in/${linkedin}/`,
      href: `https://www.linkedin.com/in/${linkedin}/`,
    });
  }
  if (github) {
    primaryLinks.push({
      label: `github.com/${github}`,
      href: `https://github.com/${github}`,
    });
  }

  primaryLinks.forEach((link, index) => {
    const anchor = document.createElement("a");
    anchor.href = link.href;
    anchor.textContent = link.label;
    anchor.target = "_blank";
    anchor.rel = "noreferrer";
    linksPrimary.appendChild(anchor);
    if (index < primaryLinks.length - 1) {
      const separator = document.createElement("span");
      separator.textContent = " · ";
      linksPrimary.appendChild(separator);
    }
  });

  if (website) {
    const anchor = document.createElement("a");
    anchor.href = `https://${website}`;
    anchor.textContent = `https://${website}`;
    anchor.target = "_blank";
    anchor.rel = "noreferrer";
    linksSecondary.appendChild(anchor);
  }

  if (instagram) {
    if (website) {
      const separator = document.createElement("span");
      separator.textContent = " · ";
      linksSecondary.appendChild(separator);
    }
    const anchor = document.createElement("a");
    anchor.href = `https://www.instagram.com/${instagram}/`;
    anchor.textContent = `instagram.com/${instagram}`;
    anchor.target = "_blank";
    anchor.rel = "noreferrer";
    linksSecondary.appendChild(anchor);
  }
};

const updateAppLabel = (card) => {
  const roles = Array.from(card.querySelectorAll(".role-card")).map((role) => {
    const getRoleValue = (selector) => role.querySelector(selector)?.value.trim() || "";
    return {
      type: getRoleValue('[data-role-field="type"]'),
    };
  });
  const type = getRelationshipType(roles);
  const label = card.querySelector("[data-app-label]");
  if (label) {
    label.textContent = `Hinge/Tinder/Bumble/other app helped me land this ${getSentenceType(type)}`;
  }
};

const renderExperiencePreview = () => {
  const relationships = getRelationshipData().filter((item) => {
    const hasRole = item.roles.some((role) =>
      [role.type, role.start, role.end, role.summary, role.location].some(Boolean)
    );
    return [item.person].some(Boolean) || hasRole || item.appUsed;
  });

  experiencePreview.innerHTML = "";
  updateRelationshipSummary(relationships);

  if (!relationships.length) {
    experiencePreview.innerHTML = `<p class="experience-meta">Add relationship entries to show them here.</p>`;
    return;
  }

  relationships.forEach((item) => {
    const wrapper = document.createElement("div");
    wrapper.className = "experience-item";

    const relationshipType = getRelationshipType(item.roles);
    const sentenceType = getSentenceType(relationshipType);
    let appLine = "";
    if (item.appUsed) {
      if (item.appName === "Other") {
        appLine = `Dating app helped me land this ${sentenceType}`;
      } else {
        const appName = item.appName;
        appLine = appName
          ? `${appName} helped me land this ${sentenceType}`
          : `Dating app helped me land this ${sentenceType}`;
      }
    }

    const rolesMarkup = item.roles
      .filter((role) => [role.type, role.start, role.end, role.summary, role.location].some(Boolean))
      .map((role) => {
        const dateLine = [role.start, role.end].filter(Boolean).join(" – ") || "Dates";
        const duration = formatMonths(monthsBetween(role.start, role.end));
        const locationLine = role.remote ? "Remote" : role.location;
        return `
          <div class="preview-role-item">
            <div class="preview-role-title">${formatRoleType(role.type)}</div>
            <div class="preview-role-meta">${dateLine}</div>
            ${locationLine ? `<div class="preview-role-meta">${locationLine}</div>` : ""}
            ${role.summary ? `<div class="experience-summary">${role.summary}</div>` : ""}
            ${duration ? `<div class="preview-role-duration">${duration}</div>` : ""}
          </div>
        `;
      })
      .join("");

    wrapper.innerHTML = `
      <h4>${item.person || "Relationship"}</h4>
      ${appLine ? `<span class="experience-pill">${appLine}</span>` : ""}
      ${rolesMarkup ? `<div class="preview-role-list">${rolesMarkup}</div>` : ""}
    `;

    experiencePreview.appendChild(wrapper);
  });
};

const normalizeEducation = (value) => value.replace(/—/g, "@");

let resumeScaleRaf = null;

const updateResumeScrollState = () => {
  if (!resumeStage) {
    return;
  }
  const hasScrollbar = resumeStage.scrollHeight > resumeStage.clientHeight + 1;
  resumeStage.classList.toggle("no-scroll", !hasScrollbar);
};

const updateResumeScale = () => {
  if (!resumeStage || !resume) {
    return;
  }
  resume.style.transform = "";
  updateResumeScrollState();
};

const scheduleResumeScale = () => {
  if (resumeScaleRaf) {
    return;
  }
  resumeScaleRaf = window.requestAnimationFrame(() => {
    resumeScaleRaf = null;
    updateResumeScale();
  });
};

const updatePreviewActionsVisibility = () => {
  if (!previewActions) {
    return;
  }
  const shouldShow = window.scrollY > 120;
  previewActions.classList.toggle("is-visible", shouldShow);
};

const updateFields = () => {
  Object.values(fields).forEach(({ input, preview, fallback, formatter }) => {
    let value = input.value.trim();
    if (input === fields.education.input) {
      const normalized = normalizeEducation(value);
      if (normalized !== value) {
        input.value = normalized;
        value = normalized;
      }
    }
    if (formatter) {
      preview.textContent = formatter(value);
      return;
    }
    setText(preview, value, fallback);
  });

  const pronounsValue = fields.pronouns.input.value.trim();
  if (pronounsValue) {
    fields.pronouns.preview.textContent = `(${pronounsValue})`;
    fields.pronouns.preview.classList.remove("is-hidden");
  } else {
    fields.pronouns.preview.textContent = "";
    fields.pronouns.preview.classList.add("is-hidden");
  }

  const distanceValue = fields.distance.input.value.trim();
  if (distanceValue) {
    fields.distance.preview.textContent = fields.distance.formatter(distanceValue);
    fields.distance.preview.classList.remove("is-hidden");
  } else {
    fields.distance.preview.textContent = "";
    fields.distance.preview.classList.add("is-hidden");
  }

  Object.values(listFields).forEach(({ input, preview, fallback }) => {
    const items = input.value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    preview.innerHTML = "";
    if (!items.length) {
      return;
    }
    items.forEach((item) => {
      const chip = document.createElement("span");
      chip.className = "chip";
      chip.textContent = item;
      preview.appendChild(chip);
    });
  });

  const skills = skillsInput.value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  skillsPreview.innerHTML = "";
  if (skills.length) {
    skills.forEach((skill) => {
      const chip = document.createElement("span");
      chip.className = "chip";
      chip.textContent = skill;
      skillsPreview.appendChild(chip);
    });
  }

  Array.from(experienceList.querySelectorAll(".experience-card")).forEach((card) => {
    updateAppLabel(card);
  });

  updateLinksPreview();
  renderExperiencePreview();
  updateDocumentTitles();
  updateAvatarPlaceholder();
  updateCoverContent();
  scheduleResumeScale();
};

const updateDocumentTitles = () => {
  const name = fields.name.input.value.trim();
  const title = name ? `${name}'s Dating Profile` : "Your Dating Profile";
  document.title = title;
  const pdfTitle = document.getElementById("pdf-title");
  if (pdfTitle) {
    pdfTitle.textContent = title;
  }
};

const updateCoverContent = () => {
  if (!coverName || !coverLink) {
    return;
  }
  const name = fields.name.input.value.trim() || "Your Name";
  const selection = bannerLinkSelect?.value || "linkedin";
  let linkText = "linkedin.com/in/yourname";
  if (selection === "github") {
    linkText = githubInput.value.trim()
      ? `github.com/${githubInput.value.trim()}`
      : "github.com/yourname";
  } else if (selection === "website") {
    linkText = websiteInput.value.trim()
      ? `https://${websiteInput.value.trim()}`
      : "yourname.com";
  } else if (selection === "instagram") {
    linkText = instagramInput.value.trim()
      ? `instagram.com/${instagramInput.value.trim()}`
      : "instagram.com/yourname";
  } else {
    linkText = linkedinInput.value.trim()
      ? `linkedin.com/in/${linkedinInput.value.trim()}`
      : "linkedin.com/in/yourname";
  }
  coverName.textContent = name;
  coverLink.textContent = linkText;
};

const randomItem = (list) => list[Math.floor(Math.random() * list.length)];
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomBool = (chance = 0.5) => Math.random() < chance;

const nameData = {
  firstFemale: ["Ava", "Mia", "Luna", "Sofia", "Kathy", "Zoe", "Aria", "Nora", "Layla", "Maya"],
  firstMale: ["Liam", "Noah", "Ethan", "Leo", "Jason", "Caleb", "Daniel", "Kevin", "Ryan", "Lucas"],
  last: ["Xu", "Nguyen", "Patel", "Brooks", "Li", "Kim", "Lopez", "Santos", "Reed", "James"],
};

const profileData = {
  pronouns: ["she/her", "he/him", "they/them", "she/they", "he/they", "ze/zer"],
  cities: [
    "New York",
    "London",
    "Paris",
    "Tokyo",
    "Seoul",
    "Bangkok",
    "Singapore",
    "Hong Kong",
    "Shanghai",
    "Beijing",
    "Mumbai",
    "Dubai",
    "Istanbul",
    "Rome",
    "Barcelona",
    "Berlin",
    "Amsterdam",
    "Vienna",
    "Prague",
    "Athens",
    "Cairo",
    "Nairobi",
    "Cape Town",
    "Lagos",
    "Sao Paulo",
    "Buenos Aires",
    "Mexico City",
    "Toronto",
    "Sydney",
    "Auckland",
  ],
  zodiacs: ["Aquarius", "Leo", "Libra", "Sagittarius", "Taurus", "Gemini", "Virgo", "Scorpio"],
  heights: ["5'4\" or 163 cm", "5'8\" or 173 cm", "5'10\" or 178 cm", "6'0\" or 183 cm"],
  education: [
    "BA Literature @ Boston University",
    "BSc Computer Science @ Western University",
    "MBA @ Harvard Business School",
    "BSc Math @ University of Toronto",
  ],
  skills: [
  "Listening",
  "Cooking",
  "Honesty",
  "Card magic",
  "Dancing",
  "Chess",
  "Java",
  "Finding food",
  "Texts fast",
  "Machine learning",
  "Python",
  "Wine connosseur",
],
  songs: ["Sofia", "Pink + White", "Dreams", "Motion Sickness", "Golden Hour", "The Less I Know the Better"],
  artists: ["Clairo", "Frank Ocean", "Lorde", "Bad Bunny", "The 1975", "SZA", "Phoebe Bridgers"],
  experienceSummaries: [
    "remove this"
  ],
  roleSummaries: [
    "Learned how to communicate better",
    "Learned to read red flags early",
    "Learned to live together",
    "Learned to balance dating and work",
    "Learned more about their culture",
    "Learned more about my love language",
    "Learned to code together",
  ],
  roleLocations: [
    "New York",
    "London",
    "Paris",
    "Tokyo",
    "Seoul",
    "Bangkok",
    "Singapore",
    "Hong Kong",
    "Shanghai",
    "Beijing",
    "Mumbai",
    "Dubai",
    "Istanbul",
    "Rome",
    "Barcelona",
    "Berlin",
    "Amsterdam",
    "Vienna",
    "Prague",
    "Athens",
    "Cairo",
    "Nairobi",
    "Cape Town",
    "Lagos",
    "Sao Paulo",
    "Buenos Aires",
    "Mexico City",
    "Toronto",
    "Sydney",
    "Auckland",
    "Remote",
  ],
  apps: ["Hinge", "Tinder", "Bumble", "Other", ""],
  appOther: ["Coffee Meets Bagel", "LinkedIn", "Wechat", "OkCupid", "Facebook Marketplace"],
};

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const randomMonthYear = (yearStart, yearEnd) => {
  const year = randomInt(yearStart, yearEnd);
  const month = randomItem(monthNames);
  return `${month} ${year}`;
};

const buildUsername = (name) => name.toLowerCase().replace(/\s+/g, "");

const PERSON_BASE_OPTIONS = ["woman", "man", "nonbinary person"];

const getPersonLabel = (prefix, base) => `${prefix} ${base}`;

const getPersonOptions = (relationshipId) => {
  const prefix = relationshipId > 1 ? "Another" : "Some";
  return PERSON_BASE_OPTIONS.map((base) => getPersonLabel(prefix, base));
};

const normalizePersonSelection = (value, relationshipId) => {
  const lower = value.toLowerCase();
  const prefix = relationshipId > 1 ? "Another" : "Some";
  if (lower.includes("woman")) {
    return getPersonLabel(prefix, "woman");
  }
  if (lower.includes("man") && !lower.includes("woman")) {
    return getPersonLabel(prefix, "man");
  }
  if (lower.includes("nonbinary")) {
    return getPersonLabel(prefix, "nonbinary person");
  }
  return getPersonLabel(prefix, "nonbinary person");
};

const setCardData = (card, data) => {
  const personInput = card.querySelector('[data-field="person"]');
  const appUsedInput = card.querySelector('[data-field="appUsed"]');
  const appFields = card.querySelector("[data-app-fields]");
  const appNameInput = card.querySelector('[data-field="appName"]');
  const appOtherInput = card.querySelector('[data-field="appOther"]');

  if (personInput) {
    const relationshipId = Number(card.dataset.relationshipId || "1");
    const options = getPersonOptions(relationshipId);
    const nextValue = data.person
      ? normalizePersonSelection(data.person, relationshipId)
      : options[2];
    personInput.value = options.includes(nextValue) ? nextValue : options[2];
  }

  appUsedInput.checked = data.appUsed;
  if (data.appUsed) {
    appFields.classList.remove("is-hidden");
    appNameInput.value = data.appName;
    if (data.appName === "Other") {
      appOtherInput.parentElement.classList.remove("is-hidden");
      appOtherInput.value = data.appOther;
    } else {
      appOtherInput.parentElement.classList.add("is-hidden");
      appOtherInput.value = "";
    }
  } else {
    appFields.classList.add("is-hidden");
    appNameInput.value = "";
    appOtherInput.value = "";
    appOtherInput.parentElement.classList.add("is-hidden");
  }

  const roleList = card.querySelector("[data-role-list]");
  roleList.innerHTML = "";
  card.dataset.roleCount = String(data.roles.length);
  data.roles.forEach((role, index) => {
    const roleCard = createRoleCard(card.dataset.relationshipId, index + 1);
    roleList.appendChild(roleCard);
    roleCard.querySelector('[data-role-field="type"]').value = role.type;
    roleCard.querySelector('[data-role-field="start"]').value = role.start;
    roleCard.querySelector('[data-role-field="end"]').value = role.end;
    roleCard.querySelector('[data-role-field="summary"]').value = role.summary;
    const locationInput = roleCard.querySelector('[data-role-field="location"]');
    const remoteInput = roleCard.querySelector('[data-role-field="remote"]');
    const locationField = roleCard.querySelector("[data-role-location]");
    if (role.remote) {
      remoteInput.checked = true;
      locationInput.value = "";
      locationField.classList.add("is-hidden");
    } else {
      remoteInput.checked = false;
      locationField.classList.remove("is-hidden");
      locationInput.value = role.location;
    }
  });
};

const randomizeProfile = () => {
  const isFemaleName = randomBool(0.5);
  const first = isFemaleName ? randomItem(nameData.firstFemale) : randomItem(nameData.firstMale);
  const last = randomItem(nameData.last);
  const name = `${first} ${last}`;
  const username = buildUsername(name);

  hasUserUploadedPhoto = false;
  setSelectedCharacterAsset(randomItem(frontCharacterAssets));
  setShareLinkErrorVisible(false);
  updatePhotoHint();
  updatePhotoHint();

  setAvatarSrc(getSelectedCharacterAsset());
  updateRemovePhotoButton();
  ensureAvatarBadge();

  fields.name.input.value = name;
  fields.pronouns.input.value = randomItem(profileData.pronouns);
  fields.location.input.value = randomItem(profileData.cities);
  fields.distance.input.value = String(randomInt(10, 100));
  fields.experienceYears.input.value = String(randomInt(0, 8));
  fields.age.input.value = String(randomInt(22, 36));
  fields.height.input.value = randomItem(profileData.heights);
  fields.zodiac.input.value = randomItem(profileData.zodiacs);
  fields.education.input.value = randomItem(profileData.education);

  linkedinInput.value = `${username}-${randomInt(1, 99)}`;
  githubInput.value = username;
  websiteInput.value = `${username}.com`;
  instagramInput.value = username;
  if (bannerLinkSelect) {
    bannerLinkSelect.value = randomItem(["linkedin", "github", "website", "instagram"]);
  }

  const pickedSkills = Array.from({ length: randomInt(5, 8) }, () => randomItem(profileData.skills));
  skillsInput.value = Array.from(new Set(pickedSkills)).join(", ");

  const pickedSongs = Array.from({ length: 3 }, () => randomItem(profileData.songs));
  listFields.songs.input.value = pickedSongs.join(", ");

  const pickedArtists = Array.from({ length: 3 }, () => randomItem(profileData.artists));
  listFields.artists.input.value = pickedArtists.join(", ");

  relationshipCounter = 0;
  experienceList.innerHTML = "";
  const relationshipCount = randomInt(1, 2);
  for (let i = 0; i < relationshipCount; i += 1) {
    const card = createExperienceCard();
    experienceList.appendChild(card);

    const personName = randomItem(getPersonOptions(i + 1));
    const rolesCount = randomInt(1, 2);
    const roles = Array.from({ length: rolesCount }, () => {
      const startYear = randomInt(2017, 2022);
      const endYear = randomBool(0.3) ? "" : String(randomInt(startYear + 1, 2024));
      return {
        type: randomItem([
          "relationship",
          "marriage",
          "other",
          "coparent",
          "polygamous",
          "sneaky",
          "eyecontactship",
          "emotional",
          "bestfriend",
        ]),
        start: randomMonthYear(startYear, startYear),
        end: endYear ? `${randomItem(monthNames)} ${endYear}` : "Present",
        summary: randomItem(profileData.roleSummaries),
        location: randomItem(profileData.roleLocations),
        remote: randomBool(0.2),
      };
    });

    const appUsed = randomBool(0.45);
    const appName = appUsed ? randomItem(profileData.apps) : "";
    const appOther = appName === "Other" ? randomItem(profileData.appOther) : "";

    setCardData(card, {
      person: personName,
      appUsed,
      appName,
      appOther,
      roles,
    });
    reorderRoleCards(card);

    const highlight = randomItem(profileData.experienceSummaries);
    const summaryInput = card.querySelector('[data-role-field="summary"]');
    if (summaryInput && !summaryInput.value) {
      summaryInput.value = highlight;
    }
  }

  reorderRelationshipCards();
  updateFields();
};

const getAvatarSrc = () => avatar.querySelector("img")?.src || "";

const setAvatarSrc = (src, avatarText = "") => {
  avatar.innerHTML = "";
  if (!src) {
    const rawName = fields.name.input.value.trim();
    if (rawName) {
      updateAvatarPlaceholder();
    } else if (avatarText) {
      setAvatarText(avatarText);
    } else {
      updateAvatarPlaceholder();
    }
    updatePhotoHint();
    updateRemovePhotoButton();
    ensureAvatarBadge();
    return;
  }
  const img = document.createElement("img");
  img.src = src;
  img.alt = "Profile preview";
  avatar.appendChild(img);
  updateRemovePhotoButton();
  ensureAvatarBadge();
  updatePhotoHint();
};

const setShareLinkErrorVisible = (isVisible) => {
  if (!shareLinkError) {
    return;
  }
  shareLinkError.classList.toggle("is-hidden", !isVisible);
};

const updatePhotoHint = () => {
  if (!photoHint) {
    return;
  }
  if (hasUserUploadedPhoto) {
    photoHint.classList.add("is-hidden");
  } else {
    photoHint.classList.remove("is-hidden");
  }
};

const updateRemovePhotoButton = () => {
  if (!removePhotoButton) {
    return;
  }
  if (avatar.querySelector("img")) {
    removePhotoButton.classList.remove("is-hidden");
  } else {
    removePhotoButton.classList.add("is-hidden");
  }
};

const isInAppBrowser = () => {
  const ua = navigator.userAgent || "";
  return /FBAN|FBAV|Instagram|Line|Twitter|LinkedIn|Snapchat|Pinterest|TikTok|WhatsApp|Messenger/i.test(ua);
};

const removeUploadedPhotoForShare = () => {
  if (!hasUserUploadedPhoto) {
    return;
  }
  setSelectedCharacterAsset(getDefaultCharacterAsset());
  setAvatarSrc(getSelectedCharacterAsset());
  hasUserUploadedPhoto = false;
  setShareLinkErrorVisible(false);
  updateRemovePhotoButton();
  updatePhotoHint();
  updateFields();
};

const SHARE_BASE_URL = `${window.location.origin}${window.location.pathname}`;
const SHARE_HASH_PREFIX = "p=";

const encodeProfilePayload = (payload) => {
  if (window.LZString?.compressToEncodedURIComponent) {
    return window.LZString.compressToEncodedURIComponent(JSON.stringify(payload));
  }
  return btoa(encodeURIComponent(JSON.stringify(payload)));
};

const decodeProfilePayload = (encoded) => {
  if (window.LZString?.decompressFromEncodedURIComponent) {
    const json = window.LZString.decompressFromEncodedURIComponent(encoded);
    if (json) {
      return JSON.parse(json);
    }
  }
  const json = decodeURIComponent(atob(encoded));
  return JSON.parse(json);
};

const resetShareLink = () => {
  if (!shareLinkWrap || !shareUrlInput) {
    return;
  }
  shareLinkWrap.classList.add("is-hidden");
  shareUrlInput.value = "";
  setShareLinkErrorVisible(false);
};

const buildShareUrl = ({ print } = {}) => {
  const payload = buildProfilePayload();
  const encoded = encodeProfilePayload(payload);
  const hash = `#${SHARE_HASH_PREFIX}${encoded}${print ? "&print=1" : ""}`;
  return `${SHARE_BASE_URL}${hash}`;
};

const revealShareLink = (options = {}) => {
  if (!shareLinkWrap || !shareUrlInput) {
    return "";
  }
  updateFields();
  let url = "";
  try {
    url = buildShareUrl(options);
    shareUrlInput.value = url;
  } catch (error) {
    console.warn("Unable to build shareable link.", error);
    shareUrlInput.value = "ERROR";
    url = "";
  }
  shareLinkWrap.classList.remove("is-hidden");
  return url;
};

const buildProfilePayload = () => ({
  fields: {
    name: fields.name.input.value.trim(),
    pronouns: fields.pronouns.input.value.trim(),
    location: fields.location.input.value.trim(),
    distance: fields.distance.input.value.trim(),
    experienceYears: fields.experienceYears.input.value.trim(),
    age: fields.age.input.value.trim(),
    height: fields.height.input.value.trim(),
    education: fields.education.input.value.trim(),
    zodiac: fields.zodiac.input.value.trim(),
  },
  links: {
    linkedin: linkedinInput.value.trim(),
    github: githubInput.value.trim(),
    website: websiteInput.value.trim(),
    instagram: instagramInput.value.trim(),
    banner: bannerLinkSelect?.value || "linkedin",
  },
  skills: skillsInput.value,
  songs: listFields.songs.input.value,
  artists: listFields.artists.input.value,
  relationships: getRelationshipData(),
  avatarSrc: getSelectedCharacterAsset(),
  avatarText: getAvatarText(),
});

const applyProfilePayload = (payload) => {
  if (!payload) {
    return;
  }

  fields.name.input.value = payload.fields?.name || "";
  fields.pronouns.input.value = payload.fields?.pronouns || "";
  fields.location.input.value = payload.fields?.location || "";
  fields.distance.input.value = payload.fields?.distance || "";
  fields.experienceYears.input.value = payload.fields?.experienceYears || "";
  fields.age.input.value = payload.fields?.age || "";
  fields.height.input.value = payload.fields?.height || "";
  fields.education.input.value = payload.fields?.education || "";
  fields.zodiac.input.value = payload.fields?.zodiac || "";

  linkedinInput.value = payload.links?.linkedin || "";
  githubInput.value = payload.links?.github || "";
  websiteInput.value = payload.links?.website || "";
  instagramInput.value = payload.links?.instagram || "";
  if (bannerLinkSelect) {
    bannerLinkSelect.value = payload.links?.banner || "linkedin";
  }

  skillsInput.value = payload.skills || "";
  listFields.songs.input.value = payload.songs || "";
  listFields.artists.input.value = payload.artists || "";

  const safeAvatarSrc = characterAssets.includes(payload.avatarSrc)
    ? payload.avatarSrc
    : getDefaultCharacterAsset();
  setAvatarSrc(safeAvatarSrc, payload.avatarText || "");
  setSelectedCharacterAsset(safeAvatarSrc);
  hasUserUploadedPhoto = false;
  setShareLinkErrorVisible(false);
  updatePhotoHint();
  updateRemovePhotoButton();

  experienceList.innerHTML = "";
  relationshipCounter = 0;
  const relationships = Array.isArray(payload.relationships) ? payload.relationships : [];
  relationships.forEach((relationship) => {
    const card = createExperienceCard();
    experienceList.appendChild(card);
    setCardData(card, {
      person: relationship.person || "",
      appUsed: Boolean(relationship.appUsed),
      appName: relationship.appName || "",
      appOther: relationship.appOther || "",
      roles: Array.isArray(relationship.roles) ? relationship.roles : [],
    });
  });

  updateFields();
};

const loadProfileFromUrl = () => {
  const hash = window.location.hash.replace(/^#/, "");
  const hashParams = new URLSearchParams(hash);
  const encoded = hashParams.get("p");
  if (!encoded) {
    return;
  }
  document.body.classList.add("shared-view");
  try {
    const payload = decodeProfilePayload(encoded);
    applyProfilePayload(payload);
    if (shareLinkWrap && shareUrlInput) {
      shareUrlInput.value = window.location.href;
      shareLinkWrap.classList.remove("is-hidden");
    }
    if (hashParams.get("print") === "1") {
      window.setTimeout(() => {
        window.print();
      }, 300);
    }
  } catch (error) {
    console.warn("Unable to load shared profile.", error);
    if (shareLinkWrap && shareUrlInput) {
      shareUrlInput.value = "ERROR";
      shareLinkWrap.classList.remove("is-hidden");
    }
  }
};

photoInput.addEventListener("input", () => {
  if (randomizeNote) {
    randomizeNoteDismissed = true;
    randomizeNote.classList.add("is-hidden");
  }
  const selected = getSelectedCharacterAsset();
  setAvatarSrc(selected);
  updateCharacterLabel(selected);
  hasUserUploadedPhoto = false;
  resetShareLink();
  setShareLinkErrorVisible(false);
  updateRemovePhotoButton();
  updatePhotoHint();
});

if (removePhotoButton) {
  removePhotoButton.addEventListener("click", () => {
    setSelectedCharacterAsset(getDefaultCharacterAsset());
    setAvatarSrc(getSelectedCharacterAsset());
    hasUserUploadedPhoto = false;
    resetShareLink();
    setShareLinkErrorVisible(false);
    updateRemovePhotoButton();
    updatePhotoHint();
    updateFields();
  });
}

const handleFieldInput = () => {
  if (!randomizeNoteDismissed && randomizeNote) {
    randomizeNoteDismissed = true;
    randomizeNote.classList.add("is-hidden");
  }
  resetShareLink();
  updateFields();
};

const showRandomizeNote = () => {
  if (!randomizeNote || randomizeNoteDismissed) {
    return;
  }
  randomizeNote.classList.remove("is-hidden");
};

Object.values(fields).forEach(({ input }) => {
  input.addEventListener("input", handleFieldInput);
});

Object.values(listFields).forEach(({ input }) => {
  input.addEventListener("input", handleFieldInput);
});

skillsInput.addEventListener("input", handleFieldInput);
linkedinInput.addEventListener("input", handleFieldInput);
githubInput.addEventListener("input", handleFieldInput);
websiteInput.addEventListener("input", handleFieldInput);
instagramInput.addEventListener("input", handleFieldInput);
if (bannerLinkSelect) {
  bannerLinkSelect.addEventListener("change", handleFieldInput);
}

if (randomizeButton) {
  randomizeButton.addEventListener("click", () => {
    resetShareLink();
    randomizeProfile();
    showRandomizeNote();
  });
}

if (randomizeResumeButton) {
  randomizeResumeButton.addEventListener("click", () => {
    resetShareLink();
    randomizeProfile();
    showRandomizeNote();
  });
}

if (saveProgressButton) {
  saveProgressButton.addEventListener("click", () => {
    const payload = buildProfilePayload();
    const encoded = encodeProfilePayload(payload);
    profileCodeInput.value = encoded;
    profileCodeInput.focus();
    profileCodeInput.select();
    revealShareLink();
  });
}

if (importCodeButton) {
  importCodeButton.addEventListener("click", () => {
    const code = profileCodeInput.value.trim();
    if (!code) {
      return;
    }
    try {
      const json = decodeURIComponent(atob(code));
      const payload = JSON.parse(json);
      applyProfilePayload(payload);
    } catch (error) {
      window.alert("That profile code could not be imported. Please check it and try again.");
    }
  });
}

if (shareLinkedInButton) {
  shareLinkedInButton.addEventListener("click", (event) => {
    event.preventDefault();
    if (shareLinkedInNote) {
      shareLinkedInNote.classList.remove("is-hidden");
    }
  });
}

if (getShareLinkButton) {
  getShareLinkButton.addEventListener("click", () => {
    removeUploadedPhotoForShare();
    setShareLinkErrorVisible(false);
    const url = revealShareLink();
    if (!url || !shareUrlInput) {
      return;
    }
    shareUrlInput.focus();
    shareUrlInput.select();
    navigator.clipboard.writeText(url).catch(() => {
      document.execCommand("copy");
    });
  });
}

if (copyShareUrlButton) {
  copyShareUrlButton.addEventListener("click", async () => {
    const url = shareUrlInput?.value || revealShareLink();
    if (!url) {
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
    } catch (error) {
      shareUrlInput.focus();
      shareUrlInput.select();
      document.execCommand("copy");
    }
  });
}

addExperienceButton.addEventListener("click", () => {
  relationshipCounter = experienceList.querySelectorAll(".experience-card").length;
  const card = createExperienceCard();
  experienceList.prepend(card);
  resetShareLink();
  updateFields();
});

experienceList.addEventListener("input", (event) => {
  resetShareLink();
  if (event.target.matches('[data-field="appName"]')) {
    const card = event.target.closest(".experience-card");
    const appOther = card.querySelector('[data-field="appOther"]');
    if (event.target.value === "Other") {
      appOther.parentElement.classList.remove("is-hidden");
    } else {
      appOther.parentElement.classList.add("is-hidden");
      appOther.value = "";
    }
  }
  updateFields();
});

experienceList.addEventListener("change", (event) => {
  resetShareLink();
  if (event.target.matches('[data-field="appUsed"]')) {
    const card = event.target.closest(".experience-card");
    const appFields = card.querySelector("[data-app-fields]");
    if (event.target.checked) {
      appFields.classList.remove("is-hidden");
    } else {
      appFields.classList.add("is-hidden");
      card.querySelector('[data-field="appName"]').value = "";
      card.querySelector('[data-field="appOther"]').value = "";
      card.querySelector('[data-field="appOther"]').parentElement.classList.add("is-hidden");
    }
  }

  if (event.target.matches('[data-role-field="remote"]')) {
    const role = event.target.closest(".role-card");
    const locationField = role.querySelector("[data-role-location]");
    const locationInput = role.querySelector('[data-role-field="location"]');
    if (event.target.checked) {
      locationField.classList.add("is-hidden");
      locationInput.value = "";
    } else {
      locationField.classList.remove("is-hidden");
    }
  }

  updateFields();
});

experienceList.addEventListener("click", (event) => {
  if (event.target.matches("[data-remove]")) {
    const card = event.target.closest(".experience-card");
    const removedId = Number(card.dataset.relationshipId || "0");
    card.remove();
    Array.from(experienceList.querySelectorAll(".experience-card")).forEach((item) => {
      const currentId = Number(item.dataset.relationshipId || "0");
      if (currentId > removedId) {
        updateRelationshipCardId(item, currentId - 1);
      }
    });
    resetShareLink();
    updateFields();
    return;
  }

  if (event.target.matches("[data-add-role]")) {
    const card = event.target.closest(".experience-card");
    const roleList = card.querySelector("[data-role-list]");
    const currentCount = roleList.querySelectorAll(".role-card").length;
    const nextRole = currentCount + 1;
    card.dataset.roleCount = String(nextRole);
    roleList.prepend(createRoleCard(card.dataset.relationshipId, nextRole));
    updateAppLabel(card);
    resetShareLink();
    updateFields();
    return;
  }

  if (event.target.matches("[data-remove-role]")) {
    const role = event.target.closest(".role-card");
    const card = event.target.closest(".experience-card");
    const removedId = Number(role.dataset.roleId || "0");
    role.remove();
    Array.from(card.querySelectorAll(".role-card")).forEach((item) => {
      const currentId = Number(item.dataset.roleId || "0");
      if (currentId > removedId) {
        item.dataset.roleId = String(currentId - 1);
      }
    });
    syncRoleCardIds(card);
    card.dataset.roleCount = String(card.querySelectorAll(".role-card").length);
    resetShareLink();
    updateFields();
  }
});

loadProfileFromUrl();
updateRemovePhotoButton();
updatePhotoHint();

if (!experienceList.children.length) {
  experienceList.appendChild(createExperienceCard());
}

updateFields();

const handleDownload = () => {
  if (isInAppBrowser()) {
    removeUploadedPhotoForShare();
    const url = revealShareLink();
    if (url && shareUrlInput) {
      shareUrlInput.focus();
      shareUrlInput.select();
    }
    window.alert(
      "Download Profile only works if you open this in a web browser (like Safari or Chrome), not through an in-app link. You can still get a shareable link though."
    );
    return;
  }
  revealShareLink({ print: true, view: "resume" });
  window.print();
};

if (downloadButton) {
  downloadButton.addEventListener("click", handleDownload);
}

if (downloadButtonPreview) {
  downloadButtonPreview.addEventListener("click", handleDownload);
}

window.addEventListener(
  "scroll",
  () => {
    scheduleResumeScale();
    updatePreviewActionsVisibility();
  },
  { passive: true }
);
window.addEventListener("resize", () => {
  scheduleResumeScale();
  updateResumeScrollState();
  updatePreviewActionsVisibility();
});
scheduleResumeScale();
updatePreviewActionsVisibility();
