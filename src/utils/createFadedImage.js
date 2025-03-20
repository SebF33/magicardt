/**
 * 🔧 Utilitaire
 * Crée une image PNG avec effet de fondu sur les bords
 * @param {HTMLImageElement} image - Image source déjà chargée
 * @param {number} width - largeur de l'image dans le PDF
 * @param {number} height - hauteur de l'image dans le PDF
 * @param {number} scaleFactor - multiplicateur de qualité
 * @param {string} bgColor - couleur de fond
 * @returns {string} - dataURL PNG avec fondu
 */
export function createFadedImage(image, width, height, scaleFactor, bgColor) {
  const canvas = document.createElement("canvas");
  canvas.width = width * scaleFactor;
  canvas.height = height * scaleFactor;

  const ctx = canvas.getContext("2d");
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

  const fadeSize = 30 * scaleFactor;

  // parse la couleur de fond en rgba
  const rgbaMatch = bgColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  const fallback = "rgba(255,255,255,0)";
  const transparentBg = rgbaMatch ?
    `rgba(${rgbaMatch[1]}, ${rgbaMatch[2]}, ${rgbaMatch[3]}, 0)` :
    fallback;

  // dégradé haut
  let gradient = ctx.createLinearGradient(0, 0, 0, fadeSize);
  gradient.addColorStop(0, bgColor);
  gradient.addColorStop(1, transparentBg);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, fadeSize);

  // dégradé bas
  gradient = ctx.createLinearGradient(0, canvas.height - fadeSize, 0, canvas.height);
  gradient.addColorStop(0, transparentBg);
  gradient.addColorStop(1, bgColor);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, canvas.height - fadeSize, canvas.width, fadeSize);

  // dégradé gauche
  gradient = ctx.createLinearGradient(0, 0, fadeSize, 0);
  gradient.addColorStop(0, bgColor);
  gradient.addColorStop(1, transparentBg);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, fadeSize, canvas.height);

  // dégradé droit
  gradient = ctx.createLinearGradient(canvas.width - fadeSize, 0, canvas.width, 0);
  gradient.addColorStop(0, transparentBg);
  gradient.addColorStop(1, bgColor);
  ctx.fillStyle = gradient;
  ctx.fillRect(canvas.width - fadeSize, 0, fadeSize, canvas.height);

  return canvas.toDataURL("image/png");
}