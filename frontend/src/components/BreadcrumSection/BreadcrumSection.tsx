import { MDBCard, MDBCardBody, MDBIcon, MDBBreadcrumb, MDBBreadcrumbItem } from 'mdb-react-ui-kit';
import './BreadcrumSection.css'
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
const BreadcrumSection = () => {
  const location = useLocation();
  const [dashboardName, setDashboardName] = useState('');

  useEffect(() => {
    const pathname = location.pathname;
    const dashboardNameFromPath = pathname.split('/')[1];
    const formattedDashboardName = dashboardNameFromPath.charAt(0).toUpperCase() + dashboardNameFromPath.slice(1);
    setDashboardName(formattedDashboardName);
  }, [location.pathname]);

  return (
    <MDBCard className="breadcrum mb-10 ">
      <MDBCardBody id="breadcrumb" >
        <MDBBreadcrumb>
          <MDBBreadcrumbItem>
          <MDBIcon fas icon="home" style={{ marginRight: "2%" }} />
          </MDBBreadcrumbItem>
          <MDBBreadcrumbItem>Home</MDBBreadcrumbItem>
          <MDBBreadcrumbItem active>{dashboardName}</MDBBreadcrumbItem>
        </MDBBreadcrumb>
    </MDBCardBody>
  </MDBCard>
  
  )
}

export default BreadcrumSection;
