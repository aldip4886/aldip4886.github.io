/**
 * storage.js — Manages local storage persistence for visited units, assessment progress, and user preferences.
 */

const STORAGE_KEY = 'djbc_org_explorer_v5';

class StorageManager {
  constructor() {
    this.data = this.load();
  }

  load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.warn('localStorage is not accessible, using fallback memory storage.', e);
    }
    return {
      visitedUnits: [],
      completedTopics: [],
      assessmentScores: {},
      earnedBadges: [],
      lastVisitedUnit: 'djbc',
      preferences: {
        reducedMotion: false,
        theme: 'light'
      }
    };
  }

  save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
    } catch (e) {
      console.warn('Failed to save to localStorage.', e);
    }
  }

  addVisitedUnit(unitId) {
    if (!unitId) return;
    if (!this.data.visitedUnits.includes(unitId)) {
      this.data.visitedUnits.push(unitId);
    }
    this.data.lastVisitedUnit = unitId;
    this.save();
  }

  recordVisitedUnit(unitId) {
    this.addVisitedUnit(unitId);
  }

  getVisitedUnits() {
    return this.data.visitedUnits || [];
  }

  saveAssessmentScore(quizId, score) {
    if (!this.data.assessmentScores) this.data.assessmentScores = {};
    this.data.assessmentScores[quizId] = score;
    this.save();
  }

  addBadge(badgeId) {
    if (!this.data.earnedBadges) this.data.earnedBadges = [];
    if (!this.data.earnedBadges.includes(badgeId)) {
      this.data.earnedBadges.push(badgeId);
      this.save();
    }
  }

  clearProgress() {
    this.data = {
      visitedUnits: [],
      completedTopics: [],
      assessmentScores: {},
      earnedBadges: [],
      lastVisitedUnit: 'djbc',
      preferences: { reducedMotion: false, theme: 'light' }
    };
    this.save();
  }
}

export const storage = new StorageManager();
