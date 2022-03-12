import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import asyncHandler from 'express-async-handler';
import { unlink } from 'fs';
import util from 'util';

import Store from '../models/store.js';
import Manager from '../models/manager.js';
import Dish from '../models/dish.js';
import Role from '../models/_helpers/role.js';

import { deleteFile, uploadFile, getFileStream } from '../utils/s3.js';
import sendMail from '../utils/nodemailer.js';
import storeStatus from '../models/_helpers/storeStatus.js';

const unLinkFile = util.promisify(unlink);

/**
 * @desc   create store
 * @route  POST /api/store/create
 * access  Public
 */
export const createStore = asyncHandler(async (req, res) => {
  const aadharCard = req.files['aadhar'][0];
  const panCard = req.files['pancard'][0];

  const { storeName, email, mobileNo, storeAddress, firstName, lastName } =
    req.body;

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
    if (aadharUploadRes) await unLinkFile(aadharCard.path);

    const panUploadRes = await uploadFile(panCard);
    if (panUploadRes) await unLinkFile(panCard.path);

    const store = new Store({
      firstName,
      lastName,
      storeName,
      phoneNo: mobileNo,
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
 * @desc   new store requets
 * @route  POST /api/store/requests
 * access  private
 */
export const storeRequests = asyncHandler(async (req, res) => {
  const storeRequestList = await Store.find({
    status: storeStatus.Approved || storeStatus.Pending,
  }).sort({ createdAt: -1 });
  res.status(200).json({ data: storeRequestList });
});

export const getStores = asyncHandler(async (req, res) => {
  const storeRequestList = await Store.find({
    status: storeStatus.Approved,
  }).sort({ ra: -1 });
  res.status(200).json({ data: storeRequestList });
});

/**
 * @desc   create store
 * @route  POST /api/store/send-approved-mail
 * access  private
 */
export const sendApprovedMail = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const store = await Store.findById(id);

  if (!store) res.send({ data: 'Store not found!' });
  else {
    let password = crypto.randomBytes(8).toString('hex');
    const hashedPassword = await bcrypt.hash(password, 12);

    const result = await Manager.create({
      email: store.email,
      name: `${store.firstName} ${store.lastName}`,
      password: hashedPassword,
      role: Role.Manager,
      active: true,
    });

    store.owner = result._id;
    store.status = storeStatus.Approved;

    store.save((err) => {
      if (err) res.status(400).json({ data: err });
    });

    const payload = {
      to: store.email,
      type: 'approved',
      storeName: store.storeName,
      firstName: store.firstName,
      lastName: store.lastName,
      password: password,
    };

    await sendMail(payload);

    res.status(200).json({ data: `send verification mail to ${store.email}` });
  }
});

/**
 * @desc   create store
 * @route  POST /api/store/send-rejection-mail
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
    if (aws_res) await unLinkFile(dishImg.path);

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
 * @desc   get store dishes
 * @route  POST /api/store/dishes/get-all
 * access  Public
 */
export const getStoreDishes = asyncHandler(async (req, res) => {
  const hasStore = await Store.findOne({ owner: req.user.id });
  console.log(req.user.id);
  if (!hasStore) {
    res.status(400).json({ message: 'You have to create your store first!' });
  } else {
    const allDishes = await Dish.find({ storeId: hasStore.id }).sort({
      createdAt: -1,
    });
    res.status(200).json({ storesAllDishes: allDishes });
  }
});

export const getStoreDishesPublic = asyncHandler(async (req, res) => {
  const { storeId } = req.params;

  const hasStore = await Store.findById(storeId);
  if (!hasStore) {
    res.status(400).json({ error: 'You have to create your store first!' });
  } else {
    const allDishes = await Dish.find({ storeId: storeId }).sort({
      createdAt: -1,
    });
    res.status(200).json({ data: allDishes });
  }
});

export const getStoreById = asyncHandler(async (req, res) => {
  const { storeId } = req.params;
  const hasStore = await Store.findById(storeId);
  if (!hasStore) {
    res.status(400).json({ error: 'You have to create your store first!' });
  }
  res.status(200).json({ data: hasStore });
});

/**
 * @desc   get all dishes
 * @route  POST /api/store/dishes/get-all
 * access  Public
 */
export const getAllDishes = asyncHandler(async (req, res) => {
  const allDishes = await Dish.find().sort({ createdAt: -1 });
  res.status(200).json({ storesAllDishes: allDishes });
});

/**
 * @desc   get dishes image
 * @route  POST /api/store/dishes/get-all
 * access  Public
 */
export const getDishImage = asyncHandler(async (req, res) => {
  const { key } = req.params;
  const readStream = getFileStream(key);
  readStream.pipe(res);
});
