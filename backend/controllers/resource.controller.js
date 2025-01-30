import { PremisesResourceType, AssetResourceType, Resource } from '../models/resource.model.js';
import cloudinary from '../utils/cloudinary.js';

export const AddResource = async (req, res, next) => {
  try {
    const {
      name,
      resourceType,
      description,
      availability,
      premiType,
      capacity,
      isAC,
      hasWhiteboard,
      hasProjector,
      hasDesktopOrLaptop,
      hasMicrophone,
      assetType,
      brand,
      model,
      quantity,
      timetable,
      additionalAttributes, // Assuming this is passed as an object or JSON string
    } = req.body;
    // console.log("Received files:", req.files); // Log the received files
    //console.log("Request body:", req.body); 
    // Parse `additionalAttributes` if it's a JSON string
    let parsedAttributes = {};
    if (additionalAttributes) {
      parsedAttributes =
        typeof additionalAttributes === "string"
          ? JSON.parse(additionalAttributes)
          : additionalAttributes;
    }

    // Handle image uploads via Cloudinary
    const imageUrls = [];
    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map((file) =>
        new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "resources", overwrite: true },
            (error, result) => {
              if (result) resolve(result.secure_url);
              else reject(error);
            }
          );
          stream.end(file.buffer);
        })
      );
      const results = await Promise.all(uploadPromises);
      imageUrls.push(...results);
    }

    // Construct the new resource object
    const newResourceData = {
      name,
      resourceType,
      description,
      availability,
      imageUrl: imageUrls,
      timetable: timetable || []  
    };

    // Add fields based on resourceType
    if (resourceType === "PremisesResourceType") {
      Object.assign(newResourceData, {
        premiType,
        capacity,
        isAC,
        hasWhiteboard,
        hasProjector,
        hasDesktopOrLaptop,
        hasMicrophone,
        additionalAttributes: parsedAttributes, // Add parsed dynamic attributes
      });
    } else if (resourceType === "AssetResourceType") {
      Object.assign(newResourceData, {
        assetType,
        brand,
        model,
        quantity,
        additionalAttributes: parsedAttributes, // Add parsed dynamic attributes
      });
    }

    // Save the new resource to the database
    const newResource = new Resource(newResourceData);
    const savedResource = await newResource.save();

    // Respond with the newly created resource
    res.status(201).json(savedResource);
  } catch (error) {
    console.error("Error in AddResource:", error);
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
  const { searchTerm, type, availability, resourceType, additionalAttributes } = req.query;

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
    // Handle additionalAttributes if provided
    if (additionalAttributes) {
      try {
        const attributes = JSON.parse(additionalAttributes);
        Object.keys(attributes).forEach((key) => {
          query[`additionalAttributes.${key}`] = attributes[key];
        });
      } catch (error) {
        return res.status(400).json({ message: 'Invalid additionalAttributes format' });
      }
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
    // Handle file uploads
    if (req.files && req.files.length > 0) {
      const imageUrls = [];
      const uploadPromises = req.files.map((file) =>
        new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "resources", overwrite: true },
            (error, result) => {
              if (result) resolve(result.secure_url);
              else reject(error);
            }
          );
          stream.end(file.buffer);
        })
      );
      const results = await Promise.all(uploadPromises);
      updates.imageUrl = results; // Update the imageUrls
    }

    // Handle dynamic `additionalAttributes`
    if (updates.additionalAttributes) {
      updates.additionalAttributes =
        typeof updates.additionalAttributes === "string"
          ? JSON.parse(updates.additionalAttributes)
          : updates.additionalAttributes;
    }

    // Update the resource in the database
    const updatedResource = await Resource.findByIdAndUpdate(id, updates, {
      new: true,
    });
    if (!updatedResource) {
      return res.status(404).json({ message: "Resource not found" });
    }

    res.status(200).json({ success: true, resource: updatedResource });
  } catch (error) {
    console.error("Error in updateResource:", error);
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




