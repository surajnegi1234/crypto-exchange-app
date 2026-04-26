const { createApp } = require("./src/app");

const app = createApp();
const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
