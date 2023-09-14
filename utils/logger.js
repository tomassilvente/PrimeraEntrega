import winston from 'winston'

const levelOption={
    level:{
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5
    },
    color:{
        fatal: 'red',
        error: 'orange',
        warning: 'yellow',
        info: 'blue',
        http: 'green',
        debug: 'white'
    }
}

const logger = winston.createLogger({
    transports: [
        new winston.transports.Console({
            level: "info",
            format: winston.format.combine(
                winston.format.colorize({colors: levelOption.color}),
                winston.format.simple()
            )
        }),
        new winston.transports.Console({
            level: "debug",
            format: winston.format.combine(
                winston.format.colorize({colors: levelOption.color}),
                winston.format.simple()
            )
        }),
        new winston.transports.Console({
            level: "http",
            format: winston.format.combine(
                winston.format.colorize({colors: levelOption.color}),
                winston.format.simple()
            )
        }),
        new winston.transports.File({
            filename:'./errors.log',
            level:'warning',
            format: winston.format.simple()
        }),
        new winston.transports.File({
            filename:'./errors.log',
            level:'error',
            format: winston.format.simple()
        }),
        new winston.transports.File({
            filename:'./errors.log',
            level:'fatal',
            format: winston.format.simple()
        }),
    ],
})

export const addLogger = (req, res, next) =>{
    req.logger = logger
    req.logger.info(`${req.method} en ${req.url} -${new Date().toLocaleTimeString()}`)
    req.logger.http(`${req.method} en ${req.url} -${new Date().toLocaleTimeString()}`)
    req.logger.debug(`${req.method} en ${req.url} -${new Date().toLocaleTimeString()}`)
    next()
}