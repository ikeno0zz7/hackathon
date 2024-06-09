// const express = require('express');
// const router = express.Router();
// const Task = require('../models/Task');
// const auth = require('../routes/auth');
// const { registerUser, loginUser } = require('../controllers/authControllers');

// router.use(express.urlencoded({ extended: true }));
// router.use(express.json());

// router.post('/register', registerUser);
// router.get('/login', loginUser);
// router.get('/tasks', auth, async (req, res) => {
//   try {
//     const tasks = await Task.find({ user: req.user.id });
//     res.json(tasks);
//   } catch (error) {
//     console.error(error.message);
//     res.status(500).json({ message: 'Server Error: Unable to fetch tasks' });
//   }
// });

// router.post('/task', auth, async (req, res) => {
//   try {
//     const taskCount = await Task.countDocuments({ user: req.user._id, isCompleted: false });
//     if (taskCount >= 8) {
//       return res.status(400).json({ message: 'Please complete the tasks you currently have before adding a new one.' });
//     }
//     const task = new Task({ ...req.body, user: req.user._id });
//     await task.save();
//     res.status(201).json(task);
//   } catch (error) {
//     console.error(error.message);
//     res.status(500).json({ message: 'Server Error: Unable to create task' });
//   }
// });

// router.put('/task/:id', auth, async (req, res) => {
//   try {
//     const updatedTask = await Task.findOneAndUpdate(
//       { _id: req.params.id, user: req.user.id },
//       { $set: req.body },
//       { new: true }
//     );
//     if (!updatedTask) {
//       return res.status(404).json({ message: 'Task not found' });
//     }
//     res.status(200).json(updatedTask);
//   } catch (error) {
//     console.error(error.message);
//     res.status(500).json({ message: 'Server Error: Unable to update task' });
//   }
// });

// router.put('/task/complete/:id', auth, async (req, res) => {
//   try {
//     const { flowerStatus, isCompleted } = req.body;
//     const updatedTask = await Task.findOneAndUpdate(
//       { _id: req.params.id, user: req.user.id },
//       { completedAt: new Date(), flowerStatus, isCompleted },
//       { new: true }
//     );
//     if (!updatedTask) {
//       return res.status(404).json({ message: 'Task not found' });
//     }
//     res.status(200).json(updatedTask);
//   } catch (error) {
//     console.error(error.message);
//     res.status(500).json({ message: 'Server Error: Unable to complete task' });
//   }
// });

// router.delete('/task/:id', auth, async (req, res) => {
//   try {
//     const deleteTask = await Task.findOneAndDelete({ _id: req.params.id, user: req.user.id });
//     res.status(200).json(deleteTask);
//   } catch (error) {
//     console.error(error.message);
//     res.status(500).json({ message: 'Server Error: Unable to delete task' });
//   }
// });

// router.get('/tasks/completed-this-week', auth, async (req, res) => {
//   try {
//     const now = new Date();
//     const dayOfWeek = now.getDay();
//     const diffToSaturday = (dayOfWeek + 1) % 7;
//     const lastSaturday = new Date(now);
//     lastSaturday.setDate(now.getDate() - diffToSaturday);
//     lastSaturday.setHours(0, 0, 0, 0);

//     const nextSunday = new Date(lastSaturday);
//     nextSunday.setDate(lastSaturday.getDate() + 7);
//     nextSunday.setHours(23, 59, 59, 999);

//     const tasks = await Task.find({
//       user: req.user.id,
//       completedAt: {
//         $gte: lastSaturday,
//         $lte: nextSunday,
//       },
//     });

//     res.json(tasks);
//   } catch (error) {
//     console.error(error.message);
//     res.status(500).json({ message: 'Server Error: Unable to fetch completed tasks for the week' });
//   }
// });

// router.get('/user/profile', auth, async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id).select('-password');
//     res.json(user);
//   } catch (error) {
//     console.error(error.message);
//     res.status(500).send('Server Error');
//   }
// });

// module.exports = router;

const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const auth = require('../middleware/auth');
const User = require('../models/User');
const { registerUser, loginUser } = require('../controllers/authControllers');

router.use(express.urlencoded({ extended: true }));
router.use(express.json());

router.post('/register', registerUser);
router.get('/login', loginUser);
router.get('/tasks', auth, async (req, res) => {
  try {
    console.log('User in request:', req.user); // Debugging statement
    const tasks = await Task.find({ user: req.user._id }); // Use _id
    res.json(tasks);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server Error: Unable to fetch tasks' });
  }
});

router.post('/task', auth, async (req, res) => {
  try {
    console.log('User in request:', req.user); // Debugging statement
    const taskCount = await Task.countDocuments({ user: req.user._id, isCompleted: false });
    if (taskCount >= 8) {
      return res.status(400).json({ message: 'Please complete the tasks you currently have before adding a new one.' });
    }
    const task = new Task({ ...req.body, user: req.user._id });
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    console.error('Server error during task creation:', error.message);
    res.status(500).json({ message: 'Server Error: Unable to create task' });
  }
});
router.get('/user/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error.message);
    res.status(500).json({ message: 'Server Error: Unable to fetch user profile' });
  }
});

router.put('/task/:id', auth, async (req, res) => {
  try {
    const updatedTask = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { $set: req.body },
      { new: true }
    );
    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(200).json(updatedTask);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server Error: Unable to update task' });
  }
});

router.put('/task/complete/:id', auth, async (req, res) => {
  try {
    const { flowerStatus, isCompleted } = req.body;
    const updatedTask = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { completedAt: new Date(), flowerStatus, isCompleted },
      { new: true }
    );
    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(200).json(updatedTask);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server Error: Unable to complete task' });
  }
});

router.delete('/task/:id', auth, async (req, res) => {
  try {
    const deleteTask = await Task.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    res.status(200).json(deleteTask);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server Error: Unable to delete task' });
  }
});

router.get('/tasks/completed-this-week', auth, async (req, res) => {
  try {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const diffToSaturday = (dayOfWeek + 1) % 7;
    const lastSaturday = new Date(now);
    lastSaturday.setDate(now.getDate() - diffToSaturday);
    lastSaturday.setHours(0, 0, 0, 0);

    const nextSunday = new Date(lastSaturday);
    nextSunday.setDate(lastSaturday.getDate() + 7);
    nextSunday.setHours(23, 59, 59, 999);

    const tasks = await Task.find({
      user: req.user.id,
      completedAt: {
        $gte: lastSaturday,
        $lte: nextSunday,
      },
    });

    res.json(tasks);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server Error: Unable to fetch completed tasks for the week' });
  }
});

router.get('/user/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
