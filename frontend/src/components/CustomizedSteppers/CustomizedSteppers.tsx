import * as React from 'react';
import { styled } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';import SettingsIcon from '@mui/icons-material/Settings';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import VideoLabelIcon from '@mui/icons-material/VideoLabel';
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';
import { StepIconProps } from '@mui/material/StepIcon';
import { Box, Button, DialogContent, DialogTitle, Modal, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { MDBBtn, MDBCard, MDBCardBody, MDBIcon, MDBSpinner } from 'mdb-react-ui-kit';
import { useDispatch, useSelector } from 'react-redux';
import ModalDialog from '@mui/joy/ModalDialog';
import { WebPushTemplate } from '../../models/push/WebPushTemplate';
import PushSettings from './PushSettings';
import WebSubscriptionInput from './WebSubscriptionInput';
import { WebPushSubscription } from '../../models/push/WebPushSubscription';
import { DateTimePicker, LocalizationProvider, PickersTimezone } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { selectRole, selectUser } from '../../redux/state/authSlice';
import { SchedulePushRequest } from '../../models/push/SchedulePushRequest';
import { Role } from '../../models/user/Role';
import axios from 'axios';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('America/New_York');

const TIMEZONES: PickersTimezone[] = ['default', 'UTC',  'Europe/London','Africa/Tunis'];
const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)',
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)',
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor:
      theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',
    borderRadius: 1,
  },
}));

const ColorlibStepIconRoot = styled('div')<{
  ownerState: { completed?: boolean; active?: boolean };
}>(({ theme, ownerState }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#ccc',
  zIndex: 1,
  color: '#fff',
  width: 50,
  height: 50,
  display: 'flex',
  borderRadius: '50%',
  justifyContent: 'center',
  alignItems: 'center',
  ...(ownerState.active && {
    backgroundImage:
      'linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)',
    boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
  }),
  ...(ownerState.completed && {
    backgroundImage:
      'linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)',
  }),
}));

function ColorlibStepIcon(props: StepIconProps) {
  const { active, completed, className } = props;

  const icons: { [index: string]: React.ReactElement } = {
    1: <SettingsIcon />,
    2: <GroupAddIcon />,
    3: <VideoLabelIcon />,
  };

  return (
    <ColorlibStepIconRoot ownerState={{ completed, active }} className={className}>
      {icons[String(props.icon)]}
    </ColorlibStepIconRoot>
  );
}
interface Props {
    template: WebPushTemplate;
    onClose: () => void;
    show:boolean;
  }

