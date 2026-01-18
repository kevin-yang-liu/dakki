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
  zodiac: {
    input: document.getElementById("zodiac"),
    preview: document.getElementById("preview-zodiac"),
    fallback: "Zodiac",
  },
  interestedIn: {
    input: document.getElementById("interested-in"),
    preview: document.getElementById("preview-interested-in"),
    fallback: "",
    formatter: (value) => (value ? `Interested in ${value}` : "Interested in"),
  },
};
const experienceList = document.getElementById("experience-list");
const addExperienceButton = document.getElementById("add-experience");
const experiencePreview = document.getElementById("preview-relationship-experience");
const relationshipSummary = document.getElementById("preview-relationship-summary");
const downloadButton = document.getElementById("download-pdf");
const downloadButtonPreview = document.getElementById("download-pdf-preview");
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
const predictButton = document.getElementById("predict-relationship");
const predictionPanel = document.getElementById("prediction-panel");
const predictionText = document.getElementById("prediction-text");
const predictionCloseButton = document.getElementById("prediction-close");
const resumePredictionBlock = document.getElementById("prediction-block");
const resumePredictionText = document.getElementById("resume-prediction-text");
const relationshipStatusInput = document.getElementById("relationship-status");
const relationshipStatusGroup = document.getElementById("relationship-status-group");
const relationshipStatusButtons = relationshipStatusGroup
  ? Array.from(relationshipStatusGroup.querySelectorAll("[data-value]"))
  : [];
const partnerFrequencyInput = document.getElementById("partner-frequency");
const partnerGoalsInput = document.getElementById("partner-goals");
const partnerLowEffortInput = document.getElementById("partner-low-effort");
const partnerFrequencyPreview = document.getElementById("preview-partner-frequency");
const partnerGoalsPreview = document.getElementById("preview-partner-goals");
const partnerLowEffortPreview = document.getElementById("preview-partner-low-effort");
const partnerStatusPreview = document.getElementById("preview-relationship-status");
const singleStatusPreview = document.getElementById("preview-relationship-status-single");
const experienceHeading = document.getElementById("experience-heading");
const experienceLabel = document.getElementById("experience-label");
const experienceHelper = document.getElementById("experience-helper");
const singleOnlySections = Array.from(document.querySelectorAll("[data-single-only]"));
const partnerOnlySections = Array.from(document.querySelectorAll("[data-partner-only]"));
const removePhotoButton = document.getElementById("remove-photo");
const photoHint = document.getElementById("photo-hint");
const coverName = document.getElementById("cover-name");
const previewPanel = document.querySelector(".preview-panel");
const previewActions = document.querySelector(".preview-actions");
const resumeStage = document.getElementById("resume-stage");
const randomizeButton = document.getElementById("randomize-profile");
const interestedInInput = document.getElementById("interested-in");

let relationshipCounter = 0;
let hasUserUploadedPhoto = false;
let randomizeNoteDismissed = false;
let predictionValue = "";
let predictionTimers = [];
let predictionInProgress = false;

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

const ROLE_TYPE_DEFAULT = "relationship";
const ROLE_OTHER_DEFAULT = "Complicated relationship";
const ROLE_TYPE_OPTIONS = new Set(["marriage", "cohabitation", "relationship", "talking", "other"]);

