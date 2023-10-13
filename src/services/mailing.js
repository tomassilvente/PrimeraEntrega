import nodemailer from 'nodemailer'
import CONFIG from '../config/config.js'

export default class MailingService{
    constructor(){
        this.client =  nodemailer.createTransport({
            
            host:'smtp.gmail.com',
            port: 465,
            secure: true,
            logger: true,
            debug: true,
            secureConnection: false,
            auth:{
                user: 'silventetomas@gmail.com',
                pass: 'vfpx ysun ybep htdu'
            },
            tls:{
                rejectUnauthorized: true
            }
        })
    }
    sendSimpleMail = ({from, to, subject, html, attachments=[]})=>{
        let result =  this.client.sendMail({
            from,
            to,
            subject,
            html,
            attachments
        })
        return result
    }
}