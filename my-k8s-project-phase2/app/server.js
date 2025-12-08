const express = require("express");
const app = express();
const password = process.env.DB_PASSWORD || "not-set";


app.get("/", (req, res) => {
res.send(`<h1>Welcome to My Node App on Kubernetes!</h1>
<p>Secret DB_PASSWORD is: ${password}</p>`);
});


app.listen(3000, () => console.log("App running on port 3000"));
