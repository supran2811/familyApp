import { Request, Response } from 'express';
import {
  controller,
  post,
  validator,
  useMiddleware,
  validateRequest,
  NotFoundError,
  HTTP_CODE,
  get,
  BadRequestError,
  del,
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
  @post('/invites')
  @validator(body('email').isEmail().withMessage('Valid email is required'))
  @useMiddleware(validateRequest)
  async sendInviteToMember(req: Request, res: Response) {
    // check if user is already signed up
    const { email } = req.body;

    const requestingUser = await User.findById(req.currentUser!.id);

    if (!requestingUser) {
      throw new NotFoundError();
    }

    // else create a new group
    if (requestingUser.groupId === null) {
      const newGroup = Group.build({
        members: [requestingUser],
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
      senderName: req.currentUser!.name,
      senderEmail: req.currentUser!.email,
      groupId: requestingUser.groupId,
    });

    await newMemberModel.save();

    res.status(HTTP_CODE.HTTP_OK).send(newMemberModel);
  }

  @get('/invites')
  async getInvitesForUser(req: Request, res: Response) {
    const invites = await NewMember.find({ email: req.currentUser!.email });

    const formattedInvites = invites.map((invite) => ({
      id: invite.id,
      email: invite.email,
      senderName: invite.senderName,
      senderEmail: invite.senderEmail,
      groupId: invite.groupId,
    }));

    return res.status(HTTP_CODE.HTTP_OK).send(formattedInvites);
  }

  @post('/invites/:id/accept')
  async acceptInvite(req: Request, res: Response) {
    const { id } = req.params;

    const invite = await NewMember.findById(id);

    if (!invite) {
      throw new NotFoundError();
    }

    if (!invite.groupId) {
      throw new BadRequestError('Associated Group id is empty');
    }

    /// Find if this user already associated to group then unassociate from that group.
    const user = await User.findById(req.currentUser!.id);

    if (!user) {
      throw new NotFoundError();
    }

    if (user.groupId) {
      const oldGroup = await Group.findById(user.groupId);
      if (oldGroup) {
        const updatedMembers = oldGroup.members.filter(
          (ele) => ele.id !== user.id
        );
        user.set({ members: updatedMembers });
        await user.save();
      }
    }

    /// Find existing group and then add this user as its member
    const group = await Group.findById(invite.groupId);

    if (!group) {
      throw new BadRequestError('Group id is empty');
    }

    const members = group.members.concat(user);

    group.set({ members });

    await group.save();

    /// add this group id as association

    user.set({ groupId: group.id });

    await user.save();

    await NewMember.findByIdAndDelete(id);

    // Publish an event to let others know about this update
    new GroupAssociatedPublisher(natsWrapper.client).publish({
      userid: user.id,
      groupid: user.groupId,
      version: user.version,
    });

    return res.status(HTTP_CODE.HTTP_OK).send(user);
  }

  @del('/invites/:id/decline')
  async declineInvite(req: Request, res: Response) {
    const { id } = req.params;
    await NewMember.findByIdAndDelete(id);

    res.status(HTTP_CODE.HTTP_OK).send({ id });
  }

  @get('/:id')
  async getGroup(req: Request, res: Response) {
    const { id } = req.params;
    const group = await Group.findById(id);
    return res.status(HTTP_CODE.HTTP_OK).send(group);
  }
}
