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
import User from '../models/user';
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

    res.send({ ids });
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

    // const { name, items } = shoppingList;

    res.status(HTTP_CODE.HTTP_OK).send(shoppingList);
  }

  @get('/')
  async getAllListByUser(req: Request, res: Response) {
    /// Find the user
    const requestingUser = await User.findById(req.currentUser!.id);

    let userids = [requestingUser!.id];
    if (requestingUser!.groupId !== null) {
      /// Find all the users whose groupid === requsetinguser.groupid

      const users = await User.find({ groupId: requestingUser!.groupId });

      /// Create an array of userids
      userids = users.map((user) => user.id);
    }

    /// return shopping list created by any of these users
    const shoppingLists = await ShoppingModel.find({
      creatorId: { $in: userids },
    });

    res.status(HTTP_CODE.HTTP_OK).send(shoppingLists);
  }
}
