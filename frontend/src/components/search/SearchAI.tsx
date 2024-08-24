import axios from 'axios';
import React, { useEffect, useState } from 'react'
import BreadcrumSection from '../BreadcrumSection/BreadcrumSection';
import "./SearchAI.css"
import { MDBBadge, MDBBtn, MDBCard, MDBCardBody, MDBContainer, MDBInput, MDBTable, MDBTableBody, MDBTableHead } from 'mdb-react-ui-kit';
import { useDispatch, useSelector } from 'react-redux';
import { selectToken } from '../../redux/state/authSlice';
import { EmailTemplate } from '../../models/email/EmailTemplate';
import { SmsTemplate } from '../../models/sms/SmsTemplate';
import { WebPushTemplate } from '../../models/push/WebPushTemplate';
import { getTemplatesPush, selectPushs, setPushById } from '../../redux/state/pushSlice';
import { getTemplatesEmail, selectEmails } from '../../redux/state/emailSlice';
import { getTemplatesSms, selectSMSs } from '../../redux/state/smsSlice';
import { Button, Tooltip } from '@mui/material';
import { TemplateBody } from '../../models/email/TemplateBody';
import { AppDispatch } from '../../redux/store';
import Pageview from '@mui/icons-material/Pageview';
import { useNavigate } from 'react-router-dom';
import { LIST_EMAIL_TEMPLATES, LIST_PUSH_TEMPLATES, LIST_SMS_TEMPLATES } from '../../routes/paths';
interface Template {
    id: number;
    type: string;
    name:string;
    title:string;
    subject:string;
    templateBody:TemplateBody;
  }
