import dotenv from 'dotenv';
dotenv.config(); // 👈 must be before ANY other imports

const { default: app }           = await import('./src/app.js');
const { connectDB }              = await import('./src/config/db.js');
await import('./src/models/index.js');

connectDB().then(() => {
  app.listen(process.env.PORT || 3000, () => {
    console.log(`🚀 Server running on port ${process.env.PORT || 3000}`);
  });
}).catch((err) => {
  console.error('❌ Failed to connect to database:', err.message);
  process.exit(1);
});

export default app;