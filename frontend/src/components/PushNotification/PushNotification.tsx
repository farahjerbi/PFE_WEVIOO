// PushNotification.tsx
import React, { useState, useEffect } from 'react';
import { registerServiceWorker } from '../../sw';
import { useSubscribeMutation } from '../../redux/services/pushApi';
import { useSelector } from 'react-redux';
import { selectRole, selectUser } from '../../redux/state/authSlice';
import ListPush from '../../pages/admin/push/list/ListPush';
import BreadcrumSection from '../BreadcrumSection/BreadcrumSection';
import { MDBContainer } from 'mdb-react-ui-kit';
import { Button } from '@mui/material';
import { Role } from '../../models/user/Role';
import { useLocation, useNavigate } from 'react-router-dom';
import UpdatePush from '../../pages/admin/push/update/UpdatePush';

const applicationServerPublicKey = 'BOdufZ-xvfmjBHSA8YEl0oVxLbf6wNPgQuHngrjJI1q8rZkMF2x-ZrJ7to0s_jTr8Q9HVDY0pcIfaMTEu1L8XfU';

const PushNotification: React.FC = () => {
  const [query,setQuery]=useState<string>("")
  console.log("🚀 ~ query:", query)
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [open, setOpen] = useState(false);
  const [swRegistration, setSwRegistration] = useState<ServiceWorkerRegistration | null>(null);
  const user=useSelector(selectUser)
  const role = useSelector(selectRole)
  const location = useLocation();
  const navigate = useNavigate()
    const[subscribe]=useSubscribeMutation()
    
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const searchQuery = queryParams.get('query') || '';
    setQuery(searchQuery.toLowerCase());
    registerServiceWorker().then(reg => {
      if (reg) {
        setSwRegistration(reg);
      }
    }).catch(error => {
      console.error('Error registering service worker:', error);
    });
  }, []);

  const subscribeFunction = async () => {
    if (!swRegistration) return;
  
    try {
      const subscribeParams = {
        userVisibleOnly: true,
        applicationServerKey: urlB64ToUint8Array(applicationServerPublicKey)
      };
  
      const subscription = await swRegistration.pushManager.subscribe(subscribeParams);
      setIsSubscribed(true);
  
      const keyArray = subscription.getKey('p256dh');
      const authArray = subscription.getKey('auth');
  
      if (keyArray && authArray) {
        const encodedKey = encodeUint8Array(new Uint8Array(keyArray));
        const encodedAuth = encodeUint8Array(new Uint8Array(authArray));

        const requestData = {
          publicKey: encodedKey,
          auth: encodedAuth,
          notificationEndPoint: subscription.endpoint,
          userId:user?.id || 0 ,
        };
  
        await subscribe(requestData);
      } else {
        console.error('Unable to retrieve keys for subscription.');
      }
    } catch (error) {
      console.error('Unable to subscribe to push.', error);
    }
  };
  
  
  const urlB64ToUint8Array = (base64String: string): Uint8Array => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const uint8Array = new Uint8Array(rawData.length);
  
    for (let i = 0; i < rawData.length; ++i) {
      uint8Array[i] = rawData.charCodeAt(i);
    }
  
    return uint8Array;
  };
  
  const encodeUint8Array = (array: Uint8Array): string => {
    const binaryString = Array.from(array)
      .map(byte => String.fromCharCode(byte))
      .join('');
    return btoa(binaryString);
  };
  
  


  const removeSubscriptionFromServer = (endpoint: string) => {
    // Implementation of removing subscription details from the server
  };

  const unsubscribe = async () => {
    if (!swRegistration) return;

    try {
      const subscription = await swRegistration.pushManager.getSubscription();
      if (subscription) {
        const endpoint = "http://localhost:8093/apiPush/unsubscribe";
        await subscription.unsubscribe();
        setIsSubscribed(false);
        removeSubscriptionFromServer(endpoint);
      }
    } catch (error) {
      console.error('Error unsubscribing', error);
    }
  };

  const handleButtonClick = () => {
    if (isSubscribed) {
      console.log("Unsubscribing...");
      unsubscribe();
    } else {
      subscribeFunction();
    }
  };

  return (
    <>
    <BreadcrumSection/>
    <MDBContainer className="mt-5 d-flex" style={{marginLeft:"17%",width:"70%"}}  >
      <div  style={{marginTop:"5%"}}>
      <img src="../../../assets/search .png" alt="search" style={{width:"3%"}} />
            <input
              type="text"
              className="search-hover me-5"
              placeholder="Search here..."
              onChange={(e) => setQuery(e.target.value)}
              />
                   <button className="btn btn-primary ms-5" onClick={handleButtonClick}>
        {isSubscribed ? 'Unsubscribe from push notifications' : 'Subscribe to push notifications'}
      </button>
      {role===Role.ADMIN && (
      <Button onClick={()=>setOpen(!open)} style={{width:"20%"}} size="small" className="mb-2" >
      <img  src="../../../assets/add.png" alt="" style={{width:"25%",marginRight:"3%"}} />Create
      </Button>
      )}
      
      </div>
         
      </MDBContainer> 
      <div style={{marginLeft:"8%"}}>
      <ListPush query={query}  />
      </div>
      {open && (
      <UpdatePush view={false}  show={open} onClose={()=>{setOpen(!open)}} template={undefined} />
      )}
    </>
  );
};

export default PushNotification;
