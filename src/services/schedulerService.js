const cron = require('node-cron');
const etlService = require('./etlService');

// Default schedule: midnight UTC
const schedule = '* * * * *';
let job = null;

function startScheduler() {
  console.log(`Data refresh scheduled to run at ${schedule}`);
  
  job = cron.schedule(schedule, async () => {
    console.log(`Running scheduled ETL refresh at ${new Date().toISOString()}`);
    try {
      const result = await etlService.runETLProcess();
      console.log('Scheduled ETL refresh completed:', result);
    } catch (error) {
      console.error('Scheduled ETL refresh failed:', error);
    }
  });

  return job;
}

module.exports = { 
  startScheduler
}; 