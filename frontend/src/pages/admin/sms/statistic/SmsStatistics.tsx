import { MDBCard, MDBCardBody, MDBCardTitle } from 'mdb-react-ui-kit';
import { PieChart } from '@mui/x-charts/PieChart';
import { useSelector } from 'react-redux';
import { selectSMSs, selectWhatsapp } from '../../../../redux/state/smsSlice';

const SmsStatistics = () => {
        const templates=useSelector(selectSMSs)
        const templatesWhatsapp=useSelector(selectWhatsapp)

          
      const data = [
        {id:0, label: 'SMS Template', value: templates?.length??0, color:"rgb(210, 114, 167)"},
        {id:1, label: 'Whatsapp Template', value: templatesWhatsapp?.length??0,color:"rgba(210, 114, 210, 1)"},
      ];


  return (
   <MDBCard className="mb-3 mt-5">
    <MDBCardBody>
    <MDBCardTitle>Statistics SMS</MDBCardTitle>
    <div style={{height:"170px"}}>
    <PieChart
      series={[
        {
          data: data ,
          innerRadius: 30,
          outerRadius: 50,
          paddingAngle: 5,
          cornerRadius: 5,
          startAngle: -90,
          endAngle: 180,
          cx: 100,
          cy: 100,
        }
      ]}
      
    />
    </div>
    
    </MDBCardBody>
    </MDBCard>
 
      )
}

export default SmsStatistics


