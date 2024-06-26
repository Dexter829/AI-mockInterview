/** @type { import("drizzle-kit").Config } */
export default {
    schema: "./utils/schema.js",
    dialect: 'postgresql',
    dbCredentials: {
      url: 'postgresql://ai-interview-mocker_owner:iR5QP2ySfueV@ep-curly-tree-a5himojc.us-east-2.aws.neon.tech/ai-interview-mocker?sslmode=require'
    }
  };