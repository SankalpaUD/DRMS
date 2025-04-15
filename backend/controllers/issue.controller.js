import Issue from '../models/issue.model.js';
import Notification from '../models/notification.model.js';
import cloudinary from '../utils/cloudinary.js';

export const reportIssue = async (req, res) => {
  try {
    const { resourceId, type, subType, description, severity, reportedBy, contactInfo } = req.body;
    const userId = req.user._id;

    let imageUrls = [];
    if (req.files && req.files.length > 0) {
      const uploadImage = (file) => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: 'issueImages',
              overwrite: true,
            },
            (error, result) => {
              if (result) {
                resolve(result.secure_url);
              } else {
                reject(error);
              }
            }
          );
          stream.end(file.buffer);
        });
      };

      imageUrls = await Promise.all(req.files.map((file) => uploadImage(file)));
    }

    const newIssue = new Issue({
      resource: resourceId,
      user: userId,
      type,
      subType,
      description,
      severity,
      reportedBy,
      contactInfo,
      images: imageUrls, // Save image URLs
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
