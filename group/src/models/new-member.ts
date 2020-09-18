import mongoose from 'mongoose';

interface NewMemberAttrs {
  email: string;
  senderName: string;
  senderEmail: string;
  groupId: string;
}

interface NewMemberDoc extends mongoose.Document {
  email: string;
  senderName: string;
  senderEmail: string;
  groupId: string;
}

interface NewMemberModel extends mongoose.Model<NewMemberDoc> {
  build(attrs: NewMemberAttrs): NewMemberDoc;
}

const newMemberSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    senderName: {
      type: String,
      required: true,
    },
    senderEmail: {
      type: String,
      required: true,
    },
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'group',
      required: true,
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

newMemberSchema.statics.build = (attrs: NewMemberAttrs) => new NewMember(attrs);

const NewMember = mongoose.model<NewMemberDoc, NewMemberModel>(
  'newmember',
  newMemberSchema
);

export default NewMember;
