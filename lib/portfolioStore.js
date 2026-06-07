"use client";

import { defaultProfileInfo, defaultProjects, defaultReviews } from "./defaultData";

const keys = {
  projects: "hasil.projects",
  reviews: "hasil.reviews",
  contacts: "hasil.contacts",
  profileInfo: "hasil.profileInfo",
  visits: "hasil.visits",
  auth: "hasil.admin.auth"
};

const canUseStorage = () => typeof window !== "undefined" && window.localStorage;
const defaultProjectIds = new Set(defaultProjects.map((project) => project.id));
const defaultReviewIds = new Set(defaultReviews.map((review) => review.id));

const sortNewestFirst = (items) => [...items].sort((a, b) => {
  if (!a.createdAt && !b.createdAt) return 0;
  if (!a.createdAt) return 1;
  if (!b.createdAt) return -1;
  return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
});

const stripRuntimeFlags = ({ isDefault, ...item }) => item;

const read = (key, fallback) => {
  if (!canUseStorage()) return fallback;
  try {
    const value = window.localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

const write = (key, value) => {
  if (canUseStorage()) window.localStorage.setItem(key, JSON.stringify(value));
};

export function getProjects() {
  const savedProjects = sortNewestFirst(read(keys.projects, []).filter((project) => !defaultProjectIds.has(project.id) && !project.isDefault));
  const savedIds = new Set(savedProjects.map((project) => project.id));
  const remainingDefaults = defaultProjects.filter((project) => !savedIds.has(project.id)).map((project) => ({ ...project, isDefault: true }));
  return [...savedProjects, ...remainingDefaults];
}

export function saveProjects(projects) {
  const dashboardProjects = projects
    .filter((project) => !project.isDefault && !defaultProjectIds.has(project.id))
    .map(stripRuntimeFlags);
  write(keys.projects, dashboardProjects);
}

export function getReviews() {
  const savedReviews = sortNewestFirst(read(keys.reviews, []).filter((review) => !defaultReviewIds.has(review.id) && !review.isDefault));
  const savedIds = new Set(savedReviews.map((review) => review.id));
  const remainingDefaults = defaultReviews.filter((review) => !savedIds.has(review.id)).map((review) => ({ ...review, isDefault: true }));
  return [...savedReviews, ...remainingDefaults];
}

export function saveReviews(reviews) {
  const dashboardReviews = reviews
    .filter((review) => !review.isDefault && !defaultReviewIds.has(review.id))
    .map(stripRuntimeFlags);
  write(keys.reviews, dashboardReviews);
}

export function getContacts() {
  return read(keys.contacts, []);
}

export function saveContacts(contacts) {
  write(keys.contacts, contacts);
}

export function getProfileInfo() {
  return read(keys.profileInfo, defaultProfileInfo);
}

export function saveProfileInfo(profileInfo) {
  write(keys.profileInfo, profileInfo);
}

export function getVisits() {
  return read(keys.visits, 1284);
}

export function setVisits(visits) {
  write(keys.visits, visits);
}

export function incrementVisits() {
  const next = getVisits() + 1;
  setVisits(next);
  return next;
}

export function isAdminAuthed() {
  return read(keys.auth, false) === true;
}

export function setAdminAuthed(value) {
  write(keys.auth, value);
}

export function uid(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
