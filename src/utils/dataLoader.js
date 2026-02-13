const fs = require('fs');

function loadMalls(filePath) {
  try {
    const rawData = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(rawData);
  } catch (error) {
    console.error('Error loading malls:', error);
    throw error;
  }
}

function loadBrands(filePath) {
  try {
    const rawData = fs.readFileSync(filePath, 'utf8');
    const lines = rawData.split(/\r?\n/).filter(line => line.trim() !== '');
    
    // Simple CSV parser
    const brands = lines.slice(1).map(line => {
      // Handle potential comma in quoted strings if necessary
      // For now simple split as per inspected data
      const values = line.split(',');
      const brand = {
        name: values[0] ? values[0].trim() : '',
        offline_redeemurl: values[1] ? values[1].trim() : ''
      };
      return brand;
    });
    return brands;
  } catch (error) {
    console.error('Error loading brands:', error);
    throw error;
  }
}

module.exports = { loadMalls, loadBrands };
