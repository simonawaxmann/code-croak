// The only data access point. Seeds live in data/*.json (read-only);
// after the first write a collection lives in localStorage under app:<collection>.

const PREFIX = 'app:';
const cache = new Map();

const key = (collection) => `${PREFIX}${collection}`;

async function load(collection) {
  const stored = localStorage.getItem(key(collection));
  if (stored) return JSON.parse(stored);
  if (!cache.has(collection)) {
    const res = await fetch(`data/${collection}.json`);
    if (!res.ok) throw new Error(`Could not load data/${collection}.json`);
    cache.set(collection, await res.json());
  }
  return structuredClone(cache.get(collection));
}

function save(collection, items) {
  localStorage.setItem(key(collection), JSON.stringify(items));
}

export async function getAll(collection) {
  return load(collection);
}

export async function get(collection, id) {
  const items = await load(collection);
  return items.find((item) => item.id === id) ?? null;
}

export async function create(collection, item) {
  const items = await load(collection);
  const created = { ...item, id: item.id ?? crypto.randomUUID() };
  items.push(created);
  save(collection, items);
  return created;
}

export async function update(collection, id, changes) {
  const items = await load(collection);
  const index = items.findIndex((item) => item.id === id);
  if (index === -1) return null;
  items[index] = { ...items[index], ...changes, id };
  save(collection, items);
  return items[index];
}

export async function remove(collection, id) {
  const items = await load(collection);
  save(collection, items.filter((item) => item.id !== id));
}

/** Removes every app:* key, so all collections go back to their seed state. */
export function reset() {
  Object.keys(localStorage)
    .filter((k) => k.startsWith(PREFIX))
    .forEach((k) => localStorage.removeItem(k));
}

// ---- Small domain helpers (still the only place that touches storage) ----

export async function getTopicsWithLessons() {
  const [topics, lessons] = await Promise.all([getAll('topics'), getAll('lessons')]);
  return topics
    .sort((a, b) => a.order - b.order)
    .map((topic) => ({ ...topic, lessons: lessons.filter((l) => l.topicId === topic.id) }));
}

export async function getReviewsFor(userId) {
  const reviews = await getAll('reviews');
  return reviews.filter((r) => r.userId === userId);
}

export async function getDraft(userId, lessonId) {
  const reviews = await getReviewsFor(userId);
  return reviews.find((r) => r.lessonId === lessonId && r.status === 'draft') ?? null;
}

export async function getLatestSubmitted(userId, lessonId) {
  const reviews = await getReviewsFor(userId);
  return reviews
    .filter((r) => r.lessonId === lessonId && r.status === 'submitted')
    .sort((a, b) => b.submittedAt.localeCompare(a.submittedAt))[0] ?? null;
}

export async function getOrCreateDraft(userId, lessonId) {
  const draft = await getDraft(userId, lessonId);
  if (draft) return draft;
  return create('reviews', {
    userId,
    lessonId,
    status: 'draft',
    comments: [],
    decision: null,
    explanation: '',
    createdAt: new Date().toISOString(),
  });
}

export async function getLesson(id) {
  const lesson = await get('lessons', id);
  if (!lesson) return null;
  const topic = await get('topics', lesson.topicId);
  return { lesson, topic };
}

export async function getCompletedLessonIds(userId) {
  const reviews = await getReviewsFor(userId);
  return new Set(reviews.filter((r) => r.status === 'submitted' && r.result?.passed).map((r) => r.lessonId));
}
