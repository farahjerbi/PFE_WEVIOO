import { EmailTemplate } from '../../../../models/email/EmailTemplate';
import { MDBCard, MDBCardBody, MDBCardTitle } from 'mdb-react-ui-kit';
import { PieChart } from '@mui/x-charts/PieChart';
import { selectEmails } from '../../../../redux/state/emailSlice';
import { useSelector } from 'react-redux';

const EmailStatistics = () => {
    const templates = useSelector(selectEmails) || []
    const complex = templates?.filter((email: EmailTemplate) => email.state === "COMPLEX");
    const simple = templates?.filter((email: EmailTemplate) => email.state === "SIMPLE");
      const data = [
        {id:0, label: 'Advanced Template', value: complex.length??0, color:"#6873C8"},
        {id:1, label: 'Simple Template', value: simple.length??0 },
      ];


  return (
   <MDBCard className="mb-1 mt-5">
    <MDBCardBody>
    <MDBCardTitle>Statistics Emails</MDBCardTitle>
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

export default EmailStatistics