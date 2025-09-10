const cronJobs = require('../batch/cronJobs');
module.exports = {
  processJob: async (req, res) => {
    // Trigger job immediately, or set up batch job
    try {
      const jobType = req.body.jobType;
      if (!jobType) return res.status(400).json({ error: 'Missing jobType' });
      if (jobType === 'monthlyStatement') {
        await cronJobs.runMonthlyStatement();
        res.json({ status: 'Job executed' });
      } else {
        res.status(400).json({ error: 'Unknown jobType' });
      }
    } catch (err) {
      res.status(500).json({ error: 'Job execution failed', details: err });
    }
  },
  jobStatus: async (req, res) => {
    // Example job tracking logic
    res.json({ jobId: req.params.id, status: 'complete' });
  }
};
