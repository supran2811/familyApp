import mongoose from 'mongoose';

import { UserDoc } from './user';

interface GroupAttrs {
  members: UserDoc[];
}

export interface GroupDoc extends mongoose.Document {
  members: UserDoc[];
}

interface GroupModel extends mongoose.Model<GroupDoc> {
  build(attrs: GroupAttrs): GroupDoc;
}

const groupSchema = new mongoose.Schema(
  {
    members: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'user',
        },
      ],
      default: [],
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

groupSchema.statics.build = (attrs: GroupAttrs) => new Group(attrs);

const Group = mongoose.model<GroupDoc, GroupModel>('group', groupSchema);

export default Group;
