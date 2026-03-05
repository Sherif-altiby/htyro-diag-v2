import { getDashboard } from '../services/dashboard.service.js';

// GET /api/dashboard
export const dashboard = async (req, res, next) => {
  try {
    const data = await getDashboard(req.doctor.Doc_id);
    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};