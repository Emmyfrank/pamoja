import winston from "winston";

const { combine, printf, timestamp, json } = winston.format;
const timestampFormat = "MMM-DD-YY HH:mm:ss";

export const logger = winston.createLogger({
  format: combine(
    timestamp({ format: timestampFormat }),
    json(),
    printf(({ timestamp, level, message, ...data }) => {
      return `${level.toLocaleUpperCase()}::${timestamp}: ${message}`;
    })
  ),

  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "info.log", level: "info" }),
  ],
});
