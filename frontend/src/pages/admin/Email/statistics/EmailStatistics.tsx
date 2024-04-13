import React, { useEffect, useState } from 'react'
import { useGetAllEmailTemplatesMutation } from '../../../../redux/services/emailApi';
import { EmailTemplate } from '../../../../models/EmailTemplate';
import { toast } from 'sonner';
import { MDBCard, MDBCardBody, MDBCardTitle, MDBRow } from 'mdb-react-ui-kit';
import BreadcrumSection from '../../../../components/BreadcrumSection/BreadcrumSection';
import { PieChart } from '@mui/x-charts/PieChart';

const EmailStatistics = () => {
    const[getAllEmailTemplates]=useGetAllEmailTemplatesMutation();
    const [templates, setTemplates] = useState<EmailTemplate[]>([]);
    const [numberOfTemplates, setNumberOfTemplates] = useState<number>(0);
    const [numberOfSimpleTemplate, setNumberOfSimpleTemplate] = useState<number>(0);
    const [numberOfComplexTemplate, setNumberOfComplexTemplate] = useState<number>(0);
    useEffect(() => {
        fetchData(); 
      }, []);
    
      const fetchData = async () => {
        try {
          const response = await getAllEmailTemplates({}).unwrap();
          console.log("🚀 ~ fetchData ~ response:", response)
          setTemplates(response); 
          setNumberOfTemplates(response.length);

          const complex = response.filter((email: EmailTemplate) => email.state === "COMPLEX");
          const simple = response.filter((email: EmailTemplate) => email.state === "SIMPLE");

          setNumberOfComplexTemplate(complex.length)
          setNumberOfSimpleTemplate(simple.length)

          console.error("🚀 ~ error:", templates);
        } catch (error) {
          toast.error("Error! Yikes");
          console.error("🚀 ~ error:", error);
        }
      };

      const data = [
        {id:0, label: 'Advanced Template', value: numberOfComplexTemplate, color:"#6873C8"},
        {id:1, label: 'Simple Template', value: numberOfSimpleTemplate },
      ];


  return (
   <MDBCard className="mb-3 mt-5">
    <MDBCardBody>
    <MDBCardTitle>Statistics</MDBCardTitle>
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