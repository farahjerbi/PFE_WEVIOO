import { MDBCard, MDBCardBody, MDBBreadcrumb, MDBBreadcrumbItem } from 'mdb-react-ui-kit';
import './BreadcrumSection.css'
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import FirstPage from '@mui/icons-material/FirstPage';
import { Button, Tooltip } from '@mui/material';

const BreadcrumSection = () => {
  const location = useLocation();
  const [breadcrumbs, setBreadcrumbs] = useState<{ displayName: string; path: string; }[]>([]); 
  const navigate=useNavigate()
  useEffect(() => {
    const pathname = location.pathname;
    const pathParts = pathname.split('/').filter(part => part !== ''); // Remove empty parts
    const breadcrumbItems = pathParts.map((part, index) => {
      const displayName = part.charAt(0).toUpperCase() + part.slice(1);
      const path = '/' + pathParts.slice(0, index + 1).join('/'); 
      return { displayName, path };
    });
    setBreadcrumbs(breadcrumbItems);
  }, [location.pathname]);
  return (
    <MDBCard className="breadcrum mb-5 " >
      <MDBCardBody className='d-flex ' style={{ background: "linear-gradient(-200deg, #EBEBEB 0%, #3544ED 450%)",maxHeight:"80px",position:"relative"}}>
          <MDBBreadcrumb>
          <div className='d-flex '>
          <img src="../../../assets/settings.png" alt="settings" style={{width:"4%",marginRight:"2%"}}/>
          {breadcrumbs.map((breadcrumb, index) => (
            <MDBBreadcrumbItem key={index} active={index === breadcrumbs.length - 1}>
              <Link style={{  pointerEvents:"none" }} to={breadcrumb.path}>{breadcrumb.displayName}</Link>
            </MDBBreadcrumbItem>
          ))}
          </div>
            </MDBBreadcrumb>
            <Tooltip title="Go Back"   style={{marginLeft:"60%"}}>
              <Button onClick={()=> navigate(-1)}>
            <FirstPage style={{color:"whitesmoke"}}/>
                          </Button>                           
                          </Tooltip>

            {/* <img src="../../../assets/images.png" alt="" style={{  transform: "rotate(7deg)",position: "absolute", width: "20%", right:0, height: "180%", top: "-35%" }} /> */}
    </MDBCardBody>
  </MDBCard>
  
  )
}

export default BreadcrumSection;
