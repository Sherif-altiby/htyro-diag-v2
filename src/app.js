import express           from 'express';
import cookieParser      from 'cookie-parser';
import authRoutes        from './routes/auth.route.js';
import patientRoutes     from './routes/patient.route.js';
import symptomRoutes     from './routes/symptom.route.js';
import thyroidTestRoutes from './routes/thyroidTest.route.js';
import { errorHandler }  from './middleware/auth.middleware.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/auth',                           authRoutes);
app.use('/api/patients',                       patientRoutes);
app.use('/api/patients/:patientId/symptoms',   symptomRoutes);
app.use('/api/patients/:patientId/tests',      thyroidTestRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, message: `المسار ${req.originalUrl} غير موجود` });
});

app.use(errorHandler);

export default app;