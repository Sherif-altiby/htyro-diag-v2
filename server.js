import dotenv from 'dotenv';
dotenv.config();

const { default: app }  = await import('./src/app.js');
const { connectDB }     = await import('./src/config/db.js');
await import('./src/models/index.js');

await connectDB();

app.listen(process.env.PORT || 3000, () => {
  console.log(`🚀 Server running on port ${process.env.PORT || 3000}`);
});

export default app;