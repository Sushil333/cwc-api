import asyncHandler from 'express-async-handler';

import Store from '../models/store.js';

/**
 * @desc    create store
 * @route   POST /api/store/create
 * access  Public
 */
export const createStore = asyncHandler(async (req, res) => {
  const imgUrl =
    'https://lh3.googleusercontent.com/EGD6C34eosVtKkElJybCOXIaOC-_iw5lYXzOmGdfMpjtaqijt1Oym_ltWjs5uyx3d8jo0ew8rg7tzFVMWszKGSbL3Ny_=w256';
  const { name, phoneNo, address, subPrice, gstin } = req.body;

  const hasStore = await Store.findOne({ owner: req.user.id });
  if (hasStore) {
    res.status(400).json({ message: 'You Already Have A Store!' });
  }

  let errorList = [];
  if (!name) errorList.push('name is required');
  if (!phoneNo) errorList.push('phoneNo is required');
  if (!address) errorList.push('address is required');
  if (!subPrice) errorList.push('subPrice is required');

  if (errorList.length > 0) {
    res.status(400).json({ message: errorList });
  } else {
    const store = new Store({
      name,
      phoneNo,
      address,
      subPrice,
      gstin,
      imageUrl: imgUrl,
      owner: req.user.id,
    });

    const createdStore = await store.save();
    res.status(201).json(createdStore);
  }
});
