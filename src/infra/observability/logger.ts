import { createLogger, transports, format } from 'winston';

const logFormat = format.combine(
  format.timestamp(),
  format.errors({ stack: true }),    
  format.splat(),                    
  format.json()
);

export const logger = createLogger({
  level: 'info',
  format: logFormat,
  transports: [
    new transports.Console({
      level: 'debug',
      format: format.combine(
        format.colorize(),
        format.simple()
      )
    }),
    new transports.File({
      filename: 'logs/error.log',
      level: 'error'
    }),
    new transports.File({
      filename: 'logs/combined.log'
    })
  ],
  exceptionHandlers: [
    new transports.File({ filename: 'logs/exceptions.log' })
  ]
});