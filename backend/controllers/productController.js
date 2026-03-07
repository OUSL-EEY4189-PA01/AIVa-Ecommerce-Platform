import Product from '../models/productModel.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const JSON_FILE_PATH = path.join(__dirname, '..', '..', 'chatbot', 'product.json');

function readJsonFile() {
  try {
    const data = fs.readFileSync(JSON_FILE_PATH, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function writeJsonFile(products) {
  fs.writeFileSync(JSON_FILE_PATH, JSON.stringify(products, null, 2), 'utf-8');
}

function addProductToJson(product, extraFields = {}) {
  const products = readJsonFile();
  products.push({
    _id: product._id.toString(),
    name: product.name,
    price: product.price,
    description: product.description,
    image: product.image,
    category: product.category,
    stock: product.stock,
    brand: product.brand,
    keyBenefits: extraFields.keyBenefits || [],
    keyIngredients: extraFields.keyIngredients || [],
    howToUse: extraFields.howToUse || '',
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  });
  writeJsonFile(products);
}

function updateProductInJson(product, extraFields = {}) {
  const products = readJsonFile();
  const index = products.findIndex(p => p._id === product._id.toString());
  if (index !== -1) {
    const existing = products[index];
    products[index] = {
      _id: product._id.toString(),
      name: product.name,
      price: product.price,
      description: product.description,
      image: product.image,
      category: product.category,
      stock: product.stock,
      brand: product.brand,
      keyBenefits: extraFields.keyBenefits !== undefined ? extraFields.keyBenefits : (existing.keyBenefits || []),
      keyIngredients: extraFields.keyIngredients !== undefined ? extraFields.keyIngredients : (existing.keyIngredients || []),
      howToUse: extraFields.howToUse !== undefined ? extraFields.howToUse : (existing.howToUse || ''),
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  } else {
    addProductToJson(product, extraFields);
    return;
  }
  writeJsonFile(products);
}

function deleteProductFromJson(productId) {
  const products = readJsonFile();
  const filtered = products.filter(p => p._id !== productId.toString());
  writeJsonFile(filtered);
}


export const getProducts = async (req, res) => {
  try {
    const { search, category, sort, page = 1, limit = 12 } = req.query;

    let filter = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (category) {
      filter.category = category;
    }

    let sortOption = {};
    switch (sort) {
      case 'price_asc':
        sortOption = { price: 1 };
        break;
      case 'price_desc':
        sortOption = { price: -1 };
        break;
      case 'newest':
        sortOption = { createdAt: -1 };
        break;
      default:
        sortOption = { createdAt: -1 };
    }

    const total = await Product.countDocuments(filter);

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;
    const pages = Math.ceil(total / limitNum);

    const products = await Product.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum);

    const allCategories = await Product.distinct('category');

    res.status(200).json({
      products,
      categories: allCategories,
      pagination: {
        page: pageNum,
        pages,
        total
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch products', error });
  }
};


export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product', error });
  }
};


export const createProduct = async (req, res) => {
  try {
    const productData = { ...req.body };

    const extraFields = {
      keyBenefits: productData.keyBenefits ? productData.keyBenefits.split(',').map(s => s.trim()).filter(Boolean) : [],
      keyIngredients: productData.keyIngredients ? productData.keyIngredients.split(',').map(s => s.trim()).filter(Boolean) : [],
      howToUse: productData.howToUse || '',
    };
    delete productData.keyBenefits;
    delete productData.keyIngredients;
    delete productData.howToUse;

    if (req.file) {
      productData.image = `uploads/${req.file.filename}`;
    }

    const product = new Product(productData);
    const createdProduct = await product.save();

    addProductToJson(createdProduct, extraFields);

    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(400).json({ message: 'Failed to create product', error });
  }
};


export const updateProduct = async (req, res) => {
  try {
    const updateData = { ...req.body };

    const extraFields = {};
    if (updateData.keyBenefits !== undefined) {
      extraFields.keyBenefits = updateData.keyBenefits.split(',').map(s => s.trim()).filter(Boolean);
      delete updateData.keyBenefits;
    }
    if (updateData.keyIngredients !== undefined) {
      extraFields.keyIngredients = updateData.keyIngredients.split(',').map(s => s.trim()).filter(Boolean);
      delete updateData.keyIngredients;
    }
    if (updateData.howToUse !== undefined) {
      extraFields.howToUse = updateData.howToUse;
      delete updateData.howToUse;
    }

    if (req.file) {
      updateData.image = `uploads/${req.file.filename}`;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    updateProductInJson(updatedProduct, extraFields);

    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: 'Failed to update product', error });
  }
};


export const deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    deleteProductFromJson(deletedProduct._id);

    res.status(200).json({ message: 'Product removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete product', error });
  }
};
