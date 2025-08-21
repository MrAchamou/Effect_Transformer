
/**
 * Adaptateur universel pour gérer ES Modules et CommonJS
 */

// Fonction pour importer des modules de façon universelle
export async function universalImport(modulePath) {
  try {
    // Tenter un import ES Module
    if (typeof import !== 'undefined') {
      const module = await import(modulePath);
      return module.default || module;
    }
  } catch (esError) {
    console.log(`ES import failed for ${modulePath}, trying CommonJS...`);
  }

  try {
    // Fallback vers require
    if (typeof require !== 'undefined') {
      return require(modulePath);
    }
  } catch (cjsError) {
    throw new Error(`Failed to load module ${modulePath}: ${cjsError.message}`);
  }
}

// Fonction pour exporter de façon universelle
export function universalExport(obj) {
  // Export ES Module
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = obj;
  }
  // Export CommonJS
  return obj;
}

// Détection du type de module
export function getModuleType() {
  if (typeof module !== 'undefined' && module.exports) {
    return 'commonjs';
  }
  if (typeof import.meta !== 'undefined') {
    return 'esmodule';
  }
  return 'unknown';
}

// Export compatible
const compatibility = {
  universalImport,
  universalExport,
  getModuleType
};

// Support des deux formats
if (typeof module !== 'undefined' && module.exports) {
  module.exports = compatibility;
}

export default compatibility;
