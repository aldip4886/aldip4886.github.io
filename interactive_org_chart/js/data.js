/**
 * Data Access Layer & Cache Manager
 * Aligned with PRD v2.0 (Offline-first, static JSON loader)
 */

window.Data = {
    cache: {},
    basePath: 'data/',

    /**
     * Loads a JSON file from the data/ directory with memory caching.
     * @param {string} filename - The name of the file (e.g., 'kantor-pusat')
     * @returns {Promise<Object>} The parsed JSON object
     */
    async load(filename) {
        // Strip .json extension if present
        const name = filename.endsWith('.json') ? filename.substring(0, filename.length - 5) : filename;
        const varName = name.replace(/-/g, '_');
        
        // Return from global variable if loaded via script tag (bypasses local file CORS block)
        if (window[`data_${varName}`]) {
            return window[`data_${varName}`];
        }
        
        // Return from cache if available
        if (this.cache[name]) {
            return this.cache[name];
        }

        const url = `${this.basePath}${name}.json`;
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            
            // Save to memory cache
            this.cache[name] = data;
            return data;
        } catch (error) {
            console.error(`Error loading data file [${url}]:`, error);
            
            // Throw the error so the caller can show a user-friendly message
            throw error;
        }
    },

    /**
     * Finds a unit by ID recursively in the organizational tree.
     * @param {Object} node - The current tree node (e.g., DJBC root)
     * @param {string} id - Target unit ID
     * @returns {Object|null} The matching unit node or null
     */
    findUnitById(node, id) {
        if (!node) return null;
        if (node.id === id) return node;
        
        if (node.children && Array.isArray(node.children)) {
            for (const child of node.children) {
                const found = this.findUnitById(child, id);
                if (found) return found;
            }
        }
        
        // Check sub_units if any (e.g. Bidang/Bagian in Kanwil that are not in primary children)
        if (node.sub_units && Array.isArray(node.sub_units)) {
            for (const sub of node.sub_units) {
                const found = this.findUnitById(sub, id);
                if (found) return found;
            }
        }
        
        return null;
    },

    /**
     * Get a specific Kantor Pusat unit details by ID
     * @param {string} id
     */
    async getKantorPusatUnit(id) {
        const root = await this.load('kantor-pusat');
        return this.findUnitById(root, id);
    },

    /**
     * Get a specific Instansi Vertikal unit (Kanwil/KPU/KPPBC) details by ID
     * @param {string} id
     */
    async getVertikalUnit(id) {
        const root = await this.load('instansi-vertikal');
        return this.findUnitById(root, id);
    },

    /**
     * Get a specific UPT unit (BLBC/PSO) details by ID
     * @param {string} id
     */
    async getUptUnit(id) {
        const root = await this.load('upt');
        return this.findUnitById(root, id);
    },
    
    /**
     * Global resolver for any unit ID across Kanpus, Vertikal, and UPT
     * @param {string} id 
     */
    async getUnit(id) {
        // Try Kanpus first
        try {
            const kanpus = await this.getKantorPusatUnit(id);
            if (kanpus) return { data: kanpus, category: 'kanpus' };
        } catch(e) {}
        
        // Try Vertikal next
        try {
            const vertikal = await this.getVertikalUnit(id);
            if (vertikal) {
                // Determine subclass
                if (id.startsWith('kanwil-')) return { data: vertikal, category: 'kanwil' };
                if (id.startsWith('kpu-')) return { data: vertikal, category: 'kpu' };
                return { data: vertikal, category: 'kppbc' };
            }
        } catch(e) {}
        
        // Try UPT last
        try {
            const upt = await this.getUptUnit(id);
            if (upt) {
                if (id.startsWith('blbc-')) return { data: upt, category: 'blbc' };
                return { data: upt, category: 'pso' };
            }
        } catch(e) {}
        
        return null;
    },

    /**
     * Find parent of a node recursively
     * @param {Object} node
     * @param {string} childId
     */
    findParentNode(node, childId) {
        if (!node) return null;
        
        // Check children
        if (node.children && Array.isArray(node.children)) {
            for (const child of node.children) {
                if (child.id === childId) return node;
                const found = this.findParentNode(child, childId);
                if (found) return found;
            }
        }
        
        // Check sub_units
        if (node.sub_units && Array.isArray(node.sub_units)) {
            for (const sub of node.sub_units) {
                if (sub.id === childId) return node;
                const found = this.findParentNode(sub, childId);
                if (found) return found;
            }
        }
        
        return null;
    },

    /**
     * Get a specific unit with its parent node (fallback search)
     * @param {string} id
     */
    async getUnitWithParent(id) {
        const kanpusRoot = await this.load('kantor-pusat');
        let parent = this.findParentNode(kanpusRoot, id);
        if (parent) {
            const child = this.findUnitById(kanpusRoot, id);
            return { data: child, parent: parent, source: 'kantor-pusat' };
        }
        
        const vertikalRoot = await this.load('instansi-vertikal');
        parent = this.findParentNode(vertikalRoot, id);
        if (parent) {
            const child = this.findUnitById(vertikalRoot, id);
            return { data: child, parent: parent, source: 'instansi-vertikal' };
        }
        
        const uptRoot = await this.load('upt');
        parent = this.findParentNode(uptRoot, id);
        if (parent) {
            const child = this.findUnitById(uptRoot, id);
            return { data: child, parent: parent, source: 'upt' };
        }
        
        return null;
    },

    /**
     * Resolve child unit detail directly within parent unit
     * @param {string} parentId
     * @param {string} childId
     */
    async getUnitByParentAndChild(parentId, childId) {
        const parentResult = await this.getUnit(parentId);
        if (!parentResult || !parentResult.data) return null;
        
        const parent = parentResult.data;
        
        // Find child in children
        let child = null;
        if (parent.children && Array.isArray(parent.children)) {
            child = parent.children.find(c => c.id === childId);
        }
        
        // Find child in sub_units if not found
        if (!child && parent.sub_units && Array.isArray(parent.sub_units)) {
            child = parent.sub_units.find(s => s.id === childId);
        }
        
        if (!child) return null;
        
        // Determine source category
        let source = 'kantor-pusat';
        if (parentId.startsWith('kanwil-') || parentId.startsWith('kpu-') || parentId.startsWith('kppbc-')) {
            source = 'instansi-vertikal';
        } else if (parentId.startsWith('blbc-') || parentId.startsWith('pso-')) {
            source = 'upt';
        }
        
        return { data: child, parent: parent, source: source };
    }
};
