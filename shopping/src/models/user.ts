import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface UserAttrs {
  id: string;
  groupId?: string;
}

interface UserDoc extends mongoose.Document {
  id: string;
  groupId?: string;
  version: number;
}

interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
  findByEvent(event: { id: string; version: number }): Promise<UserDoc | null>;
}

const userSchema = new mongoose.Schema(
  {
    groupId: {
      type: String,
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
    groupId: attrs.groupId,
  });

userSchema.statics.findByEvent = (event: { id: string; version: number }) =>
  User.findOne({
    _id: event.id,
    version: event.version - 1,
  });

const User = mongoose.model<UserDoc, UserModel>('user', userSchema);

export default User;
