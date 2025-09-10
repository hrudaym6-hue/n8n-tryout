// Business rules as per business-rules.json

const enforceStatusTransition = (existingTask, updates) => {
  if (existingTask.status === 'completed') {
    if (updates.status && updates.status !== 'completed') {
      return {
        valid: false,
        message: 'Cannot update a completed task except to mark it as completed.'
      };
    }
    const keys = Object.keys(updates);
    if (keys.some(key => key !== 'status')) {
      return {
        valid: false,
        message: 'Cannot update fields of a completed task.'
      };
    }
  }
  return { valid: true };
};

module.exports = {
  enforceStatusTransition
};
