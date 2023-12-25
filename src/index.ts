import { exit } from 'process';


import app from '@/app';
import { env } from '@/config';
// import { connectDB, env } from '@/config';


const PORT = env.server.port;

const server = app.listen(PORT, async () => {
    // await connectDB();
    console.log(`App listening on port ${PORT}`);
});

process.on('uncaughtException', err => {
    console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    exit(1);
});

process.on('unhandledRejection', err => {
    console.log('UNHANDLED REJECTION! 💥 Shutting down...');
    console.log(err);
    server.close(() => exit(1));
});

process.on('SIGTERM', () => {
    console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
    server.close(() => console.log('💥 Process terminated!'));
});
