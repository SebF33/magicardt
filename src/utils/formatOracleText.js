import {
  formatSymbols
} from './formatSymbols.js';

/**
 * 🔧 Utilitaire
 * Formater le texte Oracle
 */
export function formatOracleText(data) {
  const formattedData = data.replace(/\n/g, "<br/>");
  return formatSymbols(formattedData);
};