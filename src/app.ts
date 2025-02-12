import express from "express";
import routes from "./routes";
import sequelize from "./config/database";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use("/", routes);

async function startServer() {
  try {
    await sequelize.sync();
    console.log("Database synchronized");

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }
}

startServer();
