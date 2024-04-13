import { useEffect } from 'react';
import BreadcrumSection from '../../../../components/BreadcrumSection/BreadcrumSection'
import { useGetSavedTemplatesEamilMutation } from '../../../../redux/services/emailApi';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from '../../../../redux/state/authSlice';
import { setSavedEmails } from '../../../../redux/state/emailSlice';
import { toast } from 'sonner';
import Features from '../../../../components/features/Features';

const SavedTemplates = () => {
    const user=useSelector(selectUser)
    const dispatch=useDispatch();
    const[getSavedTemplatesEamil]=useGetSavedTemplatesEamilMutation()
    useEffect(() => {
        fetchData();
      },[]);
    const fetchData = async () => {
        try {
        const responseTemplate = await getSavedTemplatesEamil(user?.id).unwrap();
        dispatch(setSavedEmails(responseTemplate))
        } catch (error) {
          toast.error("Error! Yikes");
          console.error("🚀 ~ error:", error);
        }
      };
  return (
    <>
    <BreadcrumSection/>
    <Features/>
    </>
  )
}

export default SavedTemplates