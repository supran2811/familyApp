import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Skeleton from '../../components/Skeleton';
import useGetCurrentUser from '../../hooks/useGetCurrentUser';
import './MemberList.css';
import Members from '../../components/Members';
import { getMembers } from '../../selectors/groupSelector';
import { fetchMembers, sendInviteToNewMember } from '../../actions/groupAction';
import { IonToast } from '@ionic/react';

const MemberList: React.FC = () => {
  const [showSucessToast, setShowSucessToast] = useState(false);

  const [toastMessage, setToastMessage] = useState('');

  const user = useGetCurrentUser();
  const dispatch = useDispatch();
  const members = useSelector(getMembers);

  const addNewMember = (email: string) => {
    dispatch(
      sendInviteToNewMember({
        payload: email,
        callback: (response: any) => {
          if (response.errors) {
            setToastMessage(response.errors[0].message);
          } else {
            setToastMessage('Invitation is sent sucessfully!!');
          }
          setShowSucessToast(true);
        },
      })
    );
  };

  useEffect(() => {
    user && dispatch(fetchMembers());
  }, [user]);

  return (
    <Skeleton currentUser={user}>
      <IonToast
        isOpen={showSucessToast}
        onDidDismiss={() => setShowSucessToast(false)}
        message={toastMessage}
        duration={200}
      />
      <div className="content">
        <Members members={members} addNewMemberAction={addNewMember} />
      </div>
    </Skeleton>
  );
};

export default MemberList;
