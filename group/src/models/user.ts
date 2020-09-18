import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface UserAttrs {
  id: string;
  name: string;
  email: string;
  groupId?: string;
}

export interface UserDoc extends mongoose.Document {
  name: string;
  email: string;
  groupId: string;
  version: string;
}

interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'group',
      default: null,
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

userSchema.set('versionKey', 'version');
userSchema.plugin(updateIfCurrentPlugin);

userSchema.statics.build = (attrs: UserAttrs) =>
  new User({
    _id: attrs.id,
    name: attrs.name,
    email: attrs.email,
    groupId: attrs.groupId,
  });

const User = mongoose.model<UserDoc, UserModel>('user', userSchema);

export default User;
