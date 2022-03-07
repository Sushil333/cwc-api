import asyncHandler from 'express-async-handler';

import Store from '../models/store.js';
import Dish from '../models/dish.js';

import { deleteFile, uploadFile, getFileStream } from '../utils/s3.js';
import sendMail from '../utils/nodemailer.js';

/**
 * @desc    create store
 * @route   POST /api/store/create
 * access  Public
 */
export const createStore = asyncHandler(async (req, res) => {
  const aadharCard = req.files['aadhar'][0];
  const panCard = req.files['pancard'][0];

  const { storeName, email, mobileNo, storeAddress } = req.body;

  const errorList = [];
  if (!email) errorList.push('Email is required');
  if (!aadharCard) errorList.push('Aadhar Card is required');
  if (!panCard) errorList.push('Pan Card is required');
  if (!storeName) errorList.push('Store Name is required');
  if (!mobileNo) errorList.push('Phone No. is required');
  if (!storeAddress) errorList.push('Store Address is required');

  if (errorList.length > 0) {
    res.status(400).json({ message: errorList });
  } else {
    const aadharUploadRes = await uploadFile(aadharCard);
    const panUploadRes = await uploadFile(panCard);

    console.log();
    const store = new Store({
      storeName,
      mobileNo,
      storeAddress,
      email,
      aadharCard: aadharUploadRes.Location,
      panCard: panUploadRes.Location,
    });

    const createdStore = await store.save();
    res.status(201).json(createdStore);
  }
});

/**
 * @desc    new store requets
 * @route   POST /api/store/requests
 * access  private
 */
export const storeRequests = asyncHandler(async (req, res) => {
  const storeRequestList = await Store.find().sort({ createdAt: -1 });
  res.status(200).json({ data: storeRequestList });
});

/**
 * @desc    create store
 * @route   POST /api/store/send-approved-mail
 * access  private
 */
export const sendApprovedMail = asyncHandler(async (req, res) => {
  const { emailID } = req.params;
  const payload = {
    to: 'sushilbhardwaj705@gmail.com',
    type: 'approved',
  };
  const mailRes = await sendMail(payload);
  console.log(mailRes);
  res.status(200).json({ data: `send verification mail to ${emailID}` });
});

/**
 * @desc    create store
 * @route   POST /api/store/send-rejection-mail
 * access  private
 */
export const sendRejectioMail = asyncHandler(async (req, res) => {
  res.status(200).json({ data: 'send rejection mail' });
});

//-------- store dish function -----------------//

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

  const errorList = [];
  if (!dishName) errorList.push('DishName is required');
  if (!description) errorList.push('Description is required');
  if (!price) errorList.push('Price is required');
  if (!dishImg) errorList.push('ImageUrl is required');

  if (errorList.length > 0) {
    res.status(400).json({ message: errorList });
  } else {
    const aws_res = await uploadFile(dishImg);

    const dish = new Dish({
      dishName,
      description,
      price,
      storeId: hasStore.id,
      imgKey: aws_res.Key,
      imgUrl: aws_res.Location,
    });

    const createdDish = await dish.save();
    res.status(201).json(createdDish);
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
 * @desc    get store dishes
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
 * @desc    get all dishes
 * @route   POST /api/store/dishes/get-all
 * access  Public
 */
export const getAllDishes = asyncHandler(async (req, res) => {
  const allDishes = await Dish.find().sort({ createdAt: -1 });
  res.status(200).json({ storesAllDishes: allDishes });
});

/**
 * @desc    get dishes image
 * @route   POST /api/store/dishes/get-all
 * access  Public
 */
export const getDishImage = asyncHandler(async (req, res) => {
  const { key } = req.params;
  const readStream = getFileStream(key);
  readStream.pipe(res);
});
