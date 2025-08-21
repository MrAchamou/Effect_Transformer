
/**
 * Adaptateur universel ES pour gérer uniquement ES Modules
 * Version simplifiée - Plus de support CommonJS
 */

// Fonction pour importer des modules ES de façon universelle
export async function universalImport(modulePath) {
  try {
    const module = await import(modulePath);
    return module.default || module;
  } catch (error) {
    throw new Error(`Failed to load ES module ${modulePath}: ${error.message}`);
  }
}

// Fonction pour exporter de façon ES pure
export function universalExport(obj) {
  return obj;
}

// Détection du type de module (toujours ES maintenant)
export function getModuleType() {
  return 'esmodule';
}

// Validation ES module
export function validateESModule(code) {
  return code.includes('export') || code.includes('import');
}

// Conversion automatique vers ES
export function ensureESModule(code) {
  if (validateESModule(code)) {
    return code;
  }

  // Ajouter export par défaut si manquant
  const className = code.match(/class\s+(\w+)/);
  if (className) {
    return code + `\n\nexport default ${className[1]};`;
  }

  return code;
}

// Export par défaut
const compatibility = {
  universalImport,
  universalExport,
  getModuleType,
  validateESModule,
  ensureESModule
};

export default compatibility;
