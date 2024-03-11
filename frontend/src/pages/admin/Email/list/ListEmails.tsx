import { MDBBadge, MDBBtn, MDBCard, MDBCardBody, MDBCol, MDBModal, MDBModalBody, MDBModalContent, MDBModalDialog, MDBModalFooter, MDBModalHeader, MDBModalTitle, MDBRow, MDBTable, MDBTableBody, MDBTableHead } from 'mdb-react-ui-kit'
import './ListEmails.css'
import { useEffect, useRef, useState } from 'react'
import { useDeleteTemplateMutation, useGetAllEmailTemplatesMutation, useGetDesignTemplateMutation } from '../../../../redux/services/emailApi';
import { toast } from 'sonner';
import { EmailTemplate } from '../../../../models/EmailTemplate'
import BreadcrumSection from '../../../../components/BreadcrumSection/BreadcrumSection';
import EmailEditor ,{EmailEditorProps,EditorRef} from 'react-email-editor';
const ListEmails = () => {
  const emailEditorRef = useRef<EditorRef|null>(null); 
  const[getAllEmailTemplates]=useGetAllEmailTemplatesMutation();
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [basicModal, setBasicModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate>(); 
  const [templateDesign,setTemplateDesign]= useState<any>();
  const[getDesignTemplate]=useGetDesignTemplateMutation();
  const[deleteTemplate]=useDeleteTemplateMutation();


  const toggleOpen = () => setBasicModal(!basicModal);

  useEffect(() => {
    fetchData(); 
  }, []);

  const fetchData = async () => {
    try {
      const response = await getAllEmailTemplates({}).unwrap();
      console.log("🚀 ~ fetchData ~ response:", response)
      setTemplates(response); 
      console.error("🚀 ~ error:", templates);
    } catch (error) {
      toast.error("Error! Yikes");
      console.error("🚀 ~ error:", error);
    }
  };

  const handleView=async (template:EmailTemplate)=>{
    setSelectedTemplate(template)
    if(template.state ==="SIMPLE"){
      setBasicModal(!basicModal)
    }
    if(template.state ==="COMPLEX"){
      setBasicModal(false)
      if (template.id !== undefined) {
        const design = await getDesignTemplate(template.id).unwrap();
        setTemplateDesign(design);
      }
    }
  }

  const onLoad: EmailEditorProps['onLoad'] = (unlayer) => {
    console.log('onLoad', unlayer);
    unlayer.loadDesign(templateDesign);
    unlayer?.showPreview('desktop');
  };


  const handleDelete = async (id: number | undefined) => {
    try {
    if (id !== undefined) {
      const response= await deleteTemplate(id);
      toast.success("Template Deleted Successfully");
    }}catch(error){
      toast.error("Error! Yikes");
      console.error("🚀 ~ error:", error);    }
}
  
  return (
    <div>
       <BreadcrumSection />
       <MDBRow>
          <MDBCol md="9" className="list_container mb-4">
              <MDBCard>
                  <MDBCardBody>
                    <MDBTable striped hover bordered >
                      <MDBTableHead color="blue lighten-4">
                        <tr>
                          <th>#id</th>
                          <th>Name</th>
                          <th>Language</th>
                          <th>State</th>
                          <th> View / Update / Delete </th>
                        </tr>
                      </MDBTableHead>
                      <MDBTableBody>
                      {templates.map(template => (
                        <tr key={template.id}>
                          <td>{template.id}</td>
                          <td>{template.name}</td>
                          <td>{template.language}</td>
                            {template.state==="SIMPLE" && (
                                   <td>
                                   <MDBBadge color='primary' pill>
                                     {template.state}
                                 </MDBBadge>
                                 </td>
                            )}
                               {template.state==="COMPLEX" && (
                                   <td>
                                   <MDBBadge color='danger' pill>
                                     {template.state}
                                 </MDBBadge>
                                 </td>
                            )}
                          <td>
                            <div className='buttons'>
                            <MDBBtn className='btn' color='info' onClick={()=>handleView(template)} >View </MDBBtn> 
                            <MDBBtn className='btn' color='warning'  >Update </MDBBtn> 
                            <MDBBtn className='btn' color='danger' onClick={()=>handleDelete(template.id)} >Delete </MDBBtn>
                            </div>
                           </td>
                        </tr>
                      ))}
                      </MDBTableBody>
                    </MDBTable>
                  </MDBCardBody>
              </MDBCard>
          </MDBCol>
          { templateDesign && (
                <div className='view'>
                     <EmailEditor
                      ref={emailEditorRef}
                      onLoad={onLoad}
                      minHeight={"71vh"}
                                          />
                    
                </div>
              )}
      </MDBRow>
      <MDBModal open={basicModal} setOpen={setBasicModal} tabIndex='-1'>
        <MDBModalDialog>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>Template View</MDBModalTitle>
              <MDBBtn className='btn-close' color='none' onClick={toggleOpen}></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody> 
            {selectedTemplate && (
              <div className="d-grid gap-2">
                <p> <strong>Subject:</strong> {selectedTemplate.templateBody.subject}</p>
                  <p> <strong>Body:</strong> {selectedTemplate.templateBody.content}</p>
                </div>
              )}
            </MDBModalBody>
            <MDBModalFooter>
              <MDBBtn color='secondary' onClick={toggleOpen}>
                Close
              </MDBBtn>
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal> 
    </div>

      
  )
}

export default ListEmails