const normalizeRoleType = (type) => {
  const normalized = (type || "").toLowerCase().trim();
  if (normalized === "coparent" || normalized === "polygamous" || normalized === "eyecontactship") {
    return "relationship";
  }
  if (ROLE_TYPE_OPTIONS.has(normalized)) {
    return normalized;
  }
  return ROLE_TYPE_DEFAULT;
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

const formatRoleType = (type, typeOther = "") => {
  if (!type) {
    return ROLE_OTHER_DEFAULT;
  }
  if (type === "other") {
    return typeOther || "Other";
  }
  if (type === "talking") {
    return "Talking Stage";
  }
  if (type === "cohabitation") {
    return "Cohabilitation";
  }
  if (type === "relationship") {
    return "Relationship";
  }
  if (type === "marriage") {
    return "Marriage";
  }
  return type.charAt(0).toUpperCase() + type.slice(1);
};

const getSentenceType = (type) => {
  return type === "marriage" ? "marriage" : "relationship";
};

const updateRoleTypeField = (roleCard) => {
  const typeSelect = roleCard.querySelector('[data-role-field="type"]');
  const otherField = roleCard.querySelector("[data-role-other]");
  const otherInput = roleCard.querySelector('[data-role-field="typeOther"]');
  if (!typeSelect || !otherField || !otherInput) {
    return;
  }
  let nextValue = normalizeRoleType(typeSelect.value);
  if (typeSelect.value !== nextValue) {
    typeSelect.value = nextValue;
  }
  if (nextValue === "other") {
    otherField.classList.remove("is-hidden");
    if (!otherInput.value.trim()) {
      otherInput.value = ROLE_OTHER_DEFAULT;
    }
  } else {
    otherField.classList.add("is-hidden");
  }
  const isDefaultOther =
    nextValue === "other" && otherInput.value.trim() === ROLE_OTHER_DEFAULT;
  otherInput.classList.toggle("is-default-value", isDefaultOther);
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
        <option value="marriage">Marriage</option>
        <option value="cohabitation">Cohabilitation</option>
        <option value="relationship" selected>Relationship</option>
        <option value="talking">Talking Stage</option>
        <option value="other">Other</option>
      </select>
    </div>
    <div class="field" data-role-other>
      <label>Other stage</label>
      <input type="text" data-role-field="typeOther" value="${ROLE_OTHER_DEFAULT}" />
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
  updateRoleTypeField(role);
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
    const options = getPersonOptions();
    const normalized = selected
      ? normalizePersonSelection(selected, nextId)
      : options[0];
    personInput.innerHTML = options
      .map((option) => `<option value="${option}">${option}</option>`)
      .join("");
    personInput.value = options.includes(normalized) ? normalized : options[0];
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
  const relationshipLabel = isInRelationship()
    ? "Relationship"
    : `Relationship ${relationshipCounter}`;
  wrapper.innerHTML = `
    <div class="experience-header">
      <h4 class="relationship-label">${relationshipLabel}</h4>
      <button type="button" class="btn-link" data-remove>Remove</button>
    </div>
    <div class="field">
      <label>Person</label>
      <select data-field="person">
        ${getPersonOptions()
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
      const type = normalizeRoleType(getRoleValue('[data-role-field="type"]'));
      return {
        type,
        typeOther: type === "other" ? getRoleValue('[data-role-field="typeOther"]') : "",
        start: getRoleValue('[data-role-field="start"]'),
        end: getRoleValue('[data-role-field="end"]'),
        summary: getRoleValue('[data-role-field="summary"]'),
        location: getRoleValue('[data-role-field="location"]'),
        remote: role.querySelector('[data-role-field="remote"]')?.checked || false,
      };
    });

    const person = getValue('[data-field="person"]');

    return {
      relationshipId: Number(card.dataset.relationshipId || "0"),
      person,
      appUsed,
      appName,
      appOther,
      roles,
    };
  });
};

const isCurrentRole = (role) => {
  const endText = (role.end || "").trim();
  return !endText || /present/i.test(endText);
};

const updateRelationshipSummary = (relationships) => {
  if (!relationshipSummary) {
    return;
  }
  const marriedPeople = relationships
    .filter((item) =>
      item.roles.some((role) => role.type === "marriage" && isCurrentRole(role))
    )
    .map((item) => item.person)
    .filter(Boolean);
  const primaryMarried = marriedPeople[0] || "";
  const additionalMarried = marriedPeople.slice(1);
  const people = relationships
    .filter(
      (item) =>
        !item.roles.some((role) => role.type === "marriage" && isCurrentRole(role))
    )
    .map((item) => item.person)
    .filter(Boolean)
    .concat(additionalMarried);

  const normalizePerson = (value) =>
    value
      .toLowerCase()
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
  const rawRelationships = getRelationshipData();
  const relationships = rawRelationships.filter((item) => {
    const hasRole = item.roles.some((role) =>
      [role.type, role.start, role.end, role.summary, role.location].some(Boolean)
    );
    return [item.person].some(Boolean) || hasRole || item.appUsed;
  });
  const displayRelationships = relationships.length ? relationships : rawRelationships;

  experiencePreview.innerHTML = "";
  updateRelationshipSummary(displayRelationships);

  if (!displayRelationships.length) {
    experiencePreview.innerHTML = `<p class="experience-meta">User has decided to keep their relationship info private</p>`;
    return;
  }

  const sortedRelationships = isInRelationship()
    ? displayRelationships
    : [...displayRelationships].sort(
        (a, b) => (b.relationshipId || 0) - (a.relationshipId || 0)
      );

  sortedRelationships.forEach((item) => {
    const wrapper = document.createElement("div");
    wrapper.className = "experience-item";

    const relationshipType = getRelationshipType(item.roles);
    const sentenceType = getSentenceType(relationshipType);
    let appLine = "";
    if (item.appUsed) {
      if (item.appName === "Other") {
        const otherName = (item.appOther || "").trim();
        appLine = otherName
          ? `${otherName} helped me land this ${sentenceType}`
          : `Dating app helped me land this ${sentenceType}`;
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
            <div class="preview-role-title">${formatRoleType(role.type, role.typeOther)}</div>
            <div class="preview-role-meta">${dateLine}</div>
            ${locationLine ? `<div class="preview-role-meta">${locationLine}</div>` : ""}
            ${role.summary ? `<div class="experience-summary">${role.summary}</div>` : ""}
            ${duration ? `<div class="preview-role-duration">${duration}</div>` : ""}
          </div>
        `;
      })
      .join("");

    const personLabel = item.person || "Relationship";
    const relationshipIndex = item.relationshipId || 1;
    const personHeading = isInRelationship()
      ? personLabel
      : `#${relationshipIndex}: ${personLabel}`;
    wrapper.innerHTML = `
      <h4>${personHeading}</h4>
      ${appLine ? `<span class="experience-pill">${appLine}</span>` : ""}
      ${rolesMarkup ? `<div class="preview-role-list">${rolesMarkup}</div>` : ""}
    `;

    experiencePreview.appendChild(wrapper);
  });
};

