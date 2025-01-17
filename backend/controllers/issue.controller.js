import Issue from '../models/issue.model.js';
import Notification from '../models/notification.model.js';

export const reportIssue = async (req, res) => {
    try {
      const { resourceId, type, description } = req.body;
      const userId = req.user._id;
  
      const newIssue = new Issue({
        resource: resourceId,
        user: userId,
        type,
        description,
      });
  
      await newIssue.save();
      res.status(201).json({ message: 'Issue reported successfully', issue: newIssue });
    } catch (error) {
      res.status(500).json({ message: 'Error reporting issue', error });
    }
  };
  
  export const getIssues = async (req, res) => {
    try {
      const issues = await Issue.find().populate('resource user');
      res.status(200).json(issues);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching issues', error });
    }
  };
  
  export const provideFeedback = async (req, res) => {
    try {
      const { feedback } = req.body;
      const issueId = req.params.id;
  
      const updatedIssue = await Issue.findByIdAndUpdate(
        issueId,
        { feedback, status: 'Resolved', updatedAt: Date.now() },
        { new: true }
      ).populate('user');
  
      // Create a notification for the user
      const newNotification = new Notification({
        user: updatedIssue.user._id,
        message: `Your reported issue has been resolved. Feedback: ${feedback}`,
      });
  
      await newNotification.save();
  
      res.status(200).json({ message: 'Feedback provided successfully', issue: updatedIssue });
    } catch (error) {
      res.status(500).json({ message: 'Error providing feedback', error });
    }
  };
  