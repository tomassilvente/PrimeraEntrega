import dotenv from 'dotenv';

dotenv.config();

const CONFIG = {
  app:{
    ENV: process.env.NODE_ENV || "production"
  },
    PORT: +process.env.PORT || 8080,
    MONGO_URL: process.env.MONGO_URL || "mongodb+srv://silventetomas:tomassilvente10@cluster0.w7dcotg.mongodb.net/?retryWrites=true&w=majority",
    DATASOURCE: process.env.PERSISTENCE || "MONGO",
    mailing:{
      SERVICE: process.env.MAILING_SERVICE,
      USER: process.env.MAILING_USER,
      PASSWORD: process.env.MAILING_PASSWORD,
    }
  
};

export default CONFIG;