const express = require("express");
const verifyToken = require("../middleware/AuthMiddleware");
const router = express.Router();
//const path = require('path')
const {
  getProducts, 
  getCategories, 
  getBrands, 
  AddingProduct, 
  DeletingProduct, 
  UpdatingProduct,
  AddingBrand,
  AddingCategory,
  UpdatingCategory,
  UpdatingBrand,
  DeletingCategory,
  DeletingBrand,
  addingProductToCart,
  deletingProductFromCart,
  deletingProductFromFavories,
  addingProductToFavories,
  getIncart,
  getInfavories,
  updatingProductFromCart,
  getStatus,
  contactMessage
} = require("../controlers/ProductsControler");

/************** Firebase config **************/
const admin = require("firebase-admin");
const serviceAccount = require("../config/firebaseServiceAccountKey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "techwave-7f545.appspot.com",
});

const storage = admin.storage();
const bucket = storage.bucket();
const multer =require('multer')
const upload = multer({ dest: "uploads/" });
// Handle file upload to Firebase Storage
router.post("/upload", async (req, res) => {
  try {
    const { file } = req; 

    const destination = "uploads/" + file.originalname;
    const fileUpload = bucket.file(destination);
    const writeStream = fileUpload.createWriteStream();

    writeStream.end(file.buffer);

    writeStream.on("finish", () => {
      res.status(200).json({ message: "File uploaded successfully" });
    });

    writeStream.on("error", (error) => {
      console.error("Error uploading file:", error);
      res.status(500).json({ error: "Internal server error" });
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Product Routers
router.get('/States',getStatus)
router.post('/sendMessage', contactMessage)
// Product Routers
router.get("/products", upload.any(), getProducts);
router.post("/addProduct", upload.single("image"), AddingProduct);
router.post('/deleteProduct', DeletingProduct)
router.post('/updateProduct',upload.single("image"), UpdatingProduct)

// incart Routers
router.post('/incart',getIncart)
router.post('/addTocart', addingProductToCart)
router.post('/deleteFromCart', deletingProductFromCart)
router.post('/updateincart', updatingProductFromCart)
// Favories Routers
router.post('/infavories',getInfavories)
router.post('/addToFavories', addingProductToFavories)
router.post('/deleteFromFavories', deletingProductFromFavories)
// Categories Routers
router.get('/categories',getCategories)
router.post('/addCategory', AddingCategory)
router.post('/updateCategory', UpdatingCategory)
router.post('/deleteCategory', DeletingCategory)
// Brands Routers
router.get('/brands',getBrands)
router.post('/addBrand', AddingBrand)
router.post('/updateBrand', UpdatingBrand)
router.post('/deleteBrand', DeletingBrand)

router.get("/protected", verifyToken, (req, res) => {
  res.json({ message: "You are authorized to access this route" });
});

module.exports = router;