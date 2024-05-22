import AspectRatio from '@mui/joy/AspectRatio';
import Link from '@mui/joy/Link';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import Typography from '@mui/joy/Typography';
import { MDBCard, MDBCardBody, MDBCardFooter, MDBCol, MDBContainer, MDBPagination, MDBPaginationItem, MDBPaginationLink, MDBRow } from 'mdb-react-ui-kit';
import { useDispatch, useSelector } from 'react-redux';
import { selectRole, selectUser } from '../../../../redux/state/authSlice';
import { Button, Tooltip } from '@mui/material';
import Delete from '@mui/icons-material/Delete';
import Update from '@mui/icons-material/Update';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { WebPushTemplate } from '../../../../models/push/WebPushTemplate';
import { getTemplatesPush, selectPush, selectPushs, setSelectedPush } from '../../../../redux/state/pushSlice';
import { AppDispatch } from '../../../../redux/store';
import UpdatePush from '../update/UpdatePush';
import DeletePushTemplate from '../../../../components/modals/DeletePushTemplate';
interface Props{
    query:string
    }
const ListPush  : React.FC<Props> = ({query }) => {
    const user=useSelector(selectUser)
    const role=useSelector(selectRole)
    const templates=useSelector(selectPushs)
    const dispatch=useDispatch()
    const dispatchAction: AppDispatch = useDispatch(); 
    const navigate=useNavigate()
    const [idDelete,setIdDelete]=useState<number>()
    const [deleteModalOpen,setDeleteModalOpen]=useState<boolean>(false)
    const [updateModalOpen,setUpdateModalOpen]=useState<boolean>(false)
    const [selectedTemplate,setSelectedTemplate]=useState<WebPushTemplate>()

           /*Pagination*/
           const [currentPage, setCurrentPage] = useState(1);
           const itemsPerPage = 6;
           const indexOfLastItem = currentPage * itemsPerPage;
           const indexOfFirstItem = indexOfLastItem - itemsPerPage;
           const currentItems = templates?.slice(indexOfFirstItem, indexOfLastItem);
           const handlePageChange = (page: any) => {
               setCurrentPage(page);
             };
             useEffect(() => {
                dispatchAction(getTemplatesPush());
                },[]);

  return (
    <>
          <MDBRow >
          {currentItems?.filter(
    (template:WebPushTemplate)=>template.title.toLowerCase().includes(query)).map((template:WebPushTemplate) => (
        <MDBCol  key={template.id} xl="3" md={6}  className="mb-r me-4 mt-4 ms-5 " >
            <MDBCard  style={{minWidth:"400px"}} >
        <MDBCardBody>
        <Card
    variant="outlined"
    orientation="horizontal"
    sx={{
      width: 320,
      '&:hover': { boxShadow: 'md', borderColor: 'neutral.outlinedHoverBorder' },
    }}
  >
    <AspectRatio ratio="1" sx={{ width: 90 }}>
      <img
        src={`http://localhost:8093/uploadsPush/${template.icon}`}
        loading="lazy"
        alt=""
      />
    </AspectRatio>
    <CardContent>
      <Typography level="title-lg" id="card-description">
      <div className='mt-2'>  {template.title}</div>
      </Typography>
      <Typography level="body-sm" aria-describedby="card-description" mb={1}>
        <Link
          overlay
          underline="none"
          sx={{ color: 'text.tertiary' }}
        >
            <div className='mt-2'> {template.message}</div>
        </Link>
      </Typography>
    </CardContent>
  </Card>
        </MDBCardBody>
        <MDBCardFooter>
        {/* {role===Role.ADMIN && ( */}
                          <div className='d-flex justify-content-sm-around'>
                              <Tooltip  title="Update" className="color_white" >
                          <Button onClick={() =>
                          {
                              setSelectedTemplate(template);
                              setUpdateModalOpen(true)
                            }}>
                          <Update style={{color:"whitesmoke"}}  />
                          </Button>                           
                          </Tooltip>

                          <Tooltip title="Delete" className="color_pink" >
                          <Button onClick={() => { setDeleteModalOpen(true); setIdDelete(template.id)}}>
                          <Delete style={{color:"whitesmoke"}}  />
                          </Button>                           
                          </Tooltip>

                          </div>
                        {/* )} */}
        </MDBCardFooter>
    </MDBCard>
    </MDBCol>
))}
</MDBRow>
    <nav className='mt-4' aria-label="Page navigation example">
  <MDBPagination circle center className="mb-2">
    <MDBPaginationItem disabled={currentPage === 1}>
      <MDBPaginationLink
        onClick={() => handlePageChange(currentPage - 1)}
      >
        Previous
      </MDBPaginationLink>
    </MDBPaginationItem>
    {Array.from(
      { length: Math.ceil(2 / itemsPerPage) },
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
        currentPage === Math.ceil(2 / itemsPerPage)
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
{selectedTemplate && (
  <UpdatePush show={updateModalOpen} onClose={()=>{setUpdateModalOpen(!updateModalOpen);setSelectedTemplate(undefined)}} template={selectedTemplate} />

)}
{idDelete && (
  <DeletePushTemplate id={idDelete} show={deleteModalOpen} onClose={()=>{setDeleteModalOpen(!deleteModalOpen);setIdDelete(undefined)}} />
)}

    </>


  )
}

export default ListPush