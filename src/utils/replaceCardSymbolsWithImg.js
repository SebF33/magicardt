import {
  svgBase64ToPngDataUrl
} from './svgBase64ToPngDataUrl.js';

/**
 * 🔧 Utilitaire
 * Remplace dans un élément DOM les symboles utilisant des SVG base64 par des <img> PNG générés à la volée
 */
export async function replaceCardSymbolsWithImg(rootElement) {
  const elements = rootElement.querySelectorAll('.card-symbol');

  for (const el of elements) {
    const computedStyle = window.getComputedStyle(el);
    const bgImage = computedStyle.backgroundImage;

    const match = bgImage.match(/^url\("data:image\/svg\+xml;base64,([\s\S]*?)"\)$/);
    if (!match) continue;

    const base64Raw = match[1].replace(/\s+/g, "");
    let svgText;

    try {
      svgText = atob(base64Raw);
    } catch (e) {
      console.warn("SVG base64 invalide :", e);
      continue;
    }

    // nettoyage du contenu SVG
    svgText = svgText
      .replace(/=\s*'([^']+)'/g, '="$1"') // quotes simples → doubles
      .replace(/<g\s+([^>]*?)fill="none"/gi, '<g $1'); // supprime fill="none" sur <g>

    const base64Clean = btoa(unescape(encodeURIComponent(svgText)));

    // vérifie que l'élément a des dimensions visibles
    if (computedStyle.width === '0px' || computedStyle.height === '0px') {
      console.warn("Symbole ignoré (0px)", el.outerHTML);
      continue;
    }

    try {
      const pngDataUrl = await svgBase64ToPngDataUrl(base64Clean, 14, 14);

      // vérifie que le PNG est bien formé
      if (!pngDataUrl || pngDataUrl.length < 100) {
        console.warn("PNG vide ou trop court", pngDataUrl);
        continue;
      }

      const img = document.createElement("img");
      img.src = pngDataUrl;
      img.style.display = "inline-block";
      img.style.width = computedStyle.width;
      img.style.height = computedStyle.height;
      img.style.borderRadius = computedStyle.borderRadius;
      img.style.boxShadow = computedStyle.boxShadow;
      img.style.margin = computedStyle.margin;

      el.replaceWith(img);

      console.log("✅ Symbole remplacé par PNG", img.src.slice(0, 60) + "…");

    } catch (err) {
      console.warn("❌ Erreur de conversion SVG → PNG :", err, el.outerHTML);
    }
  }
}