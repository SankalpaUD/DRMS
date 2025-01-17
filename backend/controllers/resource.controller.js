import { PremisesResourceType, AssetResourceType, Resource } from '../models/resource.model.js';
import cloudinary from '../utils/cloudinary.js';

export const AddResource = async (req, res, next) => {
  try {
    const { name, type, description, availability, resourceType, timetable, ...otherFields } = req.body;

    const imageUrls = [];
    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map(file => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: 'resources',
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
      });
      const results = await Promise.all(uploadPromises);
      imageUrls.push(...results);
    }

    let resource;
    if (resourceType === 'PremisesResourceType') {
      resource = new PremisesResourceType({
        name,
        type,
        description,
        availability,
        resourceType,
        imageUrl: imageUrls,
        timetable: timetable || [], // Add timetable if provided
        ...otherFields,
      });
    } else if (resourceType === 'AssetResourceType') {
      resource = new AssetResourceType({
        name,
        type,
        description,
        availability,
        resourceType,
        imageUrl: imageUrls,
        timetable: timetable || [], // Add timetable if provided
        ...otherFields,
      });
    } else {
      return res.status(400).json({ message: 'Invalid resource type' });
    }

    await resource.save();
    res.status(201).json({ message: 'Resource added successfully', resource });
  } catch (error) {
    next(error);
  }
};

export const getResourceById = async (req, res, next) => {
  const { id } = req.params;

  try {
    const resource = await Resource.findById(id);
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }
    res.status(200).json(resource);
  } catch (error) {
    next(error);
  }
};

export const getResources = async (req, res, next) => {
  const { searchTerm, type, availability, resourceType } = req.query;

  try {
    let query = {};
    if (searchTerm) {
      query.name = { $regex: searchTerm, $options: 'i' }; // Case-insensitive search
    }
    if (type) {
      query.type = type;
    }
    if (availability) {
      query.availability = availability === 'true';
    }
    if (resourceType) {
      query.resourceType = resourceType;
    }

    const resources = await Resource.find(query);
    res.status(200).json(resources);
  } catch (error) {
    next(error);
  }
};

export const updateResource = async (req, res, next) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const imageUrls = [];
    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map(file => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: 'resources',
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
      });

      const results = await Promise.all(uploadPromises);
      imageUrls.push(...results);
      updates.imageUrl = imageUrls;
    }

    const updatedResource = await Resource.findByIdAndUpdate(id, updates, { new: true });
    if (!updatedResource) {
      return res.status(404).json({ message: 'Resource not found' });
    }
    res.status(200).json({ success: true, resource: updatedResource });
  } catch (error) {
    next(error);
  }
};

export const deleteResource = async (req, res, next) => {
  const { id } = req.params;

  try {
    const deletedResource = await Resource.findByIdAndDelete(id);
    if (!deletedResource) {
      return res.status(404).json({ message: 'Resource not found' });
    }
    res.status(200).json({ message: 'Resource deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const addTimetable = async (req, res) => {
  const { resourceId, timetable } = req.body;

  try {
    const resource = await Resource.findById(resourceId);
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    resource.timetable.push(timetable);
    await resource.save();

    res.status(200).json({ message: 'Timetable added successfully', resource });
  } catch (error) {
    res.status(500).json({ message: 'Error adding timetable', error });
  }
};

export const updateTimetable = async (req, res) => {
  const { resourceId, timetableId, timetable } = req.body;

  try {
    const resource = await Resource.findById(resourceId);
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    const timetableIndex = resource.timetable.findIndex(t => t._id.toString() === timetableId);
    if (timetableIndex === -1) {
      return res.status(404).json({ message: 'Timetable not found' });
    }

    resource.timetable[timetableIndex] = timetable;
    await resource.save();

    res.status(200).json({ message: 'Timetable updated successfully', resource });
  } catch (error) {
    res.status(500).json({ message: 'Error updating timetable', error });
  }
};

export const deleteTimetable = async (req, res) => {
  const { resourceId, timetableId } = req.params;

  try {
    const resource = await Resource.findById(resourceId);
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    const timetableIndex = resource.timetable.findIndex(t => t._id.toString() === timetableId);
    if (timetableIndex === -1) {
      return res.status(404).json({ message: 'Timetable not found' });
    }

    resource.timetable.splice(timetableIndex, 1);
    await resource.save();

    res.status(200).json({ message: 'Timetable deleted successfully', resource });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting timetable', error });
  }
};

export const getTimetables = async (req, res) => {
  const { resourceId } = req.params;

  try {
    const resource = await Resource.findById(resourceId);
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    res.status(200).json(resource.timetable);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching timetables', error });
  }
};
