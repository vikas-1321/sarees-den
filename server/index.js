const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;
const admin = require('firebase-admin');
const uploadRoute = require("./routes/upload");

const app = express();
// const cors = require('cors'); // npm install cors
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// 1. ENSURE UPLOADS DIRECTORY EXISTS (Crucial for Multer)
const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const PORT = process.env.PORT || 10000; 
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});
// 2. CLOUDINARY CONFIG (Double check these names!)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// 3. FIREBASE ADMIN CONFIG
// Ensure serviceAccountKey.json is in the root of the server folder!
const serviceAccountValue = process.env.FIREBASE_SERVICE_ACCOUNT;

if (!serviceAccountValue) {
    throw new Error("FIREBASE_SERVICE_ACCOUNT is missing from Environment Variables");
}

const serviceAccount = JSON.parse(serviceAccountValue);

// FIX: This line fixes the common 'escaped newline' bug on cloud platforms
serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');

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
    try {
        console.log("--- New Upload Request Received ---");
        if (!req.file) {
            console.error("DEBUG: No file found in req.file");
            throw new Error("No file uploaded");
        }

        // 1. Upload to Cloudinary
        console.log("DEBUG: Attempting Cloudinary Upload...");
        const result = await cloudinary.uploader.upload(req.file.path, { folder: 'sarees_den' });
        console.log("DEBUG: Cloudinary Success:", result.secure_url);
        
        // 2. Cleanup local file
        fs.unlinkSync(req.file.path);

        // 3. Save to Firestore with the new Tags
        console.log("DEBUG: Attempting Firestore Save...");
        const sareeData = {
            name: req.body.name,
            price: Number(req.body.price),
            stock: Number(req.body.stock),
            category: req.body.category,
            description: req.body.description, // Added description
            color: req.body.color,             // Added tag
            occasion: req.body.occasion,       // Added tag
            isTrending: req.body.isTrending === 'true', // Handle boolean from FormData
            image: result.secure_url,
            createdAt: new Date()
        };

      const docRef = await db.collection('sarees').add(sareeData);
        console.log("DEBUG: Firestore Success, ID:", docRef.id);
        res.status(200).json({ id: docRef.id, ...sareeData });

    } catch (error) {
        console.error("!!! SERVER CRASH ERROR !!!:", error.message);
        console.error("STACK TRACE:", error.stack); // This is key!
        res.status(500).json({ error: error.message, stack: error.stack });
    }
});

// 1. GET A SINGLE SAREE BY ID
app.get('/api/sarees/:id', async (req, res) => {
    try {
        const doc = await db.collection('sarees').doc(req.params.id).get();
        if (!doc.exists) {
            return res.status(404).json({ error: "Saree not found" });
        }
        res.json({ id: doc.id, ...doc.data() });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 2. UPDATE SAREE BY ID
app.put('/api/sarees/:id', async (req, res) => {
    try {
        const { id, ...updateData } = req.body; // Remove ID from body if it exists
        
        // Ensure numbers are handled correctly
        if(updateData.price) updateData.price = Number(updateData.price);
        if(updateData.stock) updateData.stock = Number(updateData.stock);

        await db.collection('sarees').doc(req.params.id).update({
            ...updateData,
            updatedAt: new Date()
        });

        res.status(200).json({ message: "Update successful" });
    } catch (error) {
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

app.get('/', (req, res) => {
  res.send('Saree Den API is live and running!');
});

