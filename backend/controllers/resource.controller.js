import Resource from '../models/resource.model.js';
import cloudinary from '../utils/cloudinary.js';
import Request from '../models/requesting.model.js';

export const AddResource = async (req, res, next) => {
  try {
    const { name, type, description, availability, ...otherFields } = req.body;

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

      const uploadedImages = await Promise.all(uploadPromises);
      imageUrls.push(...uploadedImages);
    } else {
      imageUrls.push("https://media.istockphoto.com/id/1437999708/vector/online-library-bookstores-ebook-internet-education-tiny-people-reads-books-on-laptop-screen.jpg?s=612x612&w=0&k=20&c=_BzWoHIXPBKGVdJGOKelFLkeUQNw_XI_W14HRievtJE=");
    }

    const resource = await Resource.create({
      name,
      type,
      imageUrl: imageUrls,
      description,
      availability: availability ?? true,
      ...otherFields
    });

    return res.status(201).json(resource);
  } catch (error) {
    next(error);
  }
};

export const getResources = async (req, res, next) => {
  try {
    const resources = await Resource.find();
    res.status(200).json(resources);
  } catch (error) {
    next(error);
  }
};

export const getResourceById = async (req, res, next) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }
    res.status(200).json(resource);
  } catch (error) {
    next(error);
  }
};

export const updateResource = async (req, res, next) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const updatedResource = await Resource.findByIdAndUpdate(id, updates, { new: true });
    if (!updatedResource) {
      return res.status(404).json({ message: 'Resource not found' });
    }
    res.status(200).json(updatedResource);
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

export const createRequest = async (req, res) => {
  try {
    const { resourceId, requestDate, takenTime, handoverTime } = req.body;
    const userId = req.user._id;

    const newRequest = new Request({
      resource: resourceId,
      user: userId,
      requestDate,
      takenTime,
      handoverTime,
    });

    await newRequest.save();
    res.status(201).json({ message: 'Request created successfully', request: newRequest });
  } catch (error) {
    res.status(500).json({ message: 'Error creating request', error });
  }
};

export const getAllRequests = async (req, res) => {
  try {
    const requests = await Request.find().populate('resource user');
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching requests', error });
  }
};

export const approveRequest = async (req, res) => {
  try {
    const { status } = req.body;
    const requestId = req.params.id;

    const updatedRequest = await Request.findByIdAndUpdate(
      requestId,
      { status, updatedAt: Date.now() },
      { new: true }
    );

    res.status(200).json({ message: 'Request updated successfully', request: updatedRequest });
  } catch (error) {
    res.status(500).json({ message: 'Error updating request', error });
  }
};
