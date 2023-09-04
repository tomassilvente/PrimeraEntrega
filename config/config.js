import dotenv from 'dotenv';

dotenv.config();

const CONFIG = {
  PORT: +process.env.PORT || 8080,
  MONGO_URL: process.env.MONGO_URL || "mongodb+srv://silventetomas:tomassilvente10@cluster0.w7dcotg.mongodb.net/?retryWrites=true&w=majority",
  DATASOURCE: process.env.PERSISTENCE || "MONGO"
};

export default CONFIG;