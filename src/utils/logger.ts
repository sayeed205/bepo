import fs from 'fs';
import path from 'path';
import * as winston from 'winston';
import 'winston-daily-rotate-file';

// Migrate away from old log
const OLD_LOG_FILE = path.join(import.meta.dir, '../config/logs/overseerr.log');
if (fs.existsSync(OLD_LOG_FILE)) {
    const file = fs.lstatSync(OLD_LOG_FILE);

    if (!file.isSymbolicLink()) {
        fs.unlinkSync(OLD_LOG_FILE);
    }
}

const hformat = winston.format.printf(
    ({ level, label, message, timestamp, ...metadata }) => {
        let msg = `${timestamp} [${level}]${
            label ? `[${label}]` : ''
        }: ${message} `;
        if (Object.keys(metadata).length > 0) {
            msg += JSON.stringify(metadata);
        }
        return msg;
    },
);

export const logger = winston.createLogger({
    level: Bun.env.LOG_LEVEL?.toLowerCase() || 'debug',
    format: winston.format.combine(
        winston.format.splat(),
        winston.format.timestamp(),
        hformat,
    ),
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.splat(),
                winston.format.timestamp(),
                hformat,
            ),
        }),
        new winston.transports.DailyRotateFile({
            filename: Bun.env.CONFIG_DIRECTORY
                ? `${Bun.env.CONFIG_DIRECTORY}/logs/overseerr-%DATE%.log`
                : path.join(
                      import.meta.dir,
                      '../config/logs/overseerr-%DATE%.log',
                  ),

            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '7d',
            createSymlink: true,
            symlinkName: 'overseerr.log',
        }),
        new winston.transports.DailyRotateFile({
            filename: Bun.env.CONFIG_DIRECTORY
                ? `${Bun.env.CONFIG_DIRECTORY}/logs/.machine-logs-%DATE%.json`
                : path.join(
                      import.meta.dir,
                      '../config/logs/.machine-logs-%DATE%.json',
                  ),
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '1d',
            createSymlink: true,
            symlinkName: '.machine-logs.json',
            format: winston.format.combine(
                winston.format.splat(),
                winston.format.timestamp(),
                winston.format.json(),
            ),
        }),
    ],
});
