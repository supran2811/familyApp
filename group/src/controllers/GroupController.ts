import {
  controller,
  post,
  validator,
  useMiddleware,
  validateRequest,
  NotFoundError,
  HTTP_CODE,
  get,
} from '@familyapp/common';

import { router } from '../server';
import { body } from 'express-validator';
import User from '../models/user';
import Group from '../models/group';
import NewMember from '../models/new-member';
import { GroupAssociatedPublisher } from '../events/publishers/group-associated-publisher';
import { natsWrapper } from '../nats-wrapper';

@controller('/api/group', router)
export class GroupController {
  @post('/invite')
  @validator(body('email').isEmail().withMessage('Valid email is required'))
  @useMiddleware(validateRequest)
  async sendInviteToMember(req, res) {
    // check if user is already signed up
    const { email } = req.body;

    const requestingUser = await User.findById(req.currentUser.id);

    if (!requestingUser) {
      throw new NotFoundError();
    }

    // else create a new group
    if (requestingUser.groupId === null) {
      const newGroup = Group.build({
        members: [req.currentUser.id],
      });

      await newGroup.save();

      requestingUser.set({ groupId: newGroup.id });

      await requestingUser.save();

      new GroupAssociatedPublisher(natsWrapper.client).publish({
        userid: requestingUser.id,
        groupid: requestingUser.groupId,
        version: requestingUser.version,
      });
    }

    //// else update the invitation model
    const newMemberModel = NewMember.build({
      email,
      senderName: req.currentUser.name,
      senderEmail: req.currentUser.email,
      groupId: requestingUser.groupId,
    });

    await newMemberModel.save();

    res.status(HTTP_CODE.HTTP_OK).send(newMemberModel);
  }

  @get('/invite')
  async getInvitesForUser(req, res) {
    const invites = await User.find({ email: req.currentUser.email });

    res.status(HTTP_CODE.HTTP_OK).send(invites);
  }
}
