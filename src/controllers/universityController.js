const path = require('path');
const fs = require('fs');
const csvService = require('../services/csvService');
const { University, Domain, WebPage } = require('../models');

// Get all universities with their domains and web_pages
exports.getAllUniversities = async (req, res) => {
  try {
    const universities = await University.findAll({
      include: [
        { model: Domain, as: 'domains' },
        { model: WebPage, as: 'web_pages' }
      ]
    });

    // Transform to match API format
    const formattedUniversities = universities.map(uni => {
      const plainUni = uni.get({ plain: true });
      return {
        alpha_two_code: plainUni.alpha_two_code,
        country: plainUni.country,
        state_province: plainUni.state_province,
        domains: plainUni.domains.map(d => d.domain),
        name: plainUni.name,
        web_pages: plainUni.web_pages.map(w => w.url)
      };
    });

    return res.status(200).json(formattedUniversities);
  } catch (error) {
    console.error('Error fetching universities:', error);
    return res.status(500).json({ error: 'Failed to fetch universities' });
  }
};

// Download universities as CSV
exports.downloadUniversitiesCSV = async (req, res) => {
  try {
    const csvFilePath = await csvService.generateCSV();
    
    // Get the filename
    const filename = path.basename(csvFilePath);
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
    
    // Stream the file to the response
    const fileStream = fs.createReadStream(csvFilePath);
    fileStream.pipe(res);
    
    // Delete the file after sending (optional)
    fileStream.on('end', () => {
      // Uncomment this if you want to delete the file after sending
      fs.unlinkSync(csvFilePath);
    });
  } catch (error) {
    console.error('Error downloading CSV:', error);
    return res.status(500).json({ error: 'Failed to download CSV file' });
  }
}; 