const SearchAI = () => {
    const [userDescription, setUserDescription] = useState('');
    const [matchedTemplates, setMatchedTemplates] = useState<Template[]>([]);
    console.log("🚀 ~ SearchAI ~ matchedTemplates:", matchedTemplates)
    const [open, setOpen] = useState<boolean>(false);
    const token=useSelector(selectToken)
    const EmailTemplates=useSelector(selectEmails)|| [];
    console.log("🚀 ~ SearchAI ~ EmailTemplates:", EmailTemplates)
    const SMSTemplates=useSelector(selectSMSs)|| [];
    console.log("🚀 ~ SearchAI ~ SMSTemplates:", SMSTemplates)
    const PUSHTemplates=useSelector(selectPushs)|| [];
    console.log("🚀 ~ SearchAI ~ PUSHTemplates:", PUSHTemplates)
    const dispatchh: AppDispatch = useDispatch(); 
    const navigate=useNavigate()
    useEffect(() => {
        dispatchh(getTemplatesEmail());
        dispatchh(getTemplatesSms())
        dispatchh(getTemplatesPush())
    }, []);

    const handleSearch = async () => {
        try {
          if (token && token.startsWith('"') && token.endsWith('"')) {
            let tokeen = token.substring(1, token.length - 1);
            console.log("🚀 ~ handleSearch ~ tokeen:", tokeen)
        
        const response = await axios.post(
          'http://localhost:5000/api/search', 
          { description: userDescription }, 
          { headers: { 'Authorization': `Bearer ${tokeen}` } }
      );
        const templatesFromApi: Template[] = response.data;

        if(templatesFromApi.length>0){
            const emailIds = templatesFromApi?.filter(t => t.type === 'email').map(t => t.id);
            const smsIds = templatesFromApi?.filter(t => t.type === 'sms').map(t => t.id);
            const pushIds = templatesFromApi?.filter(t => t.type === 'push').map(t => t.id);
    
            const emailTemplates = EmailTemplates?.filter((t: EmailTemplate) =>emailIds.includes(t.id as number));
            const smsTemplates = SMSTemplates?.filter((t: SmsTemplate) =>smsIds.includes(t.id as number));
            const pushTemplates = PUSHTemplates?.filter((t: WebPushTemplate) =>pushIds.includes(t.id as number));
    
            const allTemplates = [
              ...emailTemplates.map((t:any) => ({ ...t, type: 'email' })),
              ...smsTemplates.map(t => ({ ...t, type: 'sms' })),
              ...pushTemplates.map(t => ({ ...t, type: 'push' }))
          ];        
          const topTemplates = allTemplates.slice(0, 3);
    
            setMatchedTemplates(topTemplates);
        }
  
        setOpen(true);
    }
        } catch (error:any) {
            console.error('Error fetching template:', error.response || error.message || error)
        }
    };

    const viewDetails=(template:Template)=>{
        if(template.type==="email"){
            navigate(`${LIST_EMAIL_TEMPLATES}?query=${template.name}`);
        }else if(template.type==="sms"){
            navigate(`${LIST_SMS_TEMPLATES}?query=${template.name}`);
        }else{
            navigate(`${LIST_PUSH_TEMPLATES}?query=${template.title}`);
        }
    }
    return (
      <>
          <BreadcrumSection />
          <div className='container-search '>
              {!open && (
                  <MDBContainer fluid style={{ width: "80%" }}>
                      <div className="p-5 bg-image" style={{ backgroundImage: `url('../../../assets/aiseacrh.jpg')`, height: '300px' }}></div>

                      <MDBCard className='mx-5 mb-5 p-5 shadow-5' style={{ marginTop: '-100px', background: 'hsla(0, 0%, 100%, 0.8)', backdropFilter: 'blur(30px)' }}>
                          <MDBCardBody className='p-5 text-center'>
                              <MDBInput value={userDescription} onChange={(e) => setUserDescription(e.target.value)} wrapperClass='mb-4' label='Enter a description for the wished template' />
                              <MDBBtn className='w-100 mb-4 color_blue' onClick={()=>handleSearch()}>Search Template</MDBBtn>
                          </MDBCardBody>
                      </MDBCard>
                  </MDBContainer>
              )}

              {open && (
                  <div>
                          <MDBCard style={{ background: 'hsla(0, 0%, 100%, 0.55)', backdropFilter: 'blur(30px)' }}>
                              <MDBCardBody>
                                  <MDBTable striped hover bordered>
                                      <MDBTableHead color="blue lighten-4">
                                          <tr>
                                              <th className='tab'>Name Template</th>
                                              <th className='tab'>Type</th>
                                              <th className='tab'>Subject</th>
                                              <th className='tab'>View Details</th>
                                          </tr>
                                      </MDBTableHead>
                                      <MDBTableBody>
                                      {matchedTemplates.map((template, index) => (
                                          <tr>
                                              <td className='tab'>{template.name || template.title}</td>
                                              <td className='tab'>
                                                {template.type==="email" && (
                                                    <MDBBadge color="primary" pill>
                                                    {template.type}
                                                    </MDBBadge>
                                                )} 
                                                {template.type==="sms" && (
                                                    <MDBBadge color="info" pill>
                                                    {template.type}
                                                    </MDBBadge>
                                                )} {template.type==="push" && (
                                                    <MDBBadge color="warning" pill>
                                                    {template.type}
                                                    </MDBBadge>
                                                )} 
                                              </td>
                                              <td className='tab'>{template?.subject || template?.templateBody?.subject || ""}</td>
                                              <td>
                                                  <Tooltip title="View" >
                                                      <Button onClick={()=>viewDetails(template)} className="color_white">
                                                        <Pageview style={{color:"whitesmoke"}} />
                                                      </Button>
                                                  </Tooltip>
                                              </td>
                                          </tr>
                                                                                ))}
                                      </MDBTableBody>
                                  </MDBTable>
                              </MDBCardBody>
                              <MDBBtn className='w-100 mb-4 color_blue' onClick={() => {setUserDescription(""); setMatchedTemplates([]); setOpen(false) }}>Go back</MDBBtn>
                          </MDBCard>
                      
                  </div>
              )}
          </div>
      </>
  );
};export default SearchAI

