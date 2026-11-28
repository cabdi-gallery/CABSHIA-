// CABSHIA MEMORY WALL
// Temporary local storage using IndexedDB.
// Supabase connection and access security will be added later.

const DB_NAME = "CABSHIA_Memory_Database";
const DB_VERSION = 1;
const STORE_NAME = "memories";

let db;
let selectedImages = [];

const form = document.getElementById("memoryForm");
const formSection = document.getElementById("memoryFormSection");
const gallery = document.getElementById("memoryGallery");
const timeline = document.getElementById("memoryTimeline");
const imageInput = document.getElementById("memoryImages");
const imagePreview = document.getElementById("imagePreview");
const modal = document.getElementById("memoryModal");
const modalBody = document.getElementById("modalBody");

function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = event => {
      const database = event.target.result;

      if (!database.objectStoreNames.contains(STORE_NAME)) {
        database.createObjectStore(STORE_NAME, {
          keyPath: "id",
          autoIncrement: true
        });
      }
    };

    request.onsuccess = event => {
      db = event.target.result;
      resolve(db);
    };

    request.onerror = () => reject(request.error);
  });
}

function getAllMemories() {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function saveMemory(memory) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const request = transaction.objectStore(STORE_NAME).add(memory);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function deleteMemory(id) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const request = transaction.objectStore(STORE_NAME).delete(Number(id));

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

function formatDate(date) {
  if (!date) return "";

  return new Date(date + "T00:00:00").toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });
}

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[character]);
}

function openForm() {
  formSection.classList.remove("hidden");
  formSection.scrollIntoView({ behavior: "smooth" });
}

function closeForm() {
  formSection.classList.add("hidden");
}

document.getElementById("openFormBtn").addEventListener("click", openForm);
document.getElementById("closeFormBtn").addEventListener("click", closeForm);

imageInput.addEventListener("change", () => {
  selectedImages = Array.from(imageInput.files || []);
  imagePreview.innerHTML = "";

  selectedImages.forEach(file => {
    if (!file.type.startsWith("image/")) return;

    const image = document.createElement("img");
    const url = URL.createObjectURL(file);

    image.src = url;
    image.alt = file.name;

    image.onload = () => URL.revokeObjectURL(url);
    imagePreview.appendChild(image);
  });
});

form.addEventListener("submit", async event => {
  event.preventDefault();

  const title = document.getElementById("memoryTitle").value.trim();
  const date = document.getElementById("memoryDateInput").value;
  const category = document.getElementById("memoryCategory").value;
  const description = document.getElementById("memoryDescription").value.trim();

  if (!title || !date) {
    alert("Please enter a title and date.");
    return;
  }

  const button = form.querySelector('button[type="submit"]');
  button.disabled = true;
  button.textContent = "Saving...";

  try {
    const photos = await Promise.all(
      selectedImages
        .filter(file => file.type.startsWith("image/"))
        .map(file => file.arrayBuffer().then(buffer => ({
          name: file.name,
          type: file.type,
          data: buffer
        })))
    );

    await saveMemory({
      title,
      date,
      category,
      description,
      photos,
      createdAt: new Date().toISOString()
    });

    form.reset();
    selectedImages = [];
    imagePreview.innerHTML = "";
    closeForm();

    await renderMemories();
    alert("Your memory has been saved ✦");

  } catch (error) {
    console.error(error);
    alert("Memory could not be saved. Your device may be low on storage.");
  } finally {
    button.disabled = false;
    button.textContent = "Save This Memory ✦";
  }
});

function photoURL(photo) {
  const blob = new Blob([photo.data], { type: photo.type });
  return URL.createObjectURL(blob);
}

async function renderMemories() {
  const memories = await getAllMemories();

  memories.sort((a, b) => b.date.localeCompare(a.date));

  const search = document.getElementById("searchMemories")
    .value.toLowerCase().trim();

  const category = document.getElementById("filterCategory").value;

  const filtered = memories.filter(memory => {
    const matchesSearch =
      memory.title.toLowerCase().includes(search) ||
      memory.description.toLowerCase().includes(search);

    const matchesCategory =
      category === "All" || memory.category === category;

    return matchesSearch && matchesCategory;
  });

  gallery.innerHTML = "";
  timeline.innerHTML = "";

  document.getElementById("emptyMessage").style.display =
    memories.length === 0 ? "block" : "none";

  filtered.forEach(memory => {
    const card = document.createElement("article");
    card.className = "memory-card";
    card.addEventListener("click", () => showMemory(memory.id));

    if (memory.photos && memory.photos.length > 0) {
      const image = document.createElement("img");
      image.className = "card-image";
      image.src = photoURL(memory.photos[0]);
      image.alt = memory.title;
      card.appendChild(image);
    } else {
      const placeholder = document.createElement("div");
      placeholder.className = "card-no-image";
      placeholder.textContent = "✦";
      card.appendChild(placeholder);
    }

    const info = document.createElement("div");
    info.className = "memory-card-info";

    info.innerHTML = `
      <span>${escapeHTML(memory.category)}</span>
      <h3>${escapeHTML(memory.title)}</h3>
      <p>${escapeHTML(formatDate(memory.date))}</p>
      <span class="photo-count">
        📸 ${memory.photos ? memory.photos.length : 0} photo(s)
      </span>
    `;

    card.appendChild(info);
    gallery.appendChild(card);
  });

  memories.forEach(memory => {
    const item = document.createElement("article");
    item.className = "timeline-item";
    item.innerHTML = `
      <span>${escapeHTML(formatDate(memory.date))}</span>
      <h3>${escapeHTML(memory.title)}</h3>
      <p>${escapeHTML(memory.category)}</p>
    `;

    item.addEventListener("click", () => showMemory(memory.id));
    timeline.appendChild(item);
  });
}

async function showMemory(id) {
  const memories = await getAllMemories();
  const memory = memories.find(item => item.id === Number(id));

  if (!memory) return;

  const photosHTML = (memory.photos || []).map(photo => {
    const url = photoURL(photo);

    return `<img src="${url}" alt="${escapeHTML(photo.name)}">`;
  }).join("");

  modalBody.innerHTML = `
    <span class="section-label">${escapeHTML(memory.category)}</span>
    <h2>${escapeHTML(memory.title)}</h2>
    <span class="memory-date">${escapeHTML(formatDate(memory.date))}</span>

    <div class="modal-photos">${photosHTML}</div>

    <p>${escapeHTML(memory.description || "A special memory to remember.")}</p>

    <button class="delete-button" id="deleteMemoryBtn">
      Delete this memory
    </button>
  `;

  modal.classList.remove("hidden");

  document.getElementById("deleteMemoryBtn").addEventListener("click", async () => {
    const confirmed = confirm(
      "Are you sure you want to delete this memory and its photos?"
    );

    if (!confirmed) return;

    await deleteMemory(memory.id);
    modal.classList.add("hidden");
    await renderMemories();
  });
}

document.getElementById("closeModalBtn").addEventListener("click", () => {
  modal.classList.add("hidden");
});

modal.addEventListener("click", event => {
  if (event.target === modal) {
    modal.classList.add("hidden");
  }
});

document.getElementById("searchMemories")
  .addEventListener("input", renderMemories);

document.getElementById("filterCategory")
  .addEventListener("change", renderMemories);

async function startMemoryWall() {
  try {
    await openDatabase();
    await renderMemories();
  } catch (error) {
    console.error(error);
    alert("Memory Wall could not open its local database.");
  }
}

startMemoryWall();
