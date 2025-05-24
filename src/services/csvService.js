const { createObjectCsvWriter } = require('csv-writer');
const path = require('path');
const fs = require('fs');
const { University, Domain, WebPage } = require('../models');

const outputDir = path.join(__dirname, '../../output');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

async function generateCSV() {
  try {
    // Get all universities with their related domains and web_pages
    const universities = await University.findAll({
      include: [
        { model: Domain, as: 'domains' },
        { model: WebPage, as: 'web_pages' }
      ]
    });

    const transformedData = universities.map(uni => {
      const plainUni = uni.get({ plain: true });
      
      return {
        alpha_two_code: plainUni.alpha_two_code,
        country: plainUni.country,
        state_province: plainUni.state_province,
        name: plainUni.name,
        // Convert related tables back to arrays
        domains: plainUni.domains.map(d => d.domain).join(';'),
        web_pages: plainUni.web_pages.map(w => w.url).join(';')
      };
    });

    // Create CSV file
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filePath = path.join(outputDir, `universities_${timestamp}.csv`);
    
    const csvWriter = createObjectCsvWriter({
      path: filePath,
      header: [
        { id: 'alpha_two_code', title: 'alpha_two_code' },
        { id: 'country', title: 'country' },
        { id: 'state_province', title: 'state_province' },
        { id: 'name', title: 'name' },
        { id: 'domains', title: 'domains' },
        { id: 'web_pages', title: 'web_pages' }
      ]
    });

    await csvWriter.writeRecords(transformedData);
    console.log(`CSV file generated successfully at ${filePath}`);
    
    return filePath;
  } catch (error) {
    console.error('Error generating CSV:', error);
    throw error;
  }
}

module.exports = { generateCSV }; 