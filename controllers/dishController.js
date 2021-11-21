import asyncHandler from 'express-async-handler';

import Dish from '../models/dish.js';
import Store from '../models/store.js';

/**
 * @desc    create dish
 * @route   POST /api/store/dishes/create
 * @access  Public
 */
export const createDish = asyncHandler(async (req, res) => {
  const imgUrl =
    'https://lh3.googleusercontent.com/EGD6C34eosVtKkElJybCOXIaOC-_iw5lYXzOmGdfMpjtaqijt1Oym_ltWjs5uyx3d8jo0ew8rg7tzFVMWszKGSbL3Ny_=w256';
  const { dishName, description, price } = req.body;

  const hasStore = await Store.findOne({ owner: req.user.id });
  if (!hasStore) {
    res.status(400).json({ message: 'You have to create your store first!' });
  }

  let errorList = [];
  if (!dishName) errorList.push('dishName is required');
  if (!description) errorList.push('description is required');
  if (!price) errorList.push('price is required');

  if (errorList.length > 0) {
    res.status(400).json({ message: errorList });
  } else {
    const dish = new Dish({
      dishName,
      description,
      price,
      storeId: hasStore.id,
      imageUrl: imgUrl,
    });

    const createdDish = await dish.save();
    res.status(201).json(createdDish);
  }
});
