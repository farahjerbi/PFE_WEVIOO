import { MDBBadge, MDBBtn, MDBCard, MDBCardBody, MDBCardImage, MDBCol, MDBModal, MDBModalBody, MDBModalContent, MDBModalDialog, MDBModalFooter, MDBModalHeader, MDBModalTitle, MDBPagination, MDBPaginationItem, MDBPaginationLink, MDBRow, MDBTable, MDBTableBody, MDBTableHead, MDBTextArea } from 'mdb-react-ui-kit'
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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4; 
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = templates.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (page:any) => {
    setCurrentPage(page);
  };


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
       <MDBRow className='mt-5 pt-5'>
          <MDBCol md="9" className="list_container mb-4 d-flex align-items-center">
          <MDBCardImage src="../assets/listEmails.gif" position="top" fluid className="size_imgg" />
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
                      {currentItems.map(template => (
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
                  <nav aria-label='Page navigation example'>
                    <MDBPagination circle center className='mb-2'>
                      <MDBPaginationItem disabled={currentPage === 1}>
                        <MDBPaginationLink onClick={() => handlePageChange(currentPage - 1)}>Previous</MDBPaginationLink>
                      </MDBPaginationItem>
                      {Array.from({ length: Math.ceil(templates.length / itemsPerPage) }, (_, i) => (
                        <MDBPaginationItem key={i} active={i + 1 === currentPage}>
                          <MDBPaginationLink onClick={() => handlePageChange(i + 1)}>{i + 1}</MDBPaginationLink>
                        </MDBPaginationItem>
                      ))}
                      <MDBPaginationItem disabled={currentPage === Math.ceil(templates.length / itemsPerPage)}>
                        <MDBPaginationLink onClick={() => handlePageChange(currentPage + 1)}>Next</MDBPaginationLink>
                      </MDBPaginationItem>
                    </MDBPagination>
                  </nav>
              </MDBCard>
          </MDBCol>
          { templateDesign && (
                <div className='view d-flex flex-column align-items-center'>
                  <MDBBtn className='mb-2' onClick={()=>setTemplateDesign(null)}>Close Preview From here</MDBBtn>
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
                <MDBTextArea disabled value={selectedTemplate.templateBody.content} />
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