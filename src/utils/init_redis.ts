// import * as redis from "redis";

// // const redisClient = async () => {
// const redisClient = redis.createClient({
//   url: process.env.REDIS_CLIENT_URI,
// });

// redisClient.on("connect", () => console.log("Client connected to redis..."));
// redisClient.on("ready", () =>
//   console.log("Client connected to redis and ready to use...")
// );
// redisClient.on("error", (err) => console.log("Redis Client Error", err));
// redisClient.on("end", () => console.log("Client disconnected from redis"));

// redisClient.connect().then(() => {
//   console.log("connecting....");
// });

// process.on("SIGINT", async () => {
//   await redisClient.disconnect();
// });

// // return client;
// // };
// // export default  redisClient;
// export default  redisClient;
