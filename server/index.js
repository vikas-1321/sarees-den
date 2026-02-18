const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;
const admin = require('firebase-admin');
require('dotenv').config();

const uploadRoute = require("./routes/upload");

const app = express();

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

/* ✅ Ensure uploads directory exists */
const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

/* ✅ Cloudinary Config */
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});


// ================= FIREBASE ADMIN ================= //

const serviceAccountVar = process.env.FIREBASE_SERVICE_ACCOUNT;

if (serviceAccountVar) {
  try {
    const serviceAccount = JSON.parse(serviceAccountVar);

    serviceAccount.private_key =
      serviceAccount.private_key.replace(/\\n/g, '\n');

    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
      console.log("✅ Firebase Admin Initialized");
    }

  } catch (err) {
    console.error("❌ Firebase Init Error:", err.message);
  }
} else {
  console.error("❌ FIREBASE_SERVICE_ACCOUNT missing in .env");
}

const db = admin.firestore();


// ================= SERVER ================= //

const PORT = process.env.PORT || 10000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
});


// ================= MULTER ================= //

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname))
});

const upload = multer({ storage });


// ================= ROUTES ================= //

/* ✅ Add Saree */
app.post('/api/sarees', upload.single('image'), async (req, res) => {
  try {
    console.log("--- New Upload Request ---");

    if (!req.file) throw new Error("No file uploaded");

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'sarees_den'
    });

    fs.unlinkSync(req.file.path);

    const sareeData = {
      name: req.body.name,
      price: Number(req.body.price),
      stock: Number(req.body.stock),
      category: req.body.category,
      description: req.body.description,
      color: req.body.color,
      occasion: req.body.occasion,
      isTrending: req.body.isTrending === 'true',
      image: result.secure_url,
      createdAt: new Date()
    };

    const docRef = await db.collection('sarees').add(sareeData);

    console.log("✅ Firestore Save Success:", docRef.id);

    res.status(200).json({ id: docRef.id, ...sareeData });

  } catch (error) {
    console.error("❌ Upload Error:", error.message);
    res.status(500).json({ error: error.message });
  }
});


/* ✅ Get Saree by ID */
app.get('/api/sarees/:id', async (req, res) => {
  try {
    const doc = await db.collection('sarees')
      .doc(req.params.id)
      .get();

    if (!doc.exists)
      return res.status(404).json({ error: "Saree not found" });

    res.json({ id: doc.id, ...doc.data() });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


/* ✅ Update Saree */
app.put('/api/sarees/:id', async (req, res) => {
  try {
    const updateData = { ...req.body };

    if (updateData.price)
      updateData.price = Number(updateData.price);

    if (updateData.stock)
      updateData.stock = Number(updateData.stock);

    await db.collection('sarees')
      .doc(req.params.id)
      .update({
        ...updateData,
        updatedAt: new Date()
      });

    res.status(200).json({ message: "Update successful" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


/* ✅ Get User */
app.get('/api/users/:uid', async (req, res) => {
  try {
    const userDoc = await db.collection('users')
      .doc(req.params.uid)
      .get();

    if (!userDoc.exists)
      return res.status(404).json({ error: "User not found" });

    res.json(userDoc.data());

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


/* ✅ Checkout */
app.post('/api/checkout', async (req, res) => {
  const { cart } = req.body;

  try {
    await db.runTransaction(async (transaction) => {
      for (const item of cart) {
        const sareeRef = db.collection('sarees').doc(item.id);
        const sareeDoc = await transaction.get(sareeRef);

        if (!sareeDoc.exists)
          throw new Error("Product does not exist");

        const newStock = sareeDoc.data().stock - item.quantity;

        if (newStock < 0)
          throw new Error(`${item.name} out of stock`);

        transaction.update(sareeRef, { stock: newStock });
      }

      await db.collection('orders').add({
        items: cart,
        timestamp: new Date(),
        status: 'completed'
      });
    });

    res.json({ success: true });

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


/* ✅ Health */
app.get('/', (req, res) => {
  res.send('Saree Den API is live!');
});
