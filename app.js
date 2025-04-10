const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.listen(3000, () => console.log("✅ Server is listening on port 3000"));

const db = mysql.createConnection({
  host: "localhost",
  user: "mydbuser",
  password: "Yilak@10521",
  database: "mydb",
});

db.connect((err) => {
  if (err) {
    console.error("❌ DB Connection Error:", err.message);
  } else {
    console.log("✅ Database connected");
  }
});

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// app.get("/instal", function (req, res) {
//   const product = `CREATE TABLE IF NOT EXISTS products(
//             product_ID INT AUTO_INCREMENT,
//             product_url VARCHAR(255) NOT NULL,
//             product_name VARCHAR(255),
//             PRIMARY KEY (product_ID)
//         )`;

//   let productDiscription = `CREATE TABLE IF NOT EXISTS product_Discription(
//             Discription_id INT AUTO_INCREMENT,
//             product_image VARCHAR(255) NOT NULL,
//             product_Brife_Discription VARCHAR(255),
//             full_Discription VARCHAR(1000),
//             PRIMARY KEY (Discription_id),
//             product_id INT,
//             FOREIGN KEY (product_ID) REFERENCES products(product_ID)
//         )`;

//   let price = `CREATE TABLE IF NOT EXISTS product_Price(
//             price_id INT AUTO_INCREMENT PRIMARY KEY,
//             starting_price VARCHAR(255),
//             price_range VARCHAR(255) NOT NULL,
//             product_id INT,
//             FOREIGN KEY (product_ID) REFERENCES products(product_ID)
//         )`;

//   const user = `CREATE TABLE IF NOT EXISTS user(
//             user_ID INT AUTO_INCREMENT,
//             PRIMARY KEY (user_ID)
//         )`;

//   const orders = `CREATE TABLE IF NOT EXISTS orders (
//     order_ID INT AUTO_INCREMENT PRIMARY KEY,
//     product_ID INT,
//     user_ID INT,
//     FOREIGN KEY (product_ID) REFERENCES products(product_ID),
//     FOREIGN KEY (user_ID) REFERENCES user(user_ID)
// )`;

//   DBS.query(product, (err, result) => {
//     if (err) {
//       console.error("Error creating table:", err);
//     } else {
//       console.log("Table 'product' created or already exists.");
//     }
//   });

//   DBS.query(productDiscription, (err, result) => {
//     if (err) {
//       console.error("Error creating table:", err);
//     } else {
//       console.log("Table 'product' created or already exists.");
//     }
//   });
//   DBS.query(price, (err, result) => {
//     if (err) {
//       console.error("Error creating table:", err);
//     } else {
//       console.log("Table 'product' created or already exists.");
//     }
//   });
//   DBS.query(user, (err, result) => {
//     if (err) {
//       console.error("Error creating table:", err);
//     } else {
//       console.log("Table 'product' created or already exists.");
//     }
//   });

// Install Tables
app.get("/install", (req, res) => {
  const tables = [
    `CREATE TABLE IF NOT EXISTS products (
      product_ID INT AUTO_INCREMENT PRIMARY KEY,
      product_url VARCHAR(255) NOT NULL,
      product_name VARCHAR(255)
    )`,

    `CREATE TABLE IF NOT EXISTS product_description (
      description_id INT AUTO_INCREMENT PRIMARY KEY,
      product_image VARCHAR(255) NOT NULL,
      product_brief_description VARCHAR(255),
      full_description VARCHAR(1000),
      product_id INT,
      FOREIGN KEY (product_id) REFERENCES products(product_ID)
    )`,

    `CREATE TABLE IF NOT EXISTS product_price (
      price_id INT AUTO_INCREMENT PRIMARY KEY,
      starting_price VARCHAR(255),
      price_range VARCHAR(255) NOT NULL,
      product_id INT,
      FOREIGN KEY (product_id) REFERENCES products(product_ID)
    )`,

    `CREATE TABLE IF NOT EXISTS user (
      user_ID INT AUTO_INCREMENT PRIMARY KEY
    )`,

    `CREATE TABLE IF NOT EXISTS orders (
      order_ID INT AUTO_INCREMENT PRIMARY KEY,
      product_ID INT,
      user_ID INT,
      FOREIGN KEY (product_ID) REFERENCES products(product_ID),
      FOREIGN KEY (user_ID) REFERENCES user(user_ID)
    )`,
  ];

  tables.forEach((query, index) => {
    db.query(query, (err, result) => {
      if (err) {
        console.error(`❌ Error creating table ${index + 1}:`, err.message);
      } else {
        console.log(`✅ Table ${index + 1} created or already exists.`);
      }
    });
  });

  res.send("✅ All tables checked or created successfully.");
});

// POST: Insert iPhone data
app.post("/addiphons", (req, res) => {
  const {
    productName,
    imgPath,
    phoneLink,
    startPrice,
    priceRange,
    briefDescription,
    description,
  } = req.body;

  // Step 1: Insert into products
  const productQuery = `INSERT INTO products (product_url, product_name) VALUES (?, ?)`;
  db.query(productQuery, [phoneLink, productName], (err, result) => {
    if (err) {
      console.error("❌ Error inserting into products:", err);
      return res.status(500).send("Failed to insert product.");
    }

    const insertedProductId = result.insertId;

    // Step 2: Insert into product_description
    const descriptionQuery = `
      INSERT INTO product_description (
        product_image, 
        product_brief_description, 
        full_description,
        product_id
      ) VALUES (?, ?, ?, ?)
    `;
    db.query(
      descriptionQuery,
      [imgPath, briefDescription, description, insertedProductId],
      (err) => {
        if (err) {
          console.error("❌ Error inserting into product_description:", err);
          return res.status(500).send("Failed to insert description.");
        }

        // Step 3: Insert into product_price
        const priceQuery = `
          INSERT INTO product_price (
            starting_price,
            price_range,
            product_id
          ) VALUES (?, ?, ?)
        `;
        db.query(
          priceQuery,
          [startPrice, priceRange, insertedProductId],
          (err) => {
            if (err) {
              console.error("❌ Error inserting into product_price:", err);
              return res.status(500).send("Failed to insert price.");
            }

            res.send("✅ Data inserted successfully!");
          }
        );
      }
    );
  });
});

// app.get("/iphones", (req, res) => {
