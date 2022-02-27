import asyncHandler from 'express-async-handler';
import { unlink } from 'fs';
import util from 'util';

import Store from '../models/store.js';
import Dish from '../models/dish.js';

import { deleteFile, uploadFile, getFileStream } from '../utils/s3.js';

const unLinkFile = util.promisify(unlink);
/**
 * @desc    create store
 * @route   POST /api/store/create
 * access  Public
 */
export const createStore = asyncHandler(async (req, res) => {
  const imgUrl = 'https://via.placeholder.com/150';
  const { storeName, mobileNo, storeAddress, subscriptionPrice, gstin } =
    req.body;

  const hasStore = await Store.findOne({ owner: req.user.id });
  if (hasStore) {
    res.status(400).json({ message: 'You Already Have A Store!' });
  }

  let errorList = [];
  if (!storeName) errorList.push('Store Name is required');
  if (!mobileNo) errorList.push('Phone No. is required');
  if (!storeAddress) errorList.push('Store Address is required');
  if (!subscriptionPrice) errorList.push('Subscription Price is required');

  if (errorList.length > 0) {
    res.status(400).json({ message: errorList });
  } else {
    const store = new Store({
      storeName,
      mobileNo,
      storeAddress,
      subscriptionPrice,
      gstin,
      imageUrl: imgUrl,
      owner: req.user.id,
    });

    const createdStore = await store.save();
    res.status(201).json(createdStore);
  }
});

/**
 * @desc    create dish
 * @route   POST /api/store/dishes/create
 * @access  Public
 */
export const createDish = asyncHandler(async (req, res) => {
  const { dishName, description, price } = req.body;
  const dishImg = req.file;

  const hasStore = await Store.findOne({ owner: req.user.id });
  if (!hasStore) {
    res.status(400).json({ message: 'You have to create your store first!' });
  }

  let errorList = [];
  if (!dishName) errorList.push('DishName is required');
  if (!description) errorList.push('Description is required');
  if (!price) errorList.push('Price is required');
  if (!dishImg) errorList.push('ImageUrl is required');

  if (errorList.length > 0) {
    res.status(400).json({ message: errorList });
  } else {
    const aws_res = await uploadFile(dishImg);
    await unLinkFile(dishImg.path);

    const dish = new Dish({
      dishName,
      description,
      price,
      storeId: hasStore.id,
      imgKey: aws_res.Key,
      imgUrl: aws_res.Location,
    });

    const createdDish = await dish.save();
    res.status(201).json({ d: 'sf' });
  }
});

/**
 * @desc    delete dish
 * @route   POST /api/store/dishes/delete
 * @access  Private
 */
export const deleteDish = asyncHandler(async (req, res) => {
  const { dishId } = req.body;

  const hasStore = await Store.findOne({ owner: req.user.id });
  if (!hasStore) {
    res.status(400).json({ message: 'You have to create your store first!' });
  }

  let errorList = [];
  if (!dishId) errorList.push('DishId is required');

  if (errorList.length > 0) {
    res.status(400).json({ message: errorList });
  } else {
    const dish = await Dish.findOne({ _id: dishId });
    if (!dish) {
      res.status(400).json({ message: 'Record Not Found!' });
    } else {
      const aws_res = await deleteFile(dish.imgKey);
      dish.remove();
      res.status(200).json({ message: 'Record Succesfully Deleted' });
    }
  }
});

/**
 * @desc    create store
 * @route   POST /api/store/dishes/get-all
 * access  Public
 */
export const getStoreDishes = asyncHandler(async (req, res) => {
  const hasStore = await Store.findOne({ owner: req.user.id });
  if (!hasStore) {
    res.status(400).json({ message: 'You have to create your store first!' });
  }

  const allDishes = await Dish.find({ storeId: hasStore.id }).sort({
    createdAt: -1,
  });
  res.status(200).json({ storesAllDishes: allDishes });
});

/**
 * @desc    create store
 * @route   POST /api/store/dishes/get-all
 * access  Public
 */
export const getAllDishes = asyncHandler(async (req, res) => {
  const allDishes = await Dish.find().sort({ createdAt: -1 });
  res.status(200).json({ storesAllDishes: allDishes });
});

export const getDishImage = asyncHandler(async (req, res) => {
  const { key } = req.params;
  const readStream = getFileStream(key);
  readStream.pipe(res);
});
