/**
 * scorm.js — Isolated SCORM 1.2 API Wrapper for LMS Communication.
 */

class ScormAdapter {
  constructor() {
    this.api = null;
    this.initialized = false;
  }

  findAPI(win) {
    let findAttempts = 0;
    while ((win.API == null) && (win.parent != null) && (win.parent != win)) {
      findAttempts++;
      if (findAttempts > 7) return null;
      win = win.parent;
    }
    return win.API || null;
  }

  init() {
    try {
      this.api = this.findAPI(window);
      if (!this.api && window.opener) {
        this.api = this.findAPI(window.opener);
      }

      if (this.api) {
        const result = this.api.LMSInitialize("");
        if (result === "true" || result === true) {
          this.initialized = true;
          console.log("SCORM 1.2 API initialized successfully.");
          this.setValue("cmi.core.lesson_status", "incomplete");
          this.commit();
        }
      } else {
        console.warn("SCORM 1.2 API not found. Running in standalone mode.");
      }
    } catch (e) {
      console.warn("SCORM initialization failed:", e);
    }
  }

  initialize() {
    return this.init();
  }

  setValue(element, value) {
    if (this.initialized && this.api) {
      this.api.LMSSetValue(element, value);
    }
  }

  getValue(element) {
    if (this.initialized && this.api) {
      return this.api.LMSGetValue(element);
    }
    return "";
  }

  commit() {
    if (this.initialized && this.api) {
      this.api.LMSCommit("");
    }
  }

  setCompletion(score = 100, passed = true) {
    if (this.initialized && this.api) {
      this.setValue("cmi.core.score.raw", score.toString());
      this.setValue("cmi.core.lesson_status", passed ? "passed" : "completed");
      this.commit();
    }
  }

  finish() {
    if (this.initialized && this.api) {
      this.api.LMSFinish("");
      this.initialized = false;
    }
  }
}

export const scorm = new ScormAdapter();
