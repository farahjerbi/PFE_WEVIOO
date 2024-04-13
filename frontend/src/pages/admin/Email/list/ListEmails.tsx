import {
  MDBBadge,
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBCol,
  MDBContainer,
  MDBPagination,
  MDBPaginationItem,
  MDBPaginationLink,
  MDBRow,
  MDBTable,
  MDBTableBody,
  MDBTableHead,
} from "mdb-react-ui-kit";
import "./ListEmails.css";
import {  useState } from "react";
import {
  useGetDesignTemplateMutation,
  useToggleFavoriteEmailMutation,
} from "../../../../redux/services/emailApi";
import { toast } from "sonner";
import { EmailTemplate } from "../../../../models/EmailTemplate";
import BreadcrumSection from "../../../../components/BreadcrumSection/BreadcrumSection";
import { useNavigate } from "react-router-dom";
import Update from '@mui/icons-material/Update';
import Delete from '@mui/icons-material/Delete';
import { Button, Tooltip } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import Send from "@mui/icons-material/Send";
import ScheduleSend from "@mui/icons-material/ScheduleSend";
import BookmarkAddedOutlined from "@mui/icons-material/BookmarkAddedOutlined";
import BookmarkRemoveOutlined from "@mui/icons-material/BookmarkRemoveOutlined";

import { Role } from "../../../../models/Role";
import { selectRole, selectUser } from "../../../../redux/state/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { ADD_EMAIL_TEMPLATE, EDIT_EMAIL_TEMPLATE, SEND_EMAIL, SEND_EMAIL_SCHEDULED } from "../../../../routes/paths";
import DeleteTemplateModal from "../../../../components/modals/DeleteTemplateModal";
import ViewEmailTemplateSimple from "../../../../components/modals/ViewEmailTemplateSimple";
import { selectEmails, setSelectedEmail, setUpdateEmailFav } from "../../../../redux/state/emailSlice";

const ListEmails = () => {
  const [basicModal, setBasicModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate>();
  const [templateDesign, setTemplateDesign] = useState<any>();
  const [getDesignTemplate] = useGetDesignTemplateMutation();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const templates = useSelector(selectEmails);
  const currentItems = templates.slice(indexOfFirstItem, indexOfLastItem);
  const navigate = useNavigate();
  const role = useSelector(selectRole);
  const user=useSelector(selectUser)
  const[query,setQuery]=useState<string>('')
  const [idDelete, setIdDelete] = useState<number>();
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const[toggleFavoriteEmail]=useToggleFavoriteEmailMutation();
  const dispatch=useDispatch();
  const handlePageChange = (page: any) => {
    setCurrentPage(page);
  };

  const handleView = async (template: EmailTemplate) => {
    setSelectedTemplate(template);
    if (template.state === "COMPLEX") {
      if (template.id !== undefined) {
        const design = await getDesignTemplate(template.id).unwrap();
        setTemplateDesign(design);
      }
    }
    if (template.state === "SIMPLE") {
      setTemplateDesign(null);

    }
    setBasicModal(!basicModal);
  };

  const handleUpdate = () => {
    setDeleteModalOpen(false)
    setBasicModal(false)
        };

  const toggleFavoriteEmailFunc=async(template:EmailTemplate)=>{
    try{
       await toggleFavoriteEmail({idTemplate:template.id,idUser:user?.id})
       if (user) {
        const isFavorite = template.userFavoriteEmails?.includes(user.id);

        dispatch(setUpdateEmailFav({id: template.id, idUser: user.id }));

        const msg = isFavorite 
            ? "Template removed from favorites successfully" 
            : "Template added to favorites successfully";

        toast.success(msg);
    }
    }catch(error){
      toast.error("Error !!")
    }
  }


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
        {role===Role.USER && (<MDBCardImage src="../assets/send-email.jpg" position="top" fluid className="size_imgg" style={{marginLeft:"-10%"}} />)}  
        {role===Role.ADMIN && (<MDBCardImage src="../assets/calender.jpg" position="top" fluid className="size_imgg" />)}  
          <MDBCard style={{marginLeft:"-120px" , background: 'hsla(0, 0%, 100%, 0.55)',
                backdropFilter: 'blur(30px)',}} >
            <MDBCardBody>
            {role===Role.ADMIN && (  <Button onClick={()=>navigate(ADD_EMAIL_TEMPLATE)} style={{width:"20%"}} size="small" className="mb-2" >
                  <img  src="../../../assets/new-mail.png" alt="" style={{width:"22%",marginRight:"3%"}} />Add
                  </Button>)}
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
                    <th>Save</th>
                    <th> Send Immediatly </th>
                    <th> Schedule </th>
                    </>)}

                  </tr>
                </MDBTableHead>
                <MDBTableBody>
                  {currentItems.filter(
          (template:EmailTemplate)=>template.name.toLowerCase().includes(query) ||
          template.state?.toString()===query).map((template:EmailTemplate) => (
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
                              <Tooltip style={{marginRight:"5px"}}  title="Update" className="color_white" >
                          <Button onClick={() =>
                          {
                              dispatch(setSelectedEmail(template));
                              navigate(`${EDIT_EMAIL_TEMPLATE}`)
                            }}>
                          <Update style={{color:"whitesmoke"}}  />
                          </Button>                           
                          </Tooltip>

                          <Tooltip title="Delete" className="color_pink" >
                          <Button onClick={() => { setDeleteModalOpen(true); setIdDelete(template.id)}}>
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
                                  <Tooltip style={{marginRight:"5px"}} title={user && template.userFavoriteEmails?.includes(user.id) ?"Remove Template":"Save Template"} className="color_pink" >
                                    <Button  onClick={() =>toggleFavoriteEmailFunc(template)}>
                                    {user && template.userFavoriteEmails?.includes(user.id) ? (
                                    <BookmarkRemoveOutlined style={{color:"whitesmoke"}}  /> ):<BookmarkAddedOutlined style={{color:"whitesmoke"}}  /> }
                                    </Button>                           
                                    </Tooltip>
                                </td>
                      
                     
                         <td>
                        <Tooltip style={{marginRight:"5px"}} title="Send" className="color_blue" >
                          <Button     onClick={() =>
                          {
                            dispatch(setSelectedEmail(template));
                            navigate(`${SEND_EMAIL}`)
                          }
                          }>
                          <Send style={{color:"whitesmoke"}}  />
                          </Button>                           
                          </Tooltip>
                      </td>
                      <td>
                        <Tooltip style={{marginRight:"5px"}} title="ScheduleSend" className="color_baby_blue" >
                          <Button   onClick={() =>
                          {                           
                             dispatch(setSelectedEmail(template));
                             navigate(`${SEND_EMAIL_SCHEDULED}`)     
                          }
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

         {idDelete && (
              <DeleteTemplateModal  id={idDelete} show={deleteModalOpen} onClose={handleUpdate}/> )}
      </MDBRow>
      {selectedTemplate && (
              <ViewEmailTemplateSimple templateDesign={templateDesign} template={selectedTemplate} show={basicModal} onClose={handleUpdate} />
      )}

    </div>
    
  );
};

export default ListEmails;
function updateEmail(updatedTemplate: EmailTemplate): any {
  throw new Error("Function not implemented.");
}

