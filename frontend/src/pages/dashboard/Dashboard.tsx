import { useDispatch } from "react-redux"
import BreadcrumSection from "../../components/BreadcrumSection/BreadcrumSection"
import Section1 from "../../components/section1/Section1"
import { AppDispatch } from "../../redux/store"
import Calendar from "../admin/Email/calendar/Calendar"
import EmailStatistics from "../admin/Email/statistics/EmailStatistics"
import { useEffect } from "react"
import { getTemplatesEmail } from "../../redux/state/emailSlice"
import { getUsers } from "../../redux/state/usersSlice"
import { getTemplatesSms, getTemplatesWhatsapp } from "../../redux/state/smsSlice"
import SmsStatistics from "../admin/sms/statistic/SmsStatistics"
import { getTemplatesPush } from "../../redux/state/pushSlice"

const Dashboard = () => {
  const dispatch: AppDispatch = useDispatch(); 
  useEffect(() => {
    dispatch(getTemplatesEmail());
    dispatch(getUsers());
    dispatch(getTemplatesSms())
    dispatch(getTemplatesWhatsapp())
    dispatch(getTemplatesPush())
  }, [dispatch]);
  return (
    <>
    <BreadcrumSection/>
    <Section1/>
    <div style={{ display: 'flex', alignItems: 'flex-start' }}>
    <div style={{ width:"30%" ,marginLeft:"13%"}}>
      <EmailStatistics/>
      <SmsStatistics/>
    </div>
    <div style={{width:"55%",marginRight: '5.5%'}}>
    <Calendar emails={[]} sms={[]} whatsapp={[]}/>
    </div>
    </div>  
      {/* <UsersStatistics/> */}

    </>
  )
}

export default Dashboard