let resumeScaleRaf = null;

const isInRelationship = () => relationshipStatusInput?.value === "yes";

const syncRelationshipButtons = () => {
  if (!relationshipStatusInput || !relationshipStatusButtons.length) {
    return;
  }
  relationshipStatusButtons.forEach((button) => {
    const isActive = button.dataset.value === relationshipStatusInput.value;
    button.classList.toggle("is-active", isActive);
  });
};

const getCurrentRelationshipStatus = () => {
  const relationships = getRelationshipData();
  const currentRoles = relationships
    .flatMap((relationship) => relationship.roles)
    .filter((role) => isCurrentRole(role));
  const currentRole = currentRoles[0] || relationships[0]?.roles[0];
  if (!currentRole) {
    return "relationship";
  }
  return formatRoleType(currentRole.type, currentRole.typeOther).toLowerCase();
};

const updateRelationshipVisibility = () => {
  const inRelationship = isInRelationship();
  singleOnlySections.forEach((section) => {
    section.classList.toggle("is-hidden", inRelationship);
  });
  partnerOnlySections.forEach((section) => {
    section.classList.toggle("is-hidden", !inRelationship);
  });
  if (addExperienceButton) {
    addExperienceButton.classList.toggle("is-hidden", inRelationship);
    addExperienceButton.disabled = inRelationship;
  }
  if (experienceHeading) {
    experienceHeading.textContent = inRelationship ? "Relationship details" : "Dating Experience";
  }
  if (experienceLabel) {
    experienceLabel.textContent = inRelationship ? "RELATIONSHIP DETAILS" : "Dating Experience";
  }
  if (experienceHelper) {
    experienceHelper.textContent = inRelationship
      ? "Enter details about your relationship"
      : "Enter past dating experiences from first to most recent";
  }
  syncRelationshipButtons();
  const cards = Array.from(experienceList.querySelectorAll(".experience-card"));
  cards.forEach((card, index) => {
    const label = card.querySelector(".relationship-label");
    if (!label) {
      return;
    }
    const relationshipId = card.dataset.relationshipId || String(index + 1);
    label.textContent = inRelationship ? "Relationship" : `Relationship ${relationshipId}`;
  });
};

const resetPartnerAnswers = () => {
  if (partnerFrequencyInput) {
    partnerFrequencyInput.value = "";
  }
  if (partnerGoalsInput) {
    partnerGoalsInput.value = "";
  }
  if (partnerLowEffortInput) {
    partnerLowEffortInput.value = "";
  }
};

const resetExperienceForCurrentRelationship = () => {
  relationshipCounter = 0;
  experienceList.innerHTML = "";
  const card = createExperienceCard();
  experienceList.appendChild(card);
};

