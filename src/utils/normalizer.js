
function cleanBrandName(name) {
  // Remove common suffixes found in the brand list
  // Order matters: longer suffixes first to avoid partial removal
  let cleaned = name;
  
  // Suffixes to remove
  const suffixes = [
    ' Instant Vouchers',
    ' Instant Voucher',
    ' EGift Card',
    ' eGift Card',
    '-Luxe',
    ' Luxe',
    '-luxe',
    ' luxe'
  ];



  for (const suffix of suffixes) {
    if (cleaned.endsWith(suffix)) {
      cleaned = cleaned.substring(0, cleaned.length - suffix.length);
    }
  }

  // The above loop handles endsWith. If multiple suffixes exist (e.g. "-Luxe Instant Voucher"), 
  // we might need to loop until no changes.
  
  // Regex patterns to remove from end of string
  // \s* handles optional spaces before the suffix
  const patterns = [
    /\s+Instant Vouchers?$/i,
    /\s+EGift Card$/i,
    /-Luxe$/i,
    /\s+Luxe$/i
  ];

  let previous;
  do {
    previous = cleaned;
    for (const pattern of patterns) {
      cleaned = cleaned.replace(pattern, '');
    }
    cleaned = cleaned.trim();
  } while (cleaned !== previous); // Repeat in case of nested suffixes like " - Luxe Instant Voucher"

  return cleaned;
}

function normalizeForMatch(str) {
  if (!str) return '';
  return str.toLowerCase().trim();
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

module.exports = { cleanBrandName, normalizeForMatch, escapeRegExp };
