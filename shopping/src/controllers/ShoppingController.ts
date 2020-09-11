import {
  controller,
  post,
  put,
  del,
  get,
  useMiddleware,
  validator,
  validateRequest,
  HTTP_CODE,
  NotFoundError,
  AuthenticationError,
} from '@familyapp/common';
import { body, check } from 'express-validator';
import { Request, Response } from 'express';
import ShoppingModel from '../models/shopping';

import { router } from '../server';

@controller('/api/shopping', router)
export class Shopping {
  @post('/')
  @validator(
    body('name')
      .trim()
      .isLength({ min: 2, max: 40 })
      .withMessage('Enter valid name of shopping list')
  )
  @useMiddleware(validateRequest)
  async create(req: Request, res: Response) {
    const { name } = req.body;
    const { name: creatorName, id: creatorId } = req.currentUser!;
    const shoppingModel = ShoppingModel.build({
      name,
      creatorName,
      creatorId,
    });

    await shoppingModel.save();

    res.status(HTTP_CODE.HTTP_CREATED).send(shoppingModel);
  }

  @put('/:id')
  @validator(
    check('creatorName')
      .not()
      .exists()
      .withMessage('Original creator cannot be updated'),
    check('creatorId')
      .not()
      .exists()
      .withMessage('Original creator cannot be updated'),
    body('name')
      .trim()
      .isLength({ min: 2, max: 40 })
      .withMessage('Enter valid name of shopping list')
  )
  @useMiddleware(validateRequest)
  async update(req: Request, res: Response) {
    const { id } = req.params;
    const shoppingListToUpdate = await ShoppingModel.findById(id);
    if (!shoppingListToUpdate) {
      throw new NotFoundError();
    }
    const { name, items = [] } = req.body;

    shoppingListToUpdate.set({
      name,
      items,
    });

    await shoppingListToUpdate.save();

    res.send(shoppingListToUpdate);
  }

  @del('/')
  @validator(
    check('ids')
      .isArray()
      .withMessage('require valid shopping list ids to delete')
  )
  @useMiddleware(validateRequest)
  async deleteMany(req: Request, res: Response) {
    const { ids } = req.body;
    await ShoppingModel.deleteMany({
      _id: {
        $in: ids,
      },
    });

    res.send({});
  }

  @get('/:id')
  async show(req: Request, res: Response) {
    const { id } = req.params;
    const shoppingList = await ShoppingModel.findById(id);
    if (!shoppingList) {
      throw new NotFoundError();
    }
    if (shoppingList.creatorId !== req.currentUser!.id) {
      throw new AuthenticationError('User not allowed to view this content');
    }

    const { name, items } = shoppingList;

    res.status(HTTP_CODE.HTTP_OK).send({ name, items });
  }

  @get('/')
  async getAllListByUser(req: Request, res: Response) {
    const shoppingLists = await ShoppingModel.find({
      creatorId: req.currentUser!.id,
    });

    res.status(HTTP_CODE.HTTP_OK).send(shoppingLists);
  }
}