const resetExperienceForSingle = () => {
  relationshipCounter = 0;
  experienceList.innerHTML = "";
  const card = createExperienceCard();
  experienceList.appendChild(card);
  const personInput = card.querySelector('[data-field="person"]');
  if (personInput) {
    personInput.value = "man";
  }
  const roleCard = card.querySelector(".role-card");
  if (roleCard) {
    const typeSelect = roleCard.querySelector('[data-role-field="type"]');
    if (typeSelect) {
      typeSelect.value = "relationship";
      updateRoleTypeField(roleCard);
    }
    const startInput = roleCard.querySelector('[data-role-field="start"]');
    const endInput = roleCard.querySelector('[data-role-field="end"]');
    if (startInput) {
      startInput.value = "";
    }
    if (endInput) {
      endInput.value = "";
    }
  }
};

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
  updateRelationshipVisibility();
  Object.values(fields).forEach(({ input, preview, fallback, formatter }) => {
    let value = input.value.trim();
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

  Array.from(experienceList.querySelectorAll(".experience-card")).forEach((card) => {
    updateAppLabel(card);
  });

  if (partnerFrequencyPreview) {
    partnerFrequencyPreview.textContent = partnerFrequencyInput?.value.trim() || "N/A";
  }
  if (partnerGoalsPreview) {
    partnerGoalsPreview.textContent = partnerGoalsInput?.value.trim() || "N/A";
  }
  if (partnerLowEffortPreview) {
    partnerLowEffortPreview.textContent = partnerLowEffortInput?.value.trim() || "N/A";
  }
  if (partnerStatusPreview) {
    partnerStatusPreview.textContent = `Status: ${getCurrentRelationshipStatus()}`;
  }
  if (singleStatusPreview) {
    singleStatusPreview.textContent = "Status: single";
  }

  renderExperiencePreview();
  updateDocumentTitles();
  updateAvatarPlaceholder();
  updateCoverContent();
  scheduleResumeScale();
};

const updateDocumentTitles = () => {
  const name = fields.name.input.value.trim();
  const title = "Dakki";
  document.title = title;
  const pdfTitle = document.getElementById("pdf-title");
  if (pdfTitle) {
    pdfTitle.textContent = title;
  }
};

const updateCoverContent = () => {
  if (!coverName) {
    return;
  }
  const name = fields.name.input.value.trim() || "Your Name";
  coverName.textContent = name;
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
  pronouns: ["she/her", "he/him", "they/them", "she/they", "he/they"],
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
  heights: ["5'4\"", "5'8\"", "5'10\"", "6'0\""],
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
  partnerFrequency: ["1-2 times", "2 times", "5+ times", "Weekend heavy"],
  partnerGoals: ["Very aligned", "Mostly aligned", "Growing together", "Still figuring it out"],
  partnerLowEffort: ["Yes", "Most of the time", "Sometimes", "Working on it"],
  apps: ["Hinge", "Tinder", "Bumble", "Other", ""],
  appOther: ["Coffee Meets Bagel", "LinkedIn", "Wechat", "OkCupid", "Facebook Marketplace"],
};

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const randomMonthYear = (yearStart, yearEnd) => {
  const year = randomInt(yearStart, yearEnd);
  const month = randomItem(monthNames);
  return `${month} ${year}`;
};

const PERSON_BASE_OPTIONS = ["man", "woman", "nonbinary person"];

const getPersonOptions = () => PERSON_BASE_OPTIONS.slice();

const normalizePersonSelection = (value) => {
  const lower = value.toLowerCase();
  if (lower.includes("woman")) {
    return "woman";
  }
  if (lower.includes("man") && !lower.includes("woman")) {
    return "man";
  }
  if (lower.includes("nonbinary")) {
    return "nonbinary person";
  }
  return "nonbinary person";
};

const hashString = (value) => {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) % 2147483647;
  }
  return Math.abs(hash);
};

const pickFromList = (list, seed) => {
  if (!list.length) {
    return "";
  }
  return list[seed % list.length];
};

const getInterestedLabel = () => {
  const value = (interestedInInput?.value || "").toLowerCase();
  if (value.includes("women") || value.includes("woman")) {
    return "woman";
  }
  if (value.includes("men") || value.includes("man")) {
    return "man";
  }
  if (value.includes("nonbinary")) {
    return "nonbinary person";
  }
  if (value.includes("all") || value.includes("everyone")) {
    return "partner";
  }
  return "partner";
};

const getPredictionContext = () => {
  const relationships = getRelationshipData();
  const pastPartners = relationships.map((item) => item.person).filter(Boolean);

  const experienceYears = Number(fields.experienceYears.input.value.trim() || "0");
  const age = Number(fields.age.input.value.trim() || "0");

  return {
    name: fields.name.input.value.trim() || "You",
    pronouns: fields.pronouns.input.value.trim(),
    interestedLabel: getInterestedLabel(),
    pastPartners,
    experienceYears: Number.isFinite(experienceYears) ? experienceYears : 0,
    age: Number.isFinite(age) ? age : 0,
  };
};

