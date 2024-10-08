import { connect } from "mongoose";
import { app } from ".";
import { createFakeVideos } from "./core/utilities/create-fake-video";

connect(process.env.LOCAL_DB_URL!)
.then(() => console.log("Successully connected to the database."))
.catch(e => console.log("Couldn't connect to the database.", e));

const port: number = 3000;

app.listen(
    port,
    () => console.log(`Server running at http://localhost:${port}.`)
);

createFakeVideos(200);