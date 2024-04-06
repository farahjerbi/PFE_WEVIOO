import {
  MDBBadge,
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBCol,
  MDBContainer,
  MDBModal,
  MDBModalBody,
  MDBModalContent,
  MDBModalDialog,
  MDBModalFooter,
  MDBModalHeader,
  MDBPagination,
  MDBPaginationItem,
  MDBPaginationLink,
  MDBRow,
  MDBTable,
  MDBTableBody,
  MDBTableHead,
  MDBTextArea,
} from "mdb-react-ui-kit";
import "./ListEmails.css";
import { useEffect, useRef, useState } from "react";
import {
  useDeleteTemplateMutation,
  useGetAllEmailTemplatesMutation,
  useGetDesignTemplateMutation,
} from "../../../../redux/services/emailApi";
import { toast } from "sonner";
import { EmailTemplate } from "../../../../models/EmailTemplate";
import BreadcrumSection from "../../../../components/BreadcrumSection/BreadcrumSection";
import EmailEditor, { EmailEditorProps, EditorRef } from "react-email-editor";
import { useNavigate } from "react-router-dom";
import Update from '@mui/icons-material/Update';
import Delete from '@mui/icons-material/Delete';
import { Button, Tooltip } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import Send from "@mui/icons-material/Send";
import ScheduleSend from "@mui/icons-material/ScheduleSend";
import Subject from "@mui/icons-material/Subject";
import AlternateEmail from "@mui/icons-material/AlternateEmail";
import Image from "@mui/icons-material/Image";


import { Role } from "../../../../models/Role";
import { selectRole } from "../../../../redux/state/authSlice";
import { useSelector } from "react-redux";
import { EDIT_EMAIL_TEMPLATE, SEND_EMAIL, SEND_EMAIL_SCHEDULED } from "../../../../routes/paths";


