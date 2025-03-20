/**
 * 🔧 Utilitaire
 * Convertit un SVG encodé en base64 en PNG dataURL à la volée puis retourne une image PNG utilisable dans un <img> compatible canvas
 * @param {string} svgBase64 - Le contenu base64 d'un SVG (sans header)
 * @param {number} width - largeur du PNG généré (par défaut : 14px)
 * @param {number} height - hauteur du PNG généré (par défaut : 14px)
 * @returns {Promise<string>} data:image/png;base64,...
 */
export async function svgBase64ToPngDataUrl(svgBase64, width = 14, height = 14) {
  return new Promise((resolve, reject) => {
    let svgText;

    // décoder le SVG base64
    try {
      svgText = atob(svgBase64);
    } catch (e) {
      return reject(new Error("❌ Impossible de décoder le SVG base64"));
    }

    // corriger les SVG mal fermés ou mal formés
    svgText = svgText
      .replace(/<svg([^>]*)<g/, '<svg$1><g') // <svg ... <g → <svg...><g>
      .replace(/<\/g[^>]*?>/g, '</g>') // force fermeture propre de </g>
      .replace(/<g\s+([^>]*)height="([^"]*)"/g, '<g $1') // supprime height="..." mal placé
      .replace(/width="([^"]*)"\s+<g/, 'width="$1"> <g'); // force fermeture <svg>

    // injecter viewBox, width, height si manquants
    const hasViewBox = /viewBox\s*=\s*["'].*?["']/.test(svgText);
    const hasWidth = /width\s*=\s*["'].*?["']/.test(svgText);
    const hasHeight = /height\s*=\s*["'].*?["']/.test(svgText);

    if (!hasViewBox) {
      svgText = svgText.replace(/<svg([^>]*)>/, '<svg$1 viewBox="0 0 100 100">');
    }
    if (!hasWidth) {
      svgText = svgText.replace(/<svg([^>]*)>/, `<svg$1 width="${width}">`);
    }
    if (!hasHeight) {
      svgText = svgText.replace(/<svg([^>]*)>/, `<svg$1 height="${height}">`);
    }

    // encodage UTF-8 → base64 safe
    try {
      const encoder = new TextEncoder();
      const uint8Array = encoder.encode(svgText);
      const binaryString = Array.from(uint8Array).map(byte => String.fromCharCode(byte)).join('');
      var correctedBase64 = btoa(binaryString);
    } catch (e) {
      return reject(new Error("❌ Erreur lors de l'encodage du SVG corrigé"));
    }

    // création de l'image et dessin sur canvas
    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = async () => {
      try {
        if ('decode' in img) await img.decode();
      } catch (_) {}

      if (img.naturalWidth === 0 || img.naturalHeight === 0) {
        return reject(new Error("❌ L'image SVG n'a pas de taille (0x0)"));
      }

      const canvas = document.createElement("canvas");
      canvas.width = width > 0 ? width : 14;
      canvas.height = height > 0 ? height : 14;

      const ctx = canvas.getContext("2d");

      try {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL("image/png");

        if (!dataUrl || dataUrl.length < 100) {
          return reject(new Error("❌ Image PNG générée est vide ou invalide"));
        }

        resolve(dataUrl);
      } catch (e) {
        reject(new Error("❌ drawImage a échoué sur le canvas"));
      }
    };

    img.onerror = () => reject(new Error("❌ Chargement du SVG échoué"));

    img.src = `data:image/svg+xml;base64,${correctedBase64}`;
  });
}