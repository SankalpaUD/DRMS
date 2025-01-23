import FulfillStaff from '../models/fulfillstaff.model.js';

export const addFulfillStaff = async (req, res) => {
  try {
    const { name, staffId, email, position, number } = req.body;

    const newStaff = new FulfillStaff({
      name,
      staffId,
      email,
      position,
      number,
    });

    await newStaff.save();
    res.status(201).json({ message: 'Fulfill staff added successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error adding fulfill staff', error });
  }
};

export const getAllFulfillStaff = async (req, res) => {
  try {
    const staff = await FulfillStaff.find();
    res.status(200).json(staff);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching fulfill staff', error });
  }
};

export const updateFulfillStaff = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, staffId, email, position, number } = req.body;

    const updatedStaff = await FulfillStaff.findByIdAndUpdate(
      id,
      { name, staffId, email, position, number },
      { new: true }
    );

    if (!updatedStaff) {
      return res.status(404).json({ message: 'Fulfill staff not found' });
    }

    res.status(200).json({ message: 'Fulfill staff updated successfully', updatedStaff });
  } catch (error) {
    res.status(500).json({ message: 'Error updating fulfill staff', error });
  }
};

export const deleteFulfillStaff = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedStaff = await FulfillStaff.findByIdAndDelete(id);

    if (!deletedStaff) {
      return res.status(404).json({ message: 'Fulfill staff not found' });
    }

    res.status(200).json({ message: 'Fulfill staff deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting fulfill staff', error });
  }
};