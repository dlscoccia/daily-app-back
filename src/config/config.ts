export default {
  DB: {
    URI:
      process.env.MONGO_URI ||
      'mongodb+srv://dailyAdmin:tShXSRXnI6eSkx8p@cluster0.9htba.mongodb.net/',
    USER: process.env.MONGO_USER || '',
    PASSWORD: process.env.MONGO_PW || '',
  },
  JWTSecret: process.env.JWT_SECRET || 'FonziRules',
}
