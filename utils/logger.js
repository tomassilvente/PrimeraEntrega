import winston from 'winston'

const levelOption={
    levels:{
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5
    },
    colors:{
        fatal: 'red',
        error: 'orange',
        warning: 'yellow',
        info: 'blue',
        http: 'green',
        debug: 'white'
    }
}

const logger = winston.createLogger({
    levels: levelOption.levels, 
    transports: [
        new winston.transports.Console({
            level: "info",
            format: winston.format.combine(
                // winston.format.colorize({color: levelOption.colors.info}),
                winston.format.simple()
            )
        }),
        new winston.transports.Console({
            level: "debug",
            format: winston.format.combine(
                // winston.format.colorize({color: levelOption.colors.debug}),
                winston.format.simple()
            )
        }),
        new winston.transports.Console({
            level: "http",
            format: winston.format.combine(
                // winston.format.colorize({color: levelOption.colors.http}),
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
    // req.logger.error = logger.error(`${req.method} en ${req.url} -${new Date().toLocaleTimeString()}`)
    req.logger.debug(`${req.method} en ${req.url} -${new Date().toLocaleTimeString()}`)
    next()
}


