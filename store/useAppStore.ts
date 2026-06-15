"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  Project,
  Builder,
  Unit,
  SiteVisit,
  FollowUpTask,
  PaymentMilestone,
  AppSettings,
} from "@/types";
import { SEED_PROJECTS, SEED_BUILDERS, DEFAULT_SETTINGS } from "@/lib/seed-data";

interface AppStore {
  // Data
  projects: Project[];
  builders: Builder[];
  units: Unit[];
  siteVisits: SiteVisit[];
  followUps: FollowUpTask[];
  paymentMilestones: PaymentMilestone[];
  settings: AppSettings;

  // Hydration flag
  hydrated: boolean;

  // Project actions
  addProject: (project: Project) => void;
  updateProject: (projectId: string, updates: Partial<Project>) => void;
  deleteProject: (projectId: string) => void;
  getProject: (projectId: string) => Project | undefined;

  // Builder actions
  addBuilder: (builder: Builder) => void;
  updateBuilder: (builderId: string, updates: Partial<Builder>) => void;

  // Unit actions
  addUnit: (unit: Unit) => void;
  updateUnit: (unitId: string, updates: Partial<Unit>) => void;
  deleteUnit: (unitId: string) => void;
  getUnitsForProject: (projectId: string) => Unit[];

  // Site visit actions
  addSiteVisit: (visit: SiteVisit) => void;
  updateSiteVisit: (visitId: string, updates: Partial<SiteVisit>) => void;
  getSiteVisitsForProject: (projectId: string) => SiteVisit[];

  // Follow-up actions
  addFollowUp: (task: FollowUpTask) => void;
  updateFollowUp: (taskId: string, updates: Partial<FollowUpTask>) => void;
  deleteFollowUp: (taskId: string) => void;
  getFollowUpsForProject: (projectId: string) => FollowUpTask[];

  // Payment actions
  addPaymentMilestone: (milestone: PaymentMilestone) => void;
  updatePaymentMilestone: (milestoneId: string, updates: Partial<PaymentMilestone>) => void;

  // Settings
  updateSettings: (updates: Partial<AppSettings>) => void;

  // Reset / seed
  resetToSeedData: () => void;
  clearAllData: () => void;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      projects: SEED_PROJECTS,
      builders: SEED_BUILDERS,
      units: [],
      siteVisits: [],
      followUps: [],
      paymentMilestones: [],
      settings: DEFAULT_SETTINGS,
      hydrated: false,

      // Projects
      addProject: (project) =>
        set((s) => ({ projects: [...s.projects, project] })),
      updateProject: (projectId, updates) =>
        set((s) => ({
          projects: s.projects.map((p) =>
            p.projectId === projectId
              ? { ...p, ...updates, updatedAt: new Date().toISOString() }
              : p
          ),
        })),
      deleteProject: (projectId) =>
        set((s) => ({
          projects: s.projects.filter((p) => p.projectId !== projectId),
          units: s.units.filter((u) => u.projectId !== projectId),
          siteVisits: s.siteVisits.filter((v) => v.projectId !== projectId),
          followUps: s.followUps.filter((f) => f.projectId !== projectId),
        })),
      getProject: (projectId) =>
        get().projects.find((p) => p.projectId === projectId),

      // Builders
      addBuilder: (builder) =>
        set((s) => ({ builders: [...s.builders, builder] })),
      updateBuilder: (builderId, updates) =>
        set((s) => ({
          builders: s.builders.map((b) =>
            b.builderId === builderId
              ? { ...b, ...updates, updatedAt: new Date().toISOString() }
              : b
          ),
        })),

      // Units
      addUnit: (unit) => set((s) => ({ units: [...s.units, unit] })),
      updateUnit: (unitId, updates) =>
        set((s) => ({
          units: s.units.map((u) =>
            u.unitId === unitId
              ? { ...u, ...updates, updatedAt: new Date().toISOString() }
              : u
          ),
        })),
      deleteUnit: (unitId) =>
        set((s) => ({ units: s.units.filter((u) => u.unitId !== unitId) })),
      getUnitsForProject: (projectId) =>
        get().units.filter((u) => u.projectId === projectId),

      // Site Visits
      addSiteVisit: (visit) =>
        set((s) => ({ siteVisits: [...s.siteVisits, visit] })),
      updateSiteVisit: (visitId, updates) =>
        set((s) => ({
          siteVisits: s.siteVisits.map((v) =>
            v.visitId === visitId
              ? { ...v, ...updates, updatedAt: new Date().toISOString() }
              : v
          ),
        })),
      getSiteVisitsForProject: (projectId) =>
        get().siteVisits.filter((v) => v.projectId === projectId),

      // Follow-ups
      addFollowUp: (task) =>
        set((s) => ({ followUps: [...s.followUps, task] })),
      updateFollowUp: (taskId, updates) =>
        set((s) => ({
          followUps: s.followUps.map((f) =>
            f.taskId === taskId
              ? { ...f, ...updates, updatedAt: new Date().toISOString() }
              : f
          ),
        })),
      deleteFollowUp: (taskId) =>
        set((s) => ({ followUps: s.followUps.filter((f) => f.taskId !== taskId) })),
      getFollowUpsForProject: (projectId) =>
        get().followUps.filter((f) => f.projectId === projectId),

      // Payments
      addPaymentMilestone: (milestone) =>
        set((s) => ({ paymentMilestones: [...s.paymentMilestones, milestone] })),
      updatePaymentMilestone: (milestoneId, updates) =>
        set((s) => ({
          paymentMilestones: s.paymentMilestones.map((m) =>
            m.milestoneId === milestoneId ? { ...m, ...updates } : m
          ),
        })),

      // Settings
      updateSettings: (updates) =>
        set((s) => ({ settings: { ...s.settings, ...updates } })),

      // Reset / Clear
      resetToSeedData: () =>
        set({
          projects: SEED_PROJECTS,
          builders: SEED_BUILDERS,
          units: [],
          siteVisits: [],
          followUps: [],
          paymentMilestones: [],
          settings: DEFAULT_SETTINGS,
        }),
      clearAllData: () =>
        set({
          projects: [],
          builders: [],
          units: [],
          siteVisits: [],
          followUps: [],
          paymentMilestones: [],
          settings: DEFAULT_SETTINGS,
        }),
    }),
    {
      name: "home-decision-cockpit-v1",
      onRehydrateStorage: () => (state) => {
        if (state) state.hydrated = true;
      },
    }
  )
);