const steps = ['Select Placeholders', 'Create an ad group', 'Send Push Notification'];
const CustomizedSteppers : React.FC<Props> = ({ template , onClose ,show }) => {
    const [open,setOpen]=React.useState<boolean>(show);
    const [value, setValue] = React.useState<any | null>(dayjs());
    const [currentTimezone, setCurrentTimezone] = React.useState<string>('UTC');
    const [isSchedule,setIsSchedule]=React.useState<boolean>(false);
    const [loading,setLoading]=React.useState<boolean>(false);
    const [subscriptions, setSubscriptions] = React.useState<WebPushSubscription[]>([{ notificationEndPoint: '', publicKey: '', auth: '' }]);
    const [placeholdersValues, setPlaceholdersValues] = React.useState<{ [key: string]: string }>({});
    const navigate=useNavigate()
    const user=useSelector(selectUser)
    const role=useSelector(selectRole)
    const dispatch=useDispatch();
      React.useEffect(() => {
        setOpen(show);
    }, [show]);
    const toggleOpen = () =>{
        onClose();
        setOpen(false);
      } 
        const [activeStep, setActiveStep] = React.useState<number>(0);
        const getStepIcon = (index: number) => {
            switch (index) {
              case 0:
                return <SettingsIcon />;
              case 1:
                return <GroupAddIcon />;
              case 2:
                return <VideoLabelIcon />;
              default:
                return null;
            }
          };
        
        const handleNext = () => {
          setActiveStep((prevActiveStep) => prevActiveStep + 1);
        };
      
        const handleBack = () => {
          setActiveStep((prevActiveStep) => prevActiveStep - 1);
        };

        const handleSubmitSchedule: () => void = async (
        ) => {
          setLoading(true);
          if(user && user.id){
            const whatsappSend:SchedulePushRequest={
                templateId:Number(template?.id),
                webPushSubscriptions:subscriptions,
                placeholders:placeholdersValues,
                dateTime: value.format("YYYY-MM-DDTHH:mm:ss"),
                timeZone: currentTimezone,
                userId:user.id,
                name:template?.title,
                isAdmin:role===Role.ADMIN
              }
          
          try {
            const response = await axios.post(`http://localhost:8099/apiPush/schedulePush`,whatsappSend);
            if (response.status === 200) {
              toast.success("Push notification scheduled successfully !");
            }
          } catch (err) {
            toast.error('Error!')
            console.error("Error updating user:", err);
          }
          finally {
              setLoading(false); 
              toggleOpen();
          }
    
        }
        }

        const handleSubmit: () => void = async (
        ) => {
          setLoading(true);
          if(user && user.id){
            const pushSend={
                webPushSubscriptions:subscriptions,
                placeholderValues:placeholdersValues,
                webPushMessageTemplate:template
              }
          
          try {
            const response = await axios.post(`http://localhost:8099/apiPush/notify`,pushSend);
            if (response.status === 200) {
              toast.success("Push notification sent successfully !");
            }
          } catch (err) {
            toast.error('Error!')
            console.error("Error updating user:", err);
          }
          finally {
              setLoading(false); 
              toggleOpen();
          }
    
        }
        }
  return (
    <div>
    <Modal open={open} onClose={toggleOpen}>
   <ModalDialog>
     <DialogTitle>Send Push Template</DialogTitle>
     <DialogContent>
    <Stack sx={{ width: '100%' }} spacing={4}>
    <Stepper activeStep={activeStep} alternativeLabel connector={<ColorlibConnector />}>
                {steps.map((label, index) => (
                  <Step key={label}>
                    <StepLabel StepIconComponent={ColorlibStepIcon} icon={getStepIcon(index)}>
                      {label}
                    </StepLabel>
                  </Step>
                ))}
              </Stepper>
   
  </Stack>    
  {activeStep === 0 && (<PushSettings onChange={setPlaceholdersValues}/>)}
            {activeStep === 1  && (<WebSubscriptionInput onChange={setSubscriptions} />)}
            {activeStep === 2  && (<div className='mt-5 d-flex '>
              <MDBCard className='ms-4'>
                
                  {!isSchedule && !loading &&
                  (<MDBCardBody>
                   <MDBBtn className='btn w-40 me-5 color_pink' type='submit' onClick={handleSubmit}> 
                  <MDBIcon  icon="envelope" style={{marginRight:"5px"}} /> Send now </MDBBtn>  
                  <MDBBtn className='btn w-40 ms-5 ' color='danger' onClick={()=>setIsSchedule(true)} > 
                  <MDBIcon  icon="envelope" style={{marginRight:"5px"}}  /> Schedule  </MDBBtn>  
                  </MDBCardBody>
                )}
                     {loading && (
                    <MDBBtn disabled className='btn w-100 ' >
                    <MDBSpinner size='sm' role='status' tag='span' className='me-2' />
                        Loading...
                    </MDBBtn>

                )}
                
              </MDBCard>
              {isSchedule && !loading && (
                <div className='d-flex flex-column ms-4'>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <ToggleButtonGroup
                          value={currentTimezone}
                          exclusive
                          fullWidth
                          onChange={(event, newTimezone) => {
                            if (newTimezone != null) {
                              setCurrentTimezone(newTimezone);
                            }
                          }}
                        >
                          {TIMEZONES.map((timezoneName) => (
                            <ToggleButton key={timezoneName} value={timezoneName}>
                              {timezoneName}
                            </ToggleButton>
                          ))}
                        </ToggleButtonGroup>
                        <DateTimePicker
                        className='mt-4'
                          timezone={currentTimezone}
                          value={value}
                          onChange={setValue}
                        />
                        </LocalizationProvider>
                        <MDBBtn className='btn w-40 ms-3 mt-4' color='danger' onClick={handleSubmitSchedule} > 
                  <MDBIcon  icon="envelope" style={{marginRight:"5px"}}   /> Schedule  </MDBBtn>  
                </div>
              )}
         
            </div>)}
   </DialogContent>
     <div className='d-felx'>
     <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
        <MDBBtn className='w-40 ms-1 me-4' color='secondary' onClick={toggleOpen}>
        Never mind ...
        </MDBBtn>
        <MDBBtn color='light' disabled={activeStep === 0} onClick={handleBack}>
          <MDBIcon  icon="angles-left" style={{marginRight:"5px"}} />     Back
        </MDBBtn>
        {activeStep < steps.length -1 && (
          <MDBBtn className='color_white'  onClick={handleNext}>
            {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
        </MDBBtn>
        )}
        </Box>
     </div> 
   </ModalDialog>
 </Modal>
</div>
    )
}

export default CustomizedSteppers