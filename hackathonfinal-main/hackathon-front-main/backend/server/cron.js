const cron = require('node-cron');
const Task = require('./models/Task'); // Adjust the path to your Task model

// Set up a cron job to run every Sunday at midnight (start of Sunday)
cron.schedule('0 0 * * SUN', async () => {
  try {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const diffToSaturday = (dayOfWeek + 1) % 7;
    const lastSaturday = new Date(now);
    lastSaturday.setDate(now.getDate() - diffToSaturday - 1);
    lastSaturday.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(now);
    endOfWeek.setDate(now.getDate() - 1);
    endOfWeek.setHours(23, 59, 59, 999);

    await Task.deleteMany({
      isCompleted: true,
      completedAt: {
        $gte: lastSaturday,
        $lte: endOfWeek, // up to the end of Saturday
      },
    });

    console.log('Completed tasks for the week have been cleared.');
  } catch (error) {
    console.error('Error clearing completed tasks:', error);
  }
});
