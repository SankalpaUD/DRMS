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

  const handleTimetable = (timetableInput) => {
    try {
      if (!timetableInput) return [];
      if (Array.isArray(timetableInput)) return timetableInput;
      if (typeof timetableInput === 'string') {
        return timetableInput.trim() === '' ? [] : JSON.parse(timetableInput);
      }
      return [];
    } catch (error) {
      console.error('Timetable parse error:', error);
      return [];
    }
  };

  try {
    const resource = await Resource.findById(id);
    if (!resource) {
      return res.status(404).json({ message: "Resource not found" });
    }

    // Handle file uploads
    if (req.files?.length > 0) {
      const uploadPromises = req.files.map(file => 
        new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "resources" },
            (error, result) => {
              if (result) resolve(result.secure_url);
              else reject(error);
            }
          );
          stream.end(file.buffer);
        })
      );
      const newImages = await Promise.all(uploadPromises);
      resource.imageUrl = [...resource.imageUrl, ...newImages].slice(0, 6);
    }

    // Handle updates based on resource type
    if (resource.resourceType === 'PremisesResourceType') {
      const premisesResource = await PremisesResourceType.findById(id);
      
      // Update premises-specific fields
      premisesResource.premiType = req.body.premiType || premisesResource.premiType;
      premisesResource.capacity = req.body.capacity || premisesResource.capacity;
      premisesResource.isAC = req.body.isAC ?? premisesResource.isAC;
      premisesResource.hasWhiteboard = req.body.hasWhiteboard ?? premisesResource.hasWhiteboard;
      premisesResource.hasProjector = req.body.hasProjector ?? premisesResource.hasProjector;
      premisesResource.hasDesktopOrLaptop = req.body.hasDesktopOrLaptop ?? premisesResource.hasDesktopOrLaptop;
      premisesResource.hasMicrophone = req.body.hasMicrophone ?? premisesResource.hasMicrophone;

      // Handle additionalAttributes
      if (req.body.additionalAttributes) {
        const newAttributes = typeof req.body.additionalAttributes === 'string'
          ? JSON.parse(req.body.additionalAttributes)
          : req.body.additionalAttributes;
        
        premisesResource.additionalAttributes = new Map(Object.entries(newAttributes));
      }

      // Update common fields
      premisesResource.name = req.body.name || premisesResource.name;
      premisesResource.description = req.body.description || premisesResource.description;
      premisesResource.availability = req.body.availability ?? premisesResource.availability;

      // Handle timetable conversion
      premisesResource.timetable = req.body.timetable
        ? Array.isArray(req.body.timetable) 
          ? req.body.timetable 
          : JSON.parse(req.body.timetable)
        : [];

      await premisesResource.validate();
      const updatedResource = await premisesResource.save();
      return res.status(200).json({ success: true, resource: updatedResource });
    }
    else if (resource.resourceType === 'AssetResourceType') {
      const assetResource = await AssetResourceType.findById(id);
      
      // Update asset-specific fields
      assetResource.assetType = req.body.assetType || assetResource.assetType;
      assetResource.brand = req.body.brand || assetResource.brand;
      assetResource.model = req.body.model || assetResource.model;
      assetResource.quantity = req.body.quantity || assetResource.quantity;

      // Update common fields
      assetResource.name = req.body.name || assetResource.name;
      assetResource.description = req.body.description || assetResource.description;
      assetResource.availability = req.body.availability ?? assetResource.availability;

      // Handle timetable conversion for assets
      assetResource.timetable = handleTimetable(req.body.timetable);

      await assetResource.validate();
      const updatedResource = await assetResource.save();
      return res.status(200).json({ success: true, resource: updatedResource });
    }

    return res.status(400).json({ message: "Invalid resource type" });

  } catch (error) {
    console.error("Update error:", error);
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




