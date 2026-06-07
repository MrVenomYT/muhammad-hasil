"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  getContacts,
  getProjects,
  getProfileInfo,
  getReviews,
  getVisits,
  incrementVisits,
  saveContacts,
  saveProfileInfo,
  saveProjects,
  saveReviews,
  uid
} from "@/lib/portfolioStore";

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [projects, setProjects] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [profileInfo, setProfileInfo] = useState(null);
  const [visits, setVisits] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setProjects(getProjects());
    setReviews(getReviews());
    setContacts(getContacts());
    setProfileInfo(getProfileInfo());
    setVisits(incrementVisits());
    setReady(true);
  }, []);

  const addProject = useCallback((project) => {
    setProjects((current) => {
      const next = [{ ...project, id: uid("project"), createdAt: new Date().toISOString() }, ...current];
      saveProjects(next);
      return next;
    });
  }, []);

  const deleteProject = useCallback((id) => {
    setProjects((current) => {
      const next = current.filter((project) => project.id !== id);
      saveProjects(next);
      return next;
    });
  }, []);

  const addReview = useCallback((review) => {
    setReviews((current) => {
      const next = [{ ...review, id: uid("review"), rating: Number(review.rating || 5), createdAt: new Date().toISOString() }, ...current];
      saveReviews(next);
      return next;
    });
  }, []);

  const deleteReview = useCallback((id) => {
    setReviews((current) => {
      const next = current.filter((review) => review.id !== id);
      saveReviews(next);
      return next;
    });
  }, []);

  const addContact = useCallback((contact) => {
    setContacts((current) => {
      const next = [{ ...contact, id: uid("message"), createdAt: new Date().toISOString() }, ...current];
      saveContacts(next);
      return next;
    });
  }, []);

  const deleteContact = useCallback((id) => {
    setContacts((current) => {
      const next = current.filter((contact) => contact.id !== id);
      saveContacts(next);
      return next;
    });
  }, []);

  const updateProfileInfo = useCallback((nextInfo) => {
    setProfileInfo(nextInfo);
    saveProfileInfo(nextInfo);
  }, []);

  const api = useMemo(() => ({
    ready,
    projects,
    reviews,
    contacts,
    profileInfo,
    visits,
    addProject,
    deleteProject,
    addReview,
    deleteReview,
    addContact,
    deleteContact,
    updateProfileInfo
  }), [addContact, addProject, addReview, contacts, deleteContact, deleteProject, deleteReview, profileInfo, projects, ready, reviews, updateProfileInfo, visits]);

  return <DataContext.Provider value={api}>{children}</DataContext.Provider>;
}

export function usePortfolioData() {
  const context = useContext(DataContext);
  if (!context) throw new Error("usePortfolioData must be used inside DataProvider");
  return context;
}
