import { Resource } from '../models/resource.model.js';
import Issue from '../models/issue.model.js';
import User from '../models/user.model.js';
import Request from '../models/requesting.model.js';

// Get most booked resources over time
export const getMostBookedResources = async (req, res) => {
  try {
    const mostBookedResources = await Request.aggregate([
      { $group: { _id: '$resource', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
      { $lookup: { from: 'resources', localField: '_id', foreignField: '_id', as: 'resource' } },
      { $unwind: '$resource' },
      { $project: { _id: 1, count: 1, 'resource.name': 1 } }
    ]);
    res.json(mostBookedResources);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// Get most reported types of issues
export const getMostReportedIssues = async (req, res) => {
  try {
    const issues = await Issue.find().sort({ createdAt: -1 }).limit(10);
    console.log('Fetched Issues:', issues); // Debugging statement

    const resourceIds = issues.map(issue => issue.resource);
    const resources = await Resource.find({ _id: { $in: resourceIds } });
    console.log('Fetched Resources:', resources); // Debugging statement

    const resourceMap = resources.reduce((map, resource) => {
      map[resource._id.toString()] = resource.name;
      return map;
    }, {});
    console.log('Resource Map:', resourceMap); // Debugging statement

    const issuesWithResourceNames = issues.map(issue => ({
      ...issue.toObject(),
      resourceName: resourceMap[issue.resource.toString()] || 'Unknown Resource'
    }));
    console.log('Issues with Resource Names:', issuesWithResourceNames); // Debugging statement

    res.json(issuesWithResourceNames);
  } catch (error) {
    console.error('Error fetching most reported issues:', error); // Debugging statement
    res.status(500).json({ message: 'Server Error' });
  }
};


// Get users who are booking resources mostly
export const getTopBookers = async (req, res) => {
  try {
    const topBookers = await Request.aggregate([
      { $group: { _id: '$user', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
      { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'user' } },
      { $unwind: '$user' },
      { $project: { _id: 1, count: 1, 'user.name': 1, 'user.email': 1, 'user.role': 1 } }
    ]);
    res.json(topBookers);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};