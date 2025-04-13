/**
 * 🔧 Utilitaire
 * Formater la symbologie
 */
export function formatSymbols(data) {
  const formattedData = data
    // Divers
    .replaceAll(
      "{T}",
      '<abbr class="card-symbol card-symbol-T" title="Engagez ce permanent">{T}</abbr>'
    )
    .replaceAll(
      "{Q}",
      '<abbr class="card-symbol card-symbol-Q" title="Dégagez ce permanent">{Q}</abbr>'
    )
    .replaceAll(
      "{E}",
      '<abbr class="card-symbol card-symbol-E" title="Marqueur &quot;énergie&quot;">{E}</abbr>'
    )
    .replaceAll(
      "{CHAOS}",
      '<abbr class="card-symbol card-symbol-CHAOS" title="Chaos">{CHAOS}</abbr>'
    )
    .replaceAll(
      "{A}",
      '<abbr class="card-symbol card-symbol-A" title="Marqueur &quot;gland&quot;">{A}</abbr>'
    )
    // Générique
    .replaceAll(
      "{X}",
      '<abbr class="card-symbol card-symbol-X" title="Mana générique : X">{X}</abbr>'
    )
    .replaceAll(
      "{Y}",
      '<abbr class="card-symbol card-symbol-Y" title="Mana générique : Y">{Y}</abbr>'
    )
    .replaceAll(
      "{Z}",
      '<abbr class="card-symbol card-symbol-Z" title="Mana générique : Z">{Z}</abbr>'
    )
    .replaceAll(
      "{½}",
      '<abbr class="card-symbol card-symbol-HALF" title="Mana générique : ½">{½}</abbr>'
    )
    .replaceAll(
      "{0}",
      '<abbr class="card-symbol card-symbol-0" title="Mana : 0">{0}</abbr>'
    )
    .replaceAll(
      "{1}",
      '<abbr class="card-symbol card-symbol-1" title="Mana générique : 1">{1}</abbr>'
    )
    .replaceAll(
      "{2}",
      '<abbr class="card-symbol card-symbol-2" title="Mana générique : 2">{2}</abbr>'
    )
    .replaceAll(
      "{3}",
      '<abbr class="card-symbol card-symbol-3" title="Mana générique : 3">{3}</abbr>'
    )
    .replaceAll(
      "{4}",
      '<abbr class="card-symbol card-symbol-4" title="Mana générique : 4">{4}</abbr>'
    )
    .replaceAll(
      "{5}",
      '<abbr class="card-symbol card-symbol-5" title="Mana générique : 5">{5}</abbr>'
    )
    .replaceAll(
      "{6}",
      '<abbr class="card-symbol card-symbol-6" title="Mana générique : 6">{6}</abbr>'
    )
    .replaceAll(
      "{7}",
      '<abbr class="card-symbol card-symbol-7" title="Mana générique : 7">{7}</abbr>'
    )
    .replaceAll(
      "{8}",
      '<abbr class="card-symbol card-symbol-8" title="Mana générique : 8">{8}</abbr>'
    )
    .replaceAll(
      "{9}",
      '<abbr class="card-symbol card-symbol-9" title="Mana générique : 9">{9}</abbr>'
    )
    .replaceAll(
      "{10}",
      '<abbr class="card-symbol card-symbol-10" title="Mana générique : 10">{10}</abbr>'
    )
    .replaceAll(
      "{11}",
      '<abbr class="card-symbol card-symbol-11" title="Mana générique : 11">{11}</abbr>'
    )
    .replaceAll(
      "{12}",
      '<abbr class="card-symbol card-symbol-12" title="Mana générique : 12">{12}</abbr>'
    )
    .replaceAll(
      "{13}",
      '<abbr class="card-symbol card-symbol-13" title="Mana générique : 13">{13}</abbr>'
    )
    .replaceAll(
      "{14}",
      '<abbr class="card-symbol card-symbol-14" title="Mana générique : 14">{14}</abbr>'
    )
    .replaceAll(
      "{15}",
      '<abbr class="card-symbol card-symbol-15" title="Mana générique : 15">{15}</abbr>'
    )
    .replaceAll(
      "{16}",
      '<abbr class="card-symbol card-symbol-16" title="Mana générique : 16">{16}</abbr>'
    )
    .replaceAll(
      "{17}",
      '<abbr class="card-symbol card-symbol-17" title="Mana générique : 17">{17}</abbr>'
    )
    .replaceAll(
      "{18}",
      '<abbr class="card-symbol card-symbol-18" title="Mana générique : 18">{18}</abbr>'
    )
    .replaceAll(
      "{19}",
      '<abbr class="card-symbol card-symbol-19" title="Mana générique : 19">{19}</abbr>'
    )
    .replaceAll(
      "{20}",
      '<abbr class="card-symbol card-symbol-20" title="Mana générique : 20">{20}</abbr>'
    )
    .replaceAll(
      "{100}",
      '<abbr class="card-symbol card-symbol-100" title="Mana générique : 100">{100}</abbr>'
    )
    .replaceAll(
      "{1000000}",
      '<abbr class="card-symbol card-symbol-1000000" title="Mana générique : 1000000">{1000000}</abbr>'
    )
    .replaceAll(
      "{∞}",
      '<abbr class="card-symbol card-symbol-INFINITY" title="Mana générique : ∞">{∞}</abbr>'
    )
    // Couleurs
    .replaceAll(
      "{W}",
      '<abbr class="card-symbol card-symbol-W" title="Mana blanc">{W}</abbr>'
    )
    .replaceAll(
      "{U}",
      '<abbr class="card-symbol card-symbol-U" title="Mana bleu">{U}</abbr>'
    )
    .replaceAll(
      "{B}",
      '<abbr class="card-symbol card-symbol-B" title="Mana noir">{B}</abbr>'
    )
    .replaceAll(
      "{R}",
      '<abbr class="card-symbol card-symbol-R" title="Mana rouge">{R}</abbr>'
    )
    .replaceAll(
      "{G}",
      '<abbr class="card-symbol card-symbol-G" title="Mana vert">{G}</abbr>'
    )
    .replaceAll(
      "{C}",
      '<abbr class="card-symbol card-symbol-C" title="Mana incolore">{C}</abbr>'
    )
    .replaceAll(
      "{S}",
      '<abbr class="card-symbol card-symbol-S" title="Mana neige">{S}</abbr>'
    )
    // Hybrides (deux couleurs)
    .replaceAll(
      "{W/U}",
      '<abbr class="card-symbol card-symbol-WU" title="Mana hybride : blanc ou bleu">{W/U}</abbr>'
    )
    .replaceAll(
      "{W/B}",
      '<abbr class="card-symbol card-symbol-WB" title="Mana hybride : blanc ou noir">{W/B}</abbr>'
    )
    .replaceAll(
      "{W/R}",
      '<abbr class="card-symbol card-symbol-WR" title="Mana hybride : blanc ou rouge">{W/R}</abbr>'
    )
    .replaceAll(
      "{W/G}",
      '<abbr class="card-symbol card-symbol-WG" title="Mana hybride : blanc ou vert">{W/G}</abbr>'
    )
    .replaceAll(
      "{U/B}",
      '<abbr class="card-symbol card-symbol-UB" title="Mana hybride : bleu ou noir">{U/B}</abbr>'
    )
    .replaceAll(
      "{U/R}",
      '<abbr class="card-symbol card-symbol-UR" title="Mana hybride : bleu ou rouge">{U/R}</abbr>'
    )
    .replaceAll(
      "{U/G}",
      '<abbr class="card-symbol card-symbol-UG" title="Mana hybride : bleu ou vert">{U/G}</abbr>'
    )
    .replaceAll(
      "{B/R}",
      '<abbr class="card-symbol card-symbol-BR" title="Mana hybride : noir ou rouge">{B/R}</abbr>'
    )
    .replaceAll(
      "{B/G}",
      '<abbr class="card-symbol card-symbol-BG" title="Mana hybride : noir ou vert">{B/G}</abbr>'
    )
    .replaceAll(
      "{R/G}",
      '<abbr class="card-symbol card-symbol-RG" title="Mana hybride : rouge ou vert">{R/G}</abbr>'
    )
    // Hybrides (2 ou couleur)
    .replaceAll(
      "{2/W}",
      '<abbr class="card-symbol card-symbol-2W" title="Mana hybride : 2 ou blanc">{2/W}</abbr>'
    )
    .replaceAll(
      "{2/U}",
      '<abbr class="card-symbol card-symbol-2U" title="Mana hybride : 2 ou bleu">{2/U}</abbr>'
    )
    .replaceAll(
      "{2/B}",
      '<abbr class="card-symbol card-symbol-2B" title="Mana hybride : 2 ou noir">{2/B}</abbr>'
    )
    .replaceAll(
      "{2/R}",
      '<abbr class="card-symbol card-symbol-2R" title="Mana hybride : 2 ou rouge">{2/R}</abbr>'
    )
    .replaceAll(
      "{2/G}",
      '<abbr class="card-symbol card-symbol-2G" title="Mana hybride : 2 ou vert">{2/G}</abbr>'
    )
    // Phyrexians
    .replaceAll(
      "{W/P}",
      '<abbr class="card-symbol card-symbol-WP" title="Mana phyrexian : blanc">{W/P}</abbr>'
    )
    .replaceAll(
      "{U/P}",
      '<abbr class="card-symbol card-symbol-UP" title="Mana phyrexian : bleu">{U/P}</abbr>'
    )
    .replaceAll(
      "{B/P}",
      '<abbr class="card-symbol card-symbol-BP" title="Mana phyrexian : noir">{B/P}</abbr>'
    )
    .replaceAll(
      "{R/P}",
      '<abbr class="card-symbol card-symbol-RP" title="Mana phyrexian : rouge">{R/P}</abbr>'
    )
    .replaceAll(
      "{G/P}",
      '<abbr class="card-symbol card-symbol-GP" title="Mana phyrexian : vert">{G/P}</abbr>'
    );
  return formattedData;
};