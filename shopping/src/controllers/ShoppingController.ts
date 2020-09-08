import {
  controller,
  post,
  put,
  del,
  get,
  useMiddleware,
  usePreValidateMiddleware,
  requireAuth,
  validator,
  validateRequest,
  HTTP_CODE,
  NotFoundError,
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

    res.status(HTTP_CODE.HTTP_CREATED).send({ id: shoppingModel.id });
  }

  @put('/:id')
  @validator(
    check('creatorName')
      .exists()
      .withMessage('Original creator cannot be updated'),
    check('creatorId')
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
      .not()
      .isArray()
      .withMessage('require valid shopping list ids to delete'),
    check('ids')
      .toArray()
      .isEmpty()
      .withMessage('require valid shopping list ids to delete')
  )
  @useMiddleware(validateRequest)
  async deleteMany(req: Request, res: Response) {
    const { ids } = req.body;
    await ShoppingModel.deleteMany({
      id: {
        $in: ids,
      },
    });

    res.send({});
  }

  @get('/:id')
  async show(req: Request, res: Response) {
    res.send({});
  }

  @get('/')
  async getAllListByUser(req: Request, res: Response) {
    res.send({});
  }
}
