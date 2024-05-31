import { MDBBtn, MDBIcon, MDBInput } from 'mdb-react-ui-kit';
import React, { useEffect, useState } from 'react'
interface WebSubscriptionInputProps {
  onChange: (subscriptions: WebPushSubscription[]) => void;
}

interface WebPushSubscription {
  notificationEndPoint: string;
  publicKey: string;
  auth: string;
}
const WebSubscriptionInput: React.FC<WebSubscriptionInputProps> = ({ onChange }) => {
  const [subscriptions, setSubscriptions] = useState<WebPushSubscription[]>([{ notificationEndPoint: '', publicKey: '', auth: '' }]);

  useEffect(() => {
    onChange(subscriptions);
  }, [subscriptions, onChange]);

  const handleSubscriptionChange = (index: number, field: keyof WebPushSubscription, value: string) => {
    const newSubscriptions = [...subscriptions];
    newSubscriptions[index][field] = value;
    setSubscriptions(newSubscriptions);
  };

  const addSubscriptionField = () => {
    if (subscriptions.length < 4) {
      setSubscriptions([...subscriptions, { notificationEndPoint: '', publicKey: '', auth: '' }]);
    }
  };

  const removeSubscriptionField = (index: number) => {
    const newSubscriptions = [...subscriptions];
    newSubscriptions.splice(index, 1);
    setSubscriptions(newSubscriptions);
  };
  return (
    <div className='container-input mt-5'>

      {subscriptions.map((subscription, index) => (
        <div key={index} className='d-flex mb-2 mt-2'>
          <MDBInput
            className='me-2'
            name={`notificationEndPoint-${index}`}
            type="text"
            label="Notification End Point"
            value={subscription.notificationEndPoint}
            onChange={(e) => handleSubscriptionChange(index, 'notificationEndPoint', e.target.value)}
            required
          />
          <MDBInput
            className='me-2'
            name={`publicKey-${index}`}
            type="text"
            label="Public Key"
            value={subscription.publicKey}
            onChange={(e) => handleSubscriptionChange(index, 'publicKey', e.target.value)}
            required
          />
          <MDBInput
            name={`auth-${index}`}
            type="text"
            label="Auth"
            value={subscription.auth}
            onChange={(e) => handleSubscriptionChange(index, 'auth', e.target.value)}
            required
          />
          {index > 0 && (
            <MDBBtn type="button" onClick={() => removeSubscriptionField(index)} className="remove-btn">
               <MDBIcon icon="remove" style={{marginRight:"3px"}}/>
            </MDBBtn>
          )}
        </div>
      ))}
      {subscriptions.length < 4 && (
        <MDBBtn type="button" onClick={addSubscriptionField} className="add-btn me-5 " >
          <MDBIcon  icon="add" style={{marginRight:"3px"}}/>
          Add
        </MDBBtn>
      )}
    </div>
  );
}

export default WebSubscriptionInput