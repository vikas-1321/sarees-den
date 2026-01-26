const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;
const admin = require('firebase-admin');

const app = express();
// const cors = require('cors'); // npm install cors
app.use(cors());
app.use(express.json());

// 1. ENSURE UPLOADS DIRECTORY EXISTS (Crucial for Multer)
const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}

// 2. CLOUDINARY CONFIG (Double check these names!)
cloudinary.config({
  cloud_name: 'deomtojnu',
  api_key: '379171439284215',
  api_secret: 'HpAqb0tFeWfi4RmAgiOIt6BW3kg'
});

// 3. FIREBASE ADMIN CONFIG
// Ensure serviceAccountKey.json is in the root of the server folder!
const serviceAccount = require("./serviceAccountKey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();

// 4. MULTER CONFIG
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage: storage });


// 5. THE ADD SAREE ROUTE
app.post('/api/sarees', upload.single('image'), async (req, res) => {
    console.log("--- New Upload Attempt ---");
    try {
        if (!req.file) throw new Error("No file uploaded");

        // Upload to Cloudinary
        console.log("Uploading to Cloudinary...");
        const result = await cloudinary.uploader.upload(req.file.path, { folder: 'sarees_den' });
        
        // Remove file from local server after Cloudinary upload
        fs.unlinkSync(req.file.path);

        // Save to Firestore
        console.log("Saving to Firestore...");
        const sareeData = {
            name: req.body.name,
            price: Number(req.body.price),
            stock: Number(req.body.stock),
            category: req.body.category,
            image: result.secure_url,
            createdAt: new Date()
        };

        const docRef = await db.collection('sarees').add(sareeData);
        console.log("Success! ID:", docRef.id);

        res.status(200).json({ id: docRef.id, ...sareeData });

    } catch (error) {
        console.error("SERVER ERROR:", error.message);
        res.status(500).json({ error: error.message });
    }
});


app.get('/api/users/:uid', async (req, res) => {
    try {
        const userDoc = await db.collection('users').doc(req.params.uid).get();
        if (!userDoc.exists) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json(userDoc.data());
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// Checkout Route (for inventory tracking)
app.post('/api/checkout', async (req, res) => {
  const { cart } = req.body;

  try {
    await db.runTransaction(async (transaction) => {
      for (const item of cart) {
        const sareeRef = db.collection('sarees').doc(item.id);
        const sareeDoc = await transaction.get(sareeRef);

        if (!sareeDoc.exists) throw "Product does not exist!";
        
        const newStock = sareeDoc.data().stock - item.quantity;
        if (newStock < 0) throw `${sareeDoc.data().name} is out of stock!`;

        // Update the stock count
        transaction.update(sareeRef, { stock: newStock });
      }
      
      // Optional: Save the order to an 'orders' collection
      await db.collection('orders').add({
        items: cart,
        timestamp: new Date(),
        status: 'completed'
      });
    });

    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ error: error.toString() });
  }
});

app.listen(5000, () => console.log('Server running on http://localhost:5000'));