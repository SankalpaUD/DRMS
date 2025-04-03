import Notice from '../models/notice.model.js';

export const createNotice = async (req, res) => {
    try {
        const { title, content } = req.body;
        const createdBy = req.user._id; 

        if (req.user.role !== 'Resource Admin' && req.user.role !== 'Super Admin')  {
            return res.status(403).json({ message: 'Access denied' });
        }

        const notice = new Notice({ title, content, createdBy });
        await notice.save();
        res.status(201).json({ message: 'Notice created successfully', notice });
    } catch (error) {
        res.status(500).json({ message: 'Error creating notice', error });
    }
};

export const getNotices = async (req, res) => {
    try {
        const notices = await Notice.find().populate('createdBy', 'name email');
        res.status(200).json(notices);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching notices', error });
    }
};

export const deleteNotice = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the notice by ID
        const notice = await Notice.findById(id);
        if (!notice) {
            return res.status(404).json({ message: 'Notice not found' });
        }

        // Check if the user is the creator or a Super Admin
        if (req.user.role !== 'Resource Admin' && req.user.role !== 'Super Admin') {
            return res.status(403).json({ message: 'Access denied' });
        }

        // Delete the notice
        await Notice.findByIdAndDelete(id);
        res.status(200).json({ message: 'Notice deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting notice', error });
    }
};