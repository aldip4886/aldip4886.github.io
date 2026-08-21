/**
 * data-loader.js — Packaged data loader supporting both fetch() and direct file:// inlined window JS variables.
 */

class DataLoader {
  constructor() {
    this.cache = {};
  }

  async loadJSON(filename, globalVarName) {
    if (this.cache[filename]) {
      return this.cache[filename];
    }

    // Direct check for inlined window variable (supports opening via double-clicking index.html on file:// protocol without web server!)
    if (globalVarName && window[globalVarName]) {
      this.cache[filename] = window[globalVarName];
      return window[globalVarName];
    }

    try {
      const response = await fetch(`data/${filename}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      this.cache[filename] = data;
      return data;
    } catch (e) {
      if (globalVarName && window[globalVarName]) {
        this.cache[filename] = window[globalVarName];
        return window[globalVarName];
      }
      console.error(`Failed to load data/${filename}:`, e);
      return null;
    }
  }

  async getOrganizationTree() {
    return await this.loadJSON('organization.json', 'DATA_ORGANIZATION');
  }

  async getUnitsDict() {
    return await this.loadJSON('units.json', 'DATA_UNITS');
  }

  async getRelationships() {
    return await this.loadJSON('relationships.json', 'DATA_RELATIONSHIPS');
  }

  async getAssessments() {
    return await this.loadJSON('assessments.json', 'DATA_ASSESSMENTS');
  }

  async getSearchIndex() {
    return await this.loadJSON('search_index.json', 'DATA_SEARCH_INDEX');
  }

  async getGeoUnits() {
    return await this.loadJSON('geo_units.json', 'DATA_GEO_UNITS');
  }

  async getKanwilMapping() {
    return await this.loadJSON('kanwil_mapping.json', 'DATA_KANWIL_MAPPING');
  }

  async getAlurProses() {
    return await this.loadJSON('alur_proses.json', 'DATA_ALUR_PROSES');
  }

  async getLearningPaths() {
    return await this.loadJSON('learning_paths.json', 'DATA_LEARNING_PATHS');
  }

  async getQuickFacts() {
    return await this.loadJSON('quickfacts.json', 'DATA_QUICKFACTS');
  }

  async getProvinceGeo() {
    return await this.loadJSON('province_geo.json', 'DATA_PROVINCE_GEO');
  }
}


export const dataLoader = new DataLoader();
