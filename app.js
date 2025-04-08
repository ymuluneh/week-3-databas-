const express = require("express");
const Dsql = require("mysql2");
const cors = require("cors")

let app = express();
app.listen(3000, () => console.log("Server is listening"));

let DBS = Dsql.createConnection({
  database: "myDB",
  user: "myDBuser",
  password: "Yilak@10521",
  host: "localhost",
});

DBS.connect((err) => {
  if (err) {
    console.error("error", err.message);
  } else {
    console.log("DBS connected");
  }
});

app.get("/instal", function (req, res) {
  const product = `CREATE TABLE IF NOT EXISTS products(
            product_ID INT AUTO_INCREMENT,
            product_url VARCHAR(255) NOT NULL, 
            product_name VARCHAR(255),
            PRIMARY KEY (product_ID)
        )`;

  let productDiscription = `CREATE TABLE IF NOT EXISTS product_Discription(
            Discription_id INT AUTO_INCREMENT,
            product_image VARCHAR(255) NOT NULL,
            product_Brife_Discription VARCHAR(255),
            product_Discription VARCHAR(1000),
            PRIMARY KEY (Discription_id),
            product_id INT,
            FOREIGN KEY (product_ID) REFERENCES products(product_ID)
        )`;
  let price = `CREATE TABLE IF NOT EXISTS product_Price(
            price_id INT AUTO_INCREMENT PRIMARY KEY,
            starting_price VARCHAR(255),
            price_range VARCHAR(255) NOT NULL,
            product_id INT,
            FOREIGN KEY (product_ID) REFERENCES products(product_ID)
        )`;

  const user = `CREATE TABLE IF NOT EXISTS user(
            user_ID INT AUTO_INCREMENT,
            PRIMARY KEY (user_ID)
        )`;

  const orders = `CREATE TABLE IF NOT EXISTS orders (
    order_ID INT AUTO_INCREMENT PRIMARY KEY,
    product_ID INT, 
    user_ID INT,
    FOREIGN KEY (product_ID) REFERENCES products(product_ID),
    FOREIGN KEY (user_ID) REFERENCES user(user_ID)
)`;

  DBS.query(product, (err, result) => {
    if (err) {
      console.error("Error creating table:", err);
    } else {
      console.log("Table 'product' created or already exists.");
    }
  });

  DBS.query(productDiscription, (err, result) => {
    if (err) {
      console.error("Error creating table:", err);
    } else {
      console.log("Table 'productDiscription' created or already exists.");
    }
  });

  DBS.query(productDiscription, (err, result) => {
    if (err) {
      console.error("Error creating table:", err);
    } else {
      console.log("Table 'product' created or already exists.");
    }
  });
  DBS.query(price, (err, result) => {
    if (err) {
      console.error("Error creating table:", err);
    } else {
      console.log("Table 'product' created or already exists.");
    }
  });
  DBS.query(user, (err, result) => {
    if (err) {
      console.error("Error creating table:", err);
    } else {
      console.log("Table 'product' created or already exists.");
    }
  });

  DBS.query(orders, (err, result) => {
    if (err) {
      console.error("Error creating table:", err);
    } else {
      console.log("Table 'product' created or already exists.");
    }
  });

  res.end("tables created sucssussfully");
});
 //async awit method for the above code to create tables
// app.get("/instal", async (req, res) => {
//   try {
//     const tableQueries = [
//       `CREATE TABLE IF NOT EXISTS products(
//           product_ID INT AUTO_INCREMENT,
//           product_url VARCHAR(255) NOT NULL, 
//           product_name VARCHAR(255),
//           PRIMARY KEY (product_ID)
//       )`,

//       `CREATE TABLE IF NOT EXISTS product_Discription(
//           Discription_id INT AUTO_INCREMENT,

//           product_image VARCHAR(255) NOT NULL,
//           product_Brife_Discription VARCHAR(255),
//           PRIMARY KEY (Discription_id),
//           product_id INT,
//           FOREIGN KEY (product_id) REFERENCES products(product_ID)
//       )`,

//       `CREATE TABLE IF NOT EXISTS product_Price(
//           price_id INT AUTO_INCREMENT PRIMARY KEY,
//           starting_price VARCHAR(255),
//           price_range VARCHAR(255) NOT NULL,
//           product_id INT,
//           FOREIGN KEY (product_id) REFERENCES products(product_ID)
//       )`,

//       `CREATE TABLE IF NOT EXISTS user(
//           user_ID INT AUTO_INCREMENT,
//           PRIMARY KEY (user_ID)
//       )`,

//       `CREATE TABLE IF NOT EXISTS orders (
//         order_ID INT AUTO_INCREMENT PRIMARY KEY,
//         product_ID INT, 
//         user_ID INT,
//         FOREIGN KEY (product_ID) REFERENCES products(product_ID),
//         FOREIGN KEY (user_ID) REFERENCES user(user_ID)
//       )`,
//     ];

//     for (let q of tableQueries) {
//       await query(q);
//       console.log("Table created or already exists.");
//     }

//     res.send("All tables created successfully!");
//   } catch (err) {
//     console.error("Error creating tables:", err);
//     res.status(500).send("Failed to create tables.");
//   }
// });


//qn3 

// Middle ware to extract info from the html body name attribute
app.use(express.urlencoded({ extended: true }));
// Middle ware to extract info from the frontend that are sent through json
app.use(express.json());
// Middle ware to let frontend app requests to read or use data
app.use(cors());

//  To insert data to the tables
app.post("/addiphons", (req, res) => {
  const {
    productName,
    imgPath,
    phoneLink,
    startPrice,
    priceRange,
    briefDescription,
    Description,
  } = req.body;

  // Step 1: Insert into products
  const productQuery = `INSERT INTO products (product_url, product_name) VALUES (?, ?)`;
  DBS.query(productQuery, [phoneLink, productName], (err, result) => {
    if (err) {
      console.error("Error inserting into products:", err);
      return res.status(500).send("Error saving product.");
    }

    const insertedProductId = result.insertId; // Get the ID of the inserted product

    // Step 2: Insert into product_Discription
    const descriptionQuery = `
      INSERT INTO product_Discription (
        product_image, 
        product_Brife_Discription, 
        product_id
      ) VALUES (?, ?, ?)
    `;

    DBS.query(
      descriptionQuery,
      [imgPath, briefDescription + " " + Description, insertedProductId],
      (err, result) => {
        if (err) {
          console.error("Error inserting into product_Discription:", err);
          return res.status(500).send("Error saving description.");
        }

        // Step 3: Insert into product_Price
        const priceQuery = `
          INSERT INTO product_Price (
            starting_price, 
            price_range, 
            product_id
          ) VALUES (?, ?, ?)
        `;

        DBS.query(
          priceQuery,
          [startPrice, priceRange, insertedProductId],
          (err, result) => {
            if (err) {
              console.error("Error inserting into product_Price:", err);
              return res.status(500).send("Error saving price.");
            }

            res.send("Data inserted successfully!");
          }
        );
      }
    );
  });
});

app.get("/iphones", (req, res) => {
  const query = `
    SELECT 
      p.product_ID,
      p.product_name,
      p.product_url,
      d.product_image,
      d.product_Brife_Discription,
      pr.starting_price,
      pr.price_range
    FROM products p
    JOIN product_Discription d ON p.product_ID = d.product_id
    JOIN product_Price pr ON p.product_ID = pr.product_id
  `;

  DBS.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching data:", err);
      return res.status(500).send("Error fetching data.");
    }

    res.json(results); // Send data back to frontend
  });
});
