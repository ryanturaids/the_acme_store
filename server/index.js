const {
  client,
  createTables,
  createUser,
  createProduct,
  fetchUsers,
  fetchProducts,
  createFavorite,
  fetchFavorites,
  destroyFavorite,
} = require("./db");

const express = require("express");
const app = express();

app.use(express.json());

app.get("/api/users", async (req, res, next) => {
  try {
    res.send(await fetchUsers());
  } catch (error) {
    next(error);
  }
});
app.get("/api/products", async (req, res, next) => {
  try {
    res.send(await fetchProducts());
  } catch (error) {
    next(error);
  }
});
app.get("/api/users/:id/favorites", async (req, res, next) => {
  try {
    res.send(await fetchFavorites(req.params.id));
  } catch (error) {
    next(error);
  }
});
app.post("/api/users/:id/favorites", async (req, res, next) => {
  try {
    const { product_id } = req.body;
    res.send(await createFavorite({ user_id: req.params.id, product_id }));
  } catch (error) {
    next(error);
  }
});
app.delete("/api/users/:userId/favorites/:id", async (req, res, next) => {
  try {
    await destroyFavorite({ id: req.params.id, user_id: req.params.userId });
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
});

const init = async () => {
  await client.connect();
  console.log("database connection established");

  await createTables();
  console.log("tables created");

  const [haley, john, jane, mark, emily] = await Promise.all([
    createUser({ username: "haley_smith", password: "Orbit*47$Plan" }),
    createUser({ username: "john_doe", password: "J0hn*D0e#92" }),
    createUser({ username: "jane_williams", password: "!Rocket#Glide22" }),
    createUser({ username: "mark_johnson", password: "M@rkJ#hn2024" }),
    createUser({ username: "emily_clark", password: "Wh1z#Str!pe77" }),
  ]);
  console.log("users seeded");

  const [
    waterBottle,
    headphones,
    deskLamp,
    powerBank,
    wirelessMouse,
    coffeeMug,
    reusableBags,
    laptopStand,
    flashDrive,
    kettle,
  ] = await Promise.all([
    createProduct({ name: "stainless steel water bottle" }),
    createProduct({ name: "bluetooth headphones" }),
    createProduct({ name: "desk lamp" }),
    createProduct({ name: "portable power bank" }),
    createProduct({ name: "wireless mouse" }),
    createProduct({ name: "ceramic coffee mug" }),
    createProduct({ name: "reusable shopping bags" }),
    createProduct({ name: "laptop stand" }),
    createProduct({ name: "USB flash drive" }),
    createProduct({ name: "electric kettle" }),
  ]);
  console.log("products seeded");

  const [haleyFav, haleyFav2, johnFav, markFav] = await Promise.all([
    createFavorite({ user_id: haley.id, product_id: headphones.id }),
    createFavorite({ user_id: haley.id, product_id: coffeeMug.id }),
    createFavorite({ user_id: john.id, product_id: coffeeMug.id }),
    createFavorite({ user_id: mark.id, product_id: kettle.id }),
  ]);
  console.log("favorites seeded");
  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`listening on port ${port}`));
};

init();
