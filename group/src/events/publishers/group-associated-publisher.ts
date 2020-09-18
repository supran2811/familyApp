import { Publisher, GroupAssociated, Subjects } from '@familyapp/common';

export class GroupAssociatedPublisher extends Publisher<GroupAssociated> {
  readonly subject = Subjects.GroupAssociated;
}
