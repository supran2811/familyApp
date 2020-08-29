import mongoose from 'mongoose';

interface UserAttrs {
    name: string;
    email: string;
    password: string;
}

interface UserDoc extends mongoose.Document {
    name: string;
    email: string;
    password: string;
}

interface UserModel extends mongoose.Model<UserDoc> {
    build(attrs: UserAttrs) : UserDoc;
}

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

userSchema.statics.build = (attrs: UserAttrs) => new User(attrs);

const User = mongoose.model<UserDoc,UserModel>("User",userSchema);


export default User;