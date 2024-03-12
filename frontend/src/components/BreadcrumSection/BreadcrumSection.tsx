import { MDBCard, MDBCardBody, MDBIcon, MDBBreadcrumb, MDBBreadcrumbItem, MDBBtn, MDBInput } from 'mdb-react-ui-kit';
import './BreadcrumSection.css'
const BreadcrumSection = () => {
  return (
    <MDBCard className="breadcrum mb-10 ">
      <MDBCardBody id="breadcrumb" >
        <MDBBreadcrumb>
          <MDBBreadcrumbItem>
          <MDBIcon fas icon="home" style={{ marginRight: "2%" }} />
          </MDBBreadcrumbItem>
          <MDBBreadcrumbItem>Home</MDBBreadcrumbItem>
          <MDBBreadcrumbItem active>Dashboard</MDBBreadcrumbItem>
        </MDBBreadcrumb>
    </MDBCardBody>
  </MDBCard>
  
  )
}

export default BreadcrumSection;
