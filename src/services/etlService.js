const axios = require('axios');
const { University, Domain, WebPage, sequelize } = require('../models');
require('dotenv').config();

const apiUrl = process.env.API_URL || 'http://universities.hipolabs.com/search';
const country = process.env.DEFAULT_COUNTRY || 'united states';
const limit = parseInt(process.env.DEFAULT_LIMIT) || 100;

async function extractData(offset = 0) {
  try {
    console.log(`Fetching data with offset: ${offset}`);
    const response = await axios.get(apiUrl, {
      params: {
        country: country,
        limit: limit,
        offset: offset
      },
      timeout: 10000 // 10 seconds timeout
    });

    return response.data;
  } catch (error) {
    console.error('Error extracting data: ', error.message);
    if (error.response && error.response.status >= 500) {
      console.log('Server error, retrying...');
      await new Promise(resolve => setTimeout(resolve, 5000));
      return extractData(offset);
    }
    throw error;
  }
}

function transformData(universities) {
  return universities.map(uni => ({
    name: uni.name || '',
    alpha_two_code: uni.alpha_two_code || 'US',
    country: uni.country || 'United States',
    state_province: uni.state_province || null,
    domains: Array.isArray(uni.domains) ? uni.domains : [],
    web_pages: Array.isArray(uni.web_pages) ? uni.web_pages : []
  }));
}

async function loadData(transformedData) {
  const transaction = await sequelize.transaction();

  try {
    for (const uniData of transformedData) {
      const [university, created] = await University.findOrCreate({
        where: { 
          name: uniData.name,
          country: uniData.country
        },
        defaults: {
          alpha_two_code: uniData.alpha_two_code,
          state_province: uniData.state_province
        },
        transaction
      });

      // If university already exists, update it
      if (!created) {
        await university.update({
          alpha_two_code: uniData.alpha_two_code,
          state_province: uniData.state_province
        }, { transaction });
      }

      // Process domains
      await Domain.destroy({
        where: { universityId: university.id },
        transaction
      });
      for (const domain of uniData.domains) {
        await Domain.create({
          domain,
          universityId: university.id
        }, { transaction });
      }

      // Process web pages
      await WebPage.destroy({
        where: { universityId: university.id },
        transaction
      });
      for (const url of uniData.web_pages) {
        await WebPage.create({
          url,
          universityId: university.id
        }, { transaction });
      }
    }

    await transaction.commit();
    console.log(`Successfully loaded ${transformedData.length} universities.`);
  } catch (error) {
    await transaction.rollback();
    console.error('Error loading data:', error);
    throw error;
  }
}

async function runETLProcess() {
  try {
    console.log('Starting ETL process...');
    
    let offset = 0;
    let hasMoreData = true;
    let totalProcessed = 0;

    // Initialize database tables
    await sequelize.sync();

    while (hasMoreData) {
      const extractedData = await extractData(offset);
      
      if (extractedData.length === 0) {
        hasMoreData = false;
        break;
      }

      const transformedData = transformData(extractedData);
      await loadData(transformedData);
      
      totalProcessed += extractedData.length;
      offset += limit;
      
      // If we got fewer records than the limit, we've reached the end
      if (extractedData.length < limit) {
        hasMoreData = false;
      }
    }

    console.log(`ETL process completed. Total universities processed: ${totalProcessed}`);
    return { success: true, count: totalProcessed };
  } catch (error) {
    console.error('ETL process failed:', error);
    return { success: false, error: error.message };
  }
}

module.exports = { 
  extractData,
  transformData,
  loadData,
  runETLProcess
}; 