const buildPredictionTextLocal = () => {
  const context = getPredictionContext();
  const payload = JSON.stringify({
    name: context.name,
    pronouns: context.pronouns,
    interestedLabel: context.interestedLabel,
    pastPartners: context.pastPartners,
    experienceYears: context.experienceYears,
    age: context.age,
  });
  const seed = hashString(payload);
  const partnerLabel = context.interestedLabel === "partner"
    ? "partner"
    : context.interestedLabel;
  const normalizePartnerLabel = (label) => {
    const lowered = label.toLowerCase();
    if (lowered.includes("nonbinary")) {
      return "a past nonbinary person";
    }
    if (lowered.includes("woman")) {
      return "a past woman";
    }
    if (lowered.includes("man") && !lowered.includes("woman")) {
      return "a past man";
    }
    return label;
  };

  const pastPartners = context.pastPartners.length
    ? context.pastPartners.map(normalizePartnerLabel)
    : [`a past ${partnerLabel}`];
  const pickPastPartner = (seedOffset) => pickFromList(pastPartners, seed + seedOffset);
  const primaryPast = pickPastPartner(3);
  const secondaryPast = pickPastPartner(7);

  const coreOutcomes = [
    `sparking up a relationship with ${primaryPast} and keeping it low-key`,
    `catching feelings for a new ${partnerLabel} from your friend group`,
    `rekindling with ${primaryPast} before realizing ${secondaryPast} is the real plot twist`,
    `going from "single era" to talking stage with a bold ${partnerLabel} you meet at a cafe`,
    `getting back together with ${primaryPast} and then leveling up to cohabitation`,
    `staying single for a minute, then meeting ${secondaryPast} who shifts everything`,
    `starting a situationship with ${primaryPast} that unexpectedly turns into marriage`,
    `ghosting ${primaryPast} and then getting a sincere apology that restarts the story`,
    `meeting a new ${partnerLabel} through work and calling it official by fall`,
    `going viral on a dating app and landing a serious relationship with a new ${partnerLabel}`,
    `deciding to go no-contact, then bumping into ${primaryPast} at a wedding`,
    `unlocking a slow-burn romance with ${secondaryPast} after months of "just friends"`,
    `choosing ${primaryPast} for real after a messy almost-thing`,
    `getting engaged to a new ${partnerLabel} after a chaotic group trip`,
    `finding a new ${partnerLabel} who feels like home and moving in together`,
    `meeting a long-distance ${partnerLabel} who makes the distance feel easy`,
    `dating a new ${partnerLabel} and meeting each other's families by winter`,
    `landing a joyful, steady relationship with ${secondaryPast} that turns into marriage`,
    `rekindling with ${primaryPast} and becoming each other's favorite person`,
    `meeting a new ${partnerLabel} through a hobby and calling it official fast`,
    `finding your forever ${partnerLabel} after a tiny DM that changes everything`,
  ];

  const flavorAdds = [
    "after a bold app swipe.",
    "once you stop replying in 3-day batches.",
    "when your top song becomes your couple song.",
    "after a random coffee run turns into a date.",
    "right after a chaotic group chat dares you to text first.",
    "after your friends force you to actually say yes to plans.",
    "because you finally leave the house on a weeknight.",
    "right after you delete and re-download a dating app.",
    "the moment you decide to be direct about what you want.",
    "after a low-key hangout becomes a weekly ritual.",
    "when you say yes to a last-minute invite.",
    "once you start matching energy instead of overthinking.",
  ];

  const outcome = pickFromList(coreOutcomes, seed);
  const flavor = pickFromList(flavorAdds, seed + 11);

  const intensityTag =
    context.experienceYears >= 6 || context.age >= 30
      ? "Big energy forecast:"
      : "Soft launch forecast:";

  const sentence = `${intensityTag} By the start of 2027, you're ${outcome} ${flavor}`;
  const withoutPeriod = sentence.replace(/\.\s*$/, "");
  return `${withoutPeriod} 🎉`;
};

const buildPredictionPayload = () => ({
  fields: {
    name: fields.name.input.value.trim(),
    pronouns: fields.pronouns.input.value.trim(),
    location: fields.location.input.value.trim(),
    distance: fields.distance.input.value.trim(),
    experienceYears: fields.experienceYears.input.value.trim(),
    age: fields.age.input.value.trim(),
    height: fields.height.input.value.trim(),
    zodiac: fields.zodiac.input.value.trim(),
    interestedIn: interestedInInput?.value.trim() || "",
    relationshipStatus: relationshipStatusInput?.value || "no",
    partnerFrequency: partnerFrequencyInput?.value.trim() || "",
    partnerGoals: partnerGoalsInput?.value.trim() || "",
    partnerLowEffort: partnerLowEffortInput?.value.trim() || "",
  },
  relationships: getRelationshipData(),
});

