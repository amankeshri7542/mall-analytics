const fs = require('fs');
const path = require('path');
const { loadMalls, loadBrands } = require('./utils/dataLoader');
const { cleanBrandName, normalizeForMatch, escapeRegExp } = require('./utils/normalizer');
// Helper to implement matching logic directly or use the matcher module. 
// I'll inline the matching logic here or require it to keep it simple as I can access the loop context better.
// Actually, I'll use the matcher module I created but I need to handle the loop.

// Re-implementing specific matcher usage here to optimize for the Loop structure
function matchStore(storeName, brandList) {
   const normalizedStore = normalizeForMatch(storeName);
   const matches = [];
   
   // We iterate all brands. 
   // Optimization: Filter brands? No, 300 is small.
   for (const brand of brandList) {
     const cleanedBrandName = cleanBrandName(brand.name);
     const normalizedBrand = normalizeForMatch(cleanedBrandName);
     if (!normalizedBrand) continue;

     const escapedBrand = escapeRegExp(normalizedBrand);
     let regexPattern = escapedBrand;
     if (/^\w/.test(normalizedBrand)) regexPattern = '\\b' + regexPattern;
     if (/\w$/.test(normalizedBrand)) regexPattern = regexPattern + '\\b';
     
     const regex = new RegExp(regexPattern, 'i');
     if (regex.test(normalizedStore)) {
       matches.push(brand);
     }
   }
   return matches;
}

function main() {
  const mallsPath = path.join(__dirname, '../data/1252_malls_final (2).json');
  const brandsPath = path.join(__dirname, '../data/Offlinedump-new(Sheet1).csv');
  const outputPath = path.join(__dirname, '../output/final_mall_data.js'); // Brief said .js, usually .json but I'll stick to filename
  const outputJsonPath = path.join(__dirname, '../output/final_mall_data.json');

  console.log('Loading data...');
  const malls = loadMalls(mallsPath);
  const brands = loadBrands(brandsPath);
  console.log(`Loaded ${malls.length} malls and ${brands.length} brands.`);

  const results = [];

  malls.forEach((mall, index) => {
    if (index % 100 === 0) console.log(`Processing mall ${index + 1}/${malls.length}...`);

    const mallBrandsMap = new Map(); // Use Map to ensure unique brands per mall
    const directory = mall.directory || [];

    for (const store of directory) {
      if (!store) continue;
      const matchedBrands = matchStore(store, brands);
      
      for (const brand of matchedBrands) {
        // Deduplicate by cleaned brand name (e.g. "Starbucks Instant Voucher" vs "Starbucks Instant Vouchers")
        const cleanedKey = normalizeForMatch(cleanBrandName(brand.name));
        
        // If brand not already found in this mall
        if (!mallBrandsMap.has(cleanedKey)) {
          mallBrandsMap.set(cleanedKey, {
            "Brand name": brand.name,
            "Product ID": brand.name, // Using Name as ID for now
            "Store name": store
          });
        }
      }
    }

    if (mallBrandsMap.size > 0) {
      const mallRecord = {
        "Mall Name": mall.Name,
        "City": mall.City,
        "State": mall.State,
        "Products": Array.from(mallBrandsMap.values())
      };
      results.push(mallRecord);
    }
  });

  console.log(`Finished processing. Found brands in ${results.length} malls.`);
  
  // Write result
  // Writing as JSON for better usability
  fs.writeFileSync(outputJsonPath, JSON.stringify(results, null, 2));
  console.log(`Results saved to ${outputJsonPath}`);

  // Also write to .js as implied by the file structure presence, exporting the data
  const jsContent = `module.exports = ${JSON.stringify(results, null, 2)};`;
  fs.writeFileSync(outputPath, jsContent);
  console.log(`Results saved to ${outputPath}`);
}

main();