const ListEmails = () => {
  const emailEditorRef = useRef<EditorRef | null>(null);
  const [getAllEmailTemplates] = useGetAllEmailTemplatesMutation();
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [basicModal, setBasicModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate>();
  const [templateDesign, setTemplateDesign] = useState<any>();
  const [getDesignTemplate] = useGetDesignTemplateMutation();
  const [deleteTemplate] = useDeleteTemplateMutation();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = templates.slice(indexOfFirstItem, indexOfLastItem);
  const [update, setUpdate] = useState<boolean>(false);
  const navigate = useNavigate();
  const role = useSelector(selectRole);
  const[query,setQuery]=useState<string>('')


  const handlePageChange = (page: any) => {
    setCurrentPage(page);
  };

  const toggleOpen = () => setBasicModal(!basicModal);

  useEffect(() => {
    fetchData();
  }, [update]);

  const fetchData = async () => {
    try {
      const response = await getAllEmailTemplates({}).unwrap();
      console.log("🚀 ~ fetchData ~ response:", response);
      setTemplates(response);
      console.error("🚀 ~ error:", templates);
    } catch (error) {
      toast.error("Error! Yikes");
      console.error("🚀 ~ error:", error);
    }
  };

  const handleView = async (template: EmailTemplate) => {
    setSelectedTemplate(template);
    if (template.state === "SIMPLE") {
      setBasicModal(!basicModal);
    }
    if (template.state === "COMPLEX") {
      setBasicModal(false);
      if (template.id !== undefined) {
        const design = await getDesignTemplate(template.id).unwrap();
        setTemplateDesign(design);
      }
    }
  };

  const onLoad: EmailEditorProps["onLoad"] = (unlayer) => {
    console.log("onLoad", unlayer);
    unlayer.loadDesign(templateDesign);
    unlayer?.showPreview("desktop");
  };

  const handleDelete = async (id: number | undefined) => {
    try {
      if (id !== undefined) {
        const response = await deleteTemplate(id);
        toast.success("Template Deleted Successfully");
        setUpdate(!update);
      }
    } catch (error) {
      toast.error("Error! Yikes");
      console.error("🚀 ~ error:", error);
    }
  };

  return (
    <div>
      <BreadcrumSection />
      <MDBRow className="mt-5 pt-5">
      <MDBContainer className="mt-5 d-flex" style={{marginLeft:"17%",width:"70%"}}  >
          <img src="../../../assets/search .png" alt="search" style={{width:"3%"}} />
            <input
              type="text"
              className="search-hover"
              placeholder="Search here..."
              onChange={(e) => setQuery(e.target.value)}
              />
              
              <Button  onClick={()=>setQuery("")} size="small"  >
              <img src="../../../assets/users-search.png" alt="" style={{width:"5%",borderRadius:"9px",marginRight:"2%"}}/>
                  All Templates
              </Button>      
              <Button  onClick={()=>setQuery("SIMPLE")} size="small"  >
              <img  src="../../../assets/add-friend.png" alt="" style={{width:"5%",marginRight:"2%"}}  /> Simple Templates
              </Button>
              <Button onClick={()=>setQuery("COMPLEX")} size="small"  >
              <img  src="../../../assets/unfollow.png" alt="" style={{width:"5%"}} /> Advanced Templates
              </Button>
             

          </MDBContainer>
        <MDBCol
          md="10"
          className="list_container mb-4 d-flex align-items-center"
        >
        {role===Role.ADMIN && (<MDBCardImage src="../assets/emais.jpg" position="top" fluid className="size_imgg" />)}  
          <MDBCard>
            <MDBCardBody>
              <MDBTable striped hover bordered>
                <MDBTableHead color="blue lighten-4">
                  <tr>
                    <th>Name</th>
                    <th>Language</th>
                    <th>State</th>
                    {role===Role.ADMIN && ( <th> View / Update / Delete </th>)}
                    {role===Role.USER && ( <th> View </th>)}
                    {role===Role.USER && 
                    (<>
                    <th> Send Immediatly </th>
                    <th> Schedule </th>
                    </>)}

                  </tr>
                </MDBTableHead>
                <MDBTableBody>
                  {currentItems.filter(
          (template)=>template.name.toLowerCase().includes(query) ||
          template.state?.toString()===query).map((template) => (
                    <tr key={template.id}>
                      <td>{template.name}</td>
                      <td>{template.language}</td>
                     
                         {template.state === "SIMPLE" && (
                        <td>
                          <MDBBadge color="info" pill>
                            {template.state}
                          </MDBBadge>
                        </td>
                      )}
                      {template.state === "COMPLEX" && (
                        <td>
                          <MDBBadge color="primary" pill>
                            Advanced
                          </MDBBadge>
                        </td>
                      )}
                      
                
                      <td>
                        <div className="buttons">

                          <Tooltip style={{marginRight:"5px"}} title="View" className="color_purple" >
                          <Button onClick={() => handleView(template)}>
                          <Visibility style={{color:"whitesmoke"}}  />
                          </Button>                           
                          </Tooltip>
                        {role===Role.ADMIN && (
                          <>
                              <Tooltip style={{marginRight:"5px"}}  title="Update" className="color_orange" >
                          <Button onClick={() =>
                              navigate(`${EDIT_EMAIL_TEMPLATE}/${template.id}`)
                            } >
                          <Update style={{color:"whitesmoke"}}  />
                          </Button>                           
                          </Tooltip>

                          <Tooltip title="Delete" className="color_red" >
                          <Button  onClick={() => handleDelete(template.id)}>
                          <Delete style={{color:"whitesmoke"}}  />
                          </Button>                           
                          </Tooltip>

                          </>
                        )}
                      
                        </div>
                      </td>
                      {role===Role.USER && (
                        <>
                         <td>
                        <Tooltip style={{marginRight:"5px"}} title="Send" className="color_blue" >
                          <Button     onClick={() =>
                            navigate(`${SEND_EMAIL}/${template.id}`)
                          }>
                          <Send style={{color:"whitesmoke"}}  />
                          </Button>                           
                          </Tooltip>
                      </td>
                      <td>
                        <Tooltip style={{marginRight:"5px"}} title="ScheduleSend" className="color_green" >
                          <Button   onClick={() =>
                             navigate(`${SEND_EMAIL_SCHEDULED}/${template.id}`)     
                                                  }>
                          <ScheduleSend style={{color:"whitesmoke"}}  />
                          </Button>                           
                          </Tooltip>
                      </td>
                        </>
                      )}
                     
                    </tr>
                  ))}
                </MDBTableBody>
              </MDBTable>
            </MDBCardBody>
            <nav aria-label="Page navigation example">
              <MDBPagination circle center className="mb-2">
                <MDBPaginationItem disabled={currentPage === 1}>
                  <MDBPaginationLink
                    onClick={() => handlePageChange(currentPage - 1)}
                  >
                    Previous
                  </MDBPaginationLink>
                </MDBPaginationItem>
                {Array.from(
                  { length: Math.ceil(templates.length / itemsPerPage) },
                  (_, i) => (
                    <MDBPaginationItem key={i} active={i + 1 === currentPage}>
                      <MDBPaginationLink
                        onClick={() => handlePageChange(i + 1)}
                      >
                        {i + 1}
                      </MDBPaginationLink>
                    </MDBPaginationItem>
                  )
                )}
                <MDBPaginationItem
                  disabled={
                    currentPage === Math.ceil(templates.length / itemsPerPage)
                  }
                >
                  <MDBPaginationLink
                    onClick={() => handlePageChange(currentPage + 1)}
                  >
                    Next
                  </MDBPaginationLink>
                </MDBPaginationItem>
              </MDBPagination>
            </nav>
          </MDBCard>
        </MDBCol>
        {templateDesign && (
          <div className="view d-flex flex-column align-items-center">
            <MDBBtn className="mb-2" onClick={() => setTemplateDesign(null)}>
              Close Preview From here
            </MDBBtn>
            <EmailEditor
              ref={emailEditorRef}
              onLoad={onLoad}
              minHeight={"71vh"}
              options={{
                features: {
                
                },
                options: {
                  close: () => console.log("closed")
                }
              }}
            />
          </div>
        )}
      </MDBRow>
      <MDBModal open={basicModal} setOpen={setBasicModal} tabIndex="-1">
        <MDBModalDialog >
          <MDBModalContent>
            <MDBModalHeader>
              <MDBBtn
                className="btn-close"
                color="none"
                onClick={toggleOpen}
              ></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody>
              {selectedTemplate && (
                <div style={{border: "1px solid black", boxShadow: "0px 2px 5px rgba(0, 0, 1, 0.1)" }}>
            <div style={{ border: "1px solid black", padding: "5px", maxHeight: "30px"}} className="d-flex justify-content-between color_blue">
              <b style={{ fontSize: "13px" ,color:"snow" }}>Name Template:</b>
              <p style={{ fontSize: "13px",color:"snow"  }}>{selectedTemplate.name}</p>
            </div>

            <div style={{ border: "1px solid black", padding: "5px", maxHeight: "30px" }} className="d-flex justify-content-between ">
              <b style={{ fontSize: "13px" }}> Subject :</b>
              <p style={{ fontSize: "13px" }}>{selectedTemplate.templateBody.subject}</p>
            </div>

            <div style={{ border: "1px solid black", padding: "5px", minHeight: "300px" }} className="d-flex justify-content-between position-relative">
              <p className="mt-2" style={{ fontSize: "13px" }}>{selectedTemplate.templateBody.content}</p>
              <div style={{ position: "absolute", bottom: "3%", left: "4%" }}>
                <b style={{ marginRight: "3px" }}>B</b>
                <i style={{ marginRight: "5px" }}>I</i>
                <u>U</u>

              </div>
              <div style={{ position: "absolute", bottom: "3%", right: "4%" }}>
                  <Subject style={{ marginRight: "3px" ,fontSize:"16px"}}/>
                  <AlternateEmail style={{fontSize:"16px"}}/>
                  <Image style={{ marginLeft: "3px" ,fontSize:"16px"}}/>

                </div>
            </div>

                    
              
                </div>
              
              )}
            </MDBModalBody>
            <MDBModalFooter>
              <MDBBtn color="secondary" onClick={toggleOpen}>
                Close
              </MDBBtn>
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    </div>
  );
};

export default ListEmails;
