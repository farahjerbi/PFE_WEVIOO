import React, { useEffect, useState } from 'react'
import { useGetAllEmailTemplatesMutation } from '../../../../redux/services/emailApi';
import { EmailTemplate } from '../../../../models/EmailTemplate';
import { toast } from 'sonner';
import { Pie } from '@ant-design/plots';
import { MDBRow } from 'mdb-react-ui-kit';
import BreadcrumSection from '../../../../components/BreadcrumSection/BreadcrumSection';

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
        { type: 'Complex Template', value: numberOfComplexTemplate },
        { type: 'Simple Template', value: numberOfSimpleTemplate },
      ];

      const config = {
        data,
        angleField: 'value',
        colorField: 'type',
        radius: 0.8,
        label: {
          text: (d:any) => `${d.type}\n ${d.value}`,
          position: 'spider',
        },
        legend: {
          color: {
            title: false,
            position: 'right',
            rowPadding: 5,
          },
        },
      }
  return (
    <div>
   <MDBRow className="mb-3 mt-5">
        <BreadcrumSection/>
        <Pie {...config} />
    </MDBRow>
    </div>
 
      )
}

export default EmailStatistics