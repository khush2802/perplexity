import dotenv from "dotenv";
import dns from "dns";

dotenv.config();

dns.setServers(["8.8.8.8", "1.1.1.1"]);
import app from "./src/app.js";
import connectToDB from "./src/config/database.js";

const PORT = process.env.PORT || 3000;

connectToDB().catch((err)=>{
    console.error("Failed to connect to the database", err);
    process.exit(1); // Exit the process with an error code
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});