const fetchPredictionText = async () => {
  try {
    const response = await fetch("/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(buildPredictionPayload()),
    });
    if (!response.ok) {
      return "";
    }
    const data = await response.json();
    return typeof data.prediction === "string" ? data.prediction : "";
  } catch (error) {
    return "";
  }
};

const setCardData = (card, data) => {
  const personInput = card.querySelector('[data-field="person"]');
  const appUsedInput = card.querySelector('[data-field="appUsed"]');
  const appFields = card.querySelector("[data-app-fields]");
  const appNameInput = card.querySelector('[data-field="appName"]');
  const appOtherInput = card.querySelector('[data-field="appOther"]');

  if (personInput) {
    const relationshipId = Number(card.dataset.relationshipId || "1");
    const options = getPersonOptions();
    const nextValue = data.person
      ? normalizePersonSelection(data.person)
      : options[0];
    personInput.value = options.includes(nextValue) ? nextValue : options[0];
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
    const hasTypeOther = Object.prototype.hasOwnProperty.call(role, "typeOther");
    let roleType = normalizeRoleType(role.type);
    if (roleType === "other" && !hasTypeOther) {
      roleType = "talking";
    }
    roleCard.querySelector('[data-role-field="type"]').value = roleType;
    const roleTypeOther = roleCard.querySelector('[data-role-field="typeOther"]');
    if (roleTypeOther) {
      roleTypeOther.value = role.typeOther || "";
    }
    updateRoleTypeField(roleCard);
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
  const inRelationship = randomBool(0.45);

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
  if (interestedInInput) {
    interestedInInput.value = randomItem(["men", "women", "nonbinary people"]);
  }
  if (relationshipStatusInput) {
    relationshipStatusInput.value = inRelationship ? "yes" : "no";
  }
  syncRelationshipButtons();
  if (inRelationship) {
    if (partnerFrequencyInput) {
      partnerFrequencyInput.value = randomItem(profileData.partnerFrequency);
    }
    if (partnerGoalsInput) {
      partnerGoalsInput.value = randomItem(profileData.partnerGoals);
    }
    if (partnerLowEffortInput) {
      partnerLowEffortInput.value = randomItem(profileData.partnerLowEffort);
    }
  } else {
    resetPartnerAnswers();
  }

  relationshipCounter = 0;
  experienceList.innerHTML = "";
  if (inRelationship) {
    const card = createExperienceCard();
    experienceList.appendChild(card);

    const personName = randomItem(getPersonOptions());
    const rolesCount = randomInt(1, 3);
    const roles = Array.from({ length: rolesCount }, (_, index) => {
      const startYear = randomInt(2020, 2024);
      const type = randomItem(["cohabitation", "relationship", "talking", "other", "marriage"]);
      const isCurrentRole = index === rolesCount - 1;
      const endYear = isCurrentRole ? "" : String(randomInt(startYear, 2025));
      return {
        type,
        typeOther: type === "other" ? ROLE_OTHER_DEFAULT : "",
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
  } else {
    const relationshipCount = randomInt(1, 2);
    for (let i = 0; i < relationshipCount; i += 1) {
      const card = createExperienceCard();
      experienceList.appendChild(card);

      const personName = randomItem(getPersonOptions());
      const rolesCount = randomInt(1, 2);
      const roles = Array.from({ length: rolesCount }, () => {
        const startYear = randomInt(2017, 2023);
        const type = randomItem(["marriage", "cohabitation", "relationship", "talking", "other"]);
        const endYear = String(randomInt(startYear, 2025));
        return {
          type,
          typeOther: type === "other" ? ROLE_OTHER_DEFAULT : "",
          start: randomMonthYear(startYear, startYear),
          end: `${randomItem(monthNames)} ${endYear}`,
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

const resetPredictionPanel = () => {
  if (!predictionPanel || !predictionText) {
    return;
  }
  predictionTimers.forEach((timer) => clearTimeout(timer));
  predictionTimers = [];
  predictionPanel.classList.add("is-hidden");
  predictionText.textContent = "";
  predictionValue = "";
  predictionInProgress = false;
  if (resumePredictionBlock && resumePredictionText) {
    resumePredictionBlock.classList.add("is-hidden");
    resumePredictionText.textContent = "";
  }
  if (predictButton) {
    predictButton.classList.remove("is-hidden");
    predictButton.disabled = false;
  }
};

const updatePredictionDisplay = () => {
  if (!predictionPanel || !predictionText) {
    return;
  }
  if (!predictionValue) {
    predictionPanel.classList.add("is-hidden");
    predictionText.textContent = "";
    if (resumePredictionBlock && resumePredictionText) {
      resumePredictionBlock.classList.add("is-hidden");
      resumePredictionText.textContent = "";
    }
    if (predictButton) {
      predictButton.classList.remove("is-hidden");
      predictButton.disabled = false;
    }
    return;
  }
  predictionPanel.classList.remove("is-hidden");
  predictionText.textContent = predictionValue;
  if (predictButton) {
    predictButton.classList.add("is-hidden");
    predictButton.disabled = true;
  }
  if (resumePredictionBlock && resumePredictionText) {
    resumePredictionBlock.classList.remove("is-hidden");
    resumePredictionText.textContent = predictionValue;
  }
};

const runPredictionSequence = () => {
  if (!predictionPanel || !predictionText) {
    return;
  }
  resetPredictionPanel();
  predictionInProgress = true;
  resetShareLink();
  if (getShareLinkButton) {
    getShareLinkButton.classList.add("is-hidden");
    getShareLinkButton.disabled = true;
  }
  if (downloadButtonPreview) {
    downloadButtonPreview.classList.add("is-hidden");
    downloadButtonPreview.disabled = true;
  }
  predictionPanel.classList.remove("is-hidden");
  const context = getPredictionContext();
  const seed = hashString(JSON.stringify(context));
  const loadingPool = [
    "Warming up the duck-powered neural net...",
    "Consulting the zodiac API...",
    "Compiling your love story into bytecode...",
    "Running sentiment analysis on your playlist...",
    "Cross-referencing your vibe with cosmic weather...",
    "Simulating a meet-cute in 4D...",
    "Decrypting your soft-launch signals...",
    "Asking the group chat for wisdom...",
    "Negotiating with Cupid's scheduler...",
    "Bootstrapping a relationship forecast model...",
  ];

  const messages = [];
  let seedOffset = 0;
  while (messages.length < 3) {
    const message = pickFromList(loadingPool, seed + seedOffset);
    if (!messages.includes(message)) {
      messages.push(message);
    }
    seedOffset += 3;
  }

  const delayMs = 2000;
  messages.forEach((message, index) => {
    predictionTimers.push(
      window.setTimeout(() => {
        predictionText.textContent = message;
      }, index * delayMs)
    );
  });

  predictionTimers.push(
    window.setTimeout(() => {
      fetchPredictionText()
        .then((remotePrediction) => {
          predictionValue = remotePrediction || buildPredictionTextLocal();
          predictionInProgress = false;
          updatePredictionDisplay();
          if (getShareLinkButton) {
            getShareLinkButton.classList.remove("is-hidden");
            getShareLinkButton.disabled = false;
          }
          if (downloadButtonPreview) {
            downloadButtonPreview.classList.remove("is-hidden");
            downloadButtonPreview.disabled = false;
          }
        })
        .catch(() => {
          predictionValue = buildPredictionTextLocal();
          predictionInProgress = false;
          updatePredictionDisplay();
          if (getShareLinkButton) {
            getShareLinkButton.classList.remove("is-hidden");
            getShareLinkButton.disabled = false;
          }
          if (downloadButtonPreview) {
            downloadButtonPreview.classList.remove("is-hidden");
            downloadButtonPreview.disabled = false;
          }
        });
    }, messages.length * delayMs)
  );
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
    zodiac: fields.zodiac.input.value.trim(),
    interestedIn: interestedInInput?.value.trim() || "",
    relationshipStatus: relationshipStatusInput?.value || "no",
    partnerFrequency: partnerFrequencyInput?.value.trim() || "",
    partnerGoals: partnerGoalsInput?.value.trim() || "",
    partnerLowEffort: partnerLowEffortInput?.value.trim() || "",
  },
  relationships: getRelationshipData(),
  avatarSrc: getSelectedCharacterAsset(),
  avatarText: getAvatarText(),
  prediction: predictionValue,
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
  fields.zodiac.input.value = payload.fields?.zodiac || "";
  if (interestedInInput) {
    interestedInInput.value = payload.fields?.interestedIn || "men";
  }
  if (relationshipStatusInput) {
    relationshipStatusInput.value = payload.fields?.relationshipStatus || "no";
  }
  syncRelationshipButtons();
  if (partnerFrequencyInput) {
    partnerFrequencyInput.value = payload.fields?.partnerFrequency || "";
  }
  if (partnerGoalsInput) {
    partnerGoalsInput.value = payload.fields?.partnerGoals || "";
  }
  if (partnerLowEffortInput) {
    partnerLowEffortInput.value = payload.fields?.partnerLowEffort || "";
  }
  predictionValue = payload.prediction || "";
  updatePredictionDisplay();

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
  let maxRelationshipId = 0;
  relationships.forEach((relationship) => {
    const card = createExperienceCard();
    experienceList.appendChild(card);
    const nextId = Number(relationship.relationshipId || card.dataset.relationshipId || "0");
    if (Number.isFinite(nextId) && nextId > 0) {
      updateRelationshipCardId(card, nextId);
      maxRelationshipId = Math.max(maxRelationshipId, nextId);
    }
    setCardData(card, {
      person: relationship.person || "",
      appUsed: Boolean(relationship.appUsed),
      appName: relationship.appName || "",
      appOther: relationship.appOther || "",
      roles: Array.isArray(relationship.roles) ? relationship.roles : [],
    });
  });
  if (maxRelationshipId > 0) {
    relationshipCounter = maxRelationshipId;
  }

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
  resetPredictionPanel();
  updateFields();
};

const handleRelationshipStatusChange = () => {
  if (isInRelationship()) {
    resetPartnerAnswers();
    resetExperienceForCurrentRelationship();
  } else {
    resetPartnerAnswers();
    resetExperienceForSingle();
  }
  handleFieldInput();
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

if (relationshipStatusInput) {
  relationshipStatusInput.addEventListener("change", handleRelationshipStatusChange);
}
if (relationshipStatusGroup) {
  relationshipStatusGroup.addEventListener("click", (event) => {
    const button = event.target.closest("[data-value]");
    if (!button || !relationshipStatusInput) {
      return;
    }
    const value = button.dataset.value === "yes" ? "yes" : "no";
    if (relationshipStatusInput.value === value) {
      return;
    }
    relationshipStatusInput.value = value;
    handleRelationshipStatusChange();
  });
}
if (partnerFrequencyInput) {
  partnerFrequencyInput.addEventListener("input", handleFieldInput);
}
if (partnerGoalsInput) {
  partnerGoalsInput.addEventListener("input", handleFieldInput);
}
if (partnerLowEffortInput) {
  partnerLowEffortInput.addEventListener("input", handleFieldInput);
}


if (randomizeButton) {
  randomizeButton.addEventListener("click", () => {
    resetShareLink();
    resetPredictionPanel();
    randomizeProfile();
    showRandomizeNote();
  });
}

if (randomizeResumeButton) {
  randomizeResumeButton.addEventListener("click", () => {
    resetShareLink();
    resetPredictionPanel();
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

if (predictButton) {
  predictButton.addEventListener("click", () => {
    if (!predictionPanel || !predictionText) {
      return;
    }
    updateFields();
    runPredictionSequence();
    predictionPanel.scrollIntoView({ behavior: "smooth", block: "center" });
  });
}

if (predictionCloseButton) {
  predictionCloseButton.addEventListener("click", () => {
    resetPredictionPanel();
  });
}

addExperienceButton.addEventListener("click", () => {
  if (isInRelationship()) {
    return;
  }
  relationshipCounter = experienceList.querySelectorAll(".experience-card").length;
  const card = createExperienceCard();
  experienceList.prepend(card);
  resetShareLink();
  resetPredictionPanel();
  updateFields();
});

experienceList.addEventListener("input", (event) => {
  resetShareLink();
  resetPredictionPanel();
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
  if (event.target.matches('[data-role-field="typeOther"]')) {
    const role = event.target.closest(".role-card");
    if (role) {
      updateRoleTypeField(role);
    }
  }
  updateFields();
});

experienceList.addEventListener("change", (event) => {
  resetShareLink();
  resetPredictionPanel();
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

  if (event.target.matches('[data-role-field="type"]')) {
    const role = event.target.closest(".role-card");
    if (role) {
      updateRoleTypeField(role);
    }
    const card = event.target.closest(".experience-card");
    if (card) {
      updateAppLabel(card);
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
    resetPredictionPanel();
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
    resetPredictionPanel();
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
    resetPredictionPanel();
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
    window.alert(
      "Download Profile only works if you open this in a web browser (like Safari or Chrome), not through an in-app link. You can still get a shareable link though."
    );
    return;
  }
  window.print();
};

if (downloadButton) {
  downloadButton.addEventListener("click", () => {
    handleDownload();
  });
}

if (downloadButtonPreview) {
  downloadButtonPreview.addEventListener("click", () => {
    handleDownload();
  });
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
