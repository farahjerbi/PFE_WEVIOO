import { MDBCard, MDBCardBody, MDBIcon, MDBBreadcrumb, MDBBreadcrumbItem } from 'mdb-react-ui-kit';
import './BreadcrumSection.css'
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
const BreadcrumSection = () => {
  const location = useLocation();
  const [dashboardName, setDashboardName] = useState('');
  const [breadcrumbs, setBreadcrumbs] = useState<{ displayName: string; path: string; }[]>([]); 

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
    <MDBCard className="breadcrum mb-6 ">
      <MDBCardBody id="breadcrumb" >
        <MDBBreadcrumb>
          <MDBBreadcrumbItem>
          <MDBIcon fas icon="home" style={{ marginRight: "2%" }} />
          </MDBBreadcrumbItem>
          <MDBBreadcrumbItem>Home</MDBBreadcrumbItem>
          {breadcrumbs.map((breadcrumb, index) => (
            <MDBBreadcrumbItem key={index} active={index === breadcrumbs.length - 1}>
              <Link style={{  pointerEvents:"none" }} to={breadcrumb.path}>{breadcrumb.displayName}</Link>
            </MDBBreadcrumbItem>
          ))}
            </MDBBreadcrumb>
    </MDBCardBody>
  </MDBCard>
  
  )
}

export default BreadcrumSection;
