import { MDBCard, MDBCardBody, MDBIcon, MDBBreadcrumb, MDBBreadcrumbItem, MDBBtn, MDBInput } from 'mdb-react-ui-kit';
import './BreadcrumSection.css'
const BreadcrumSection = () => {
  return (
    <MDBCard className="breadcrum mb-5" >
        <MDBCardBody id="breadcrumb" className="d-flex align-items-center justify-content-between">
            <MDBBreadcrumb>
                <MDBBreadcrumbItem>Home</MDBBreadcrumbItem>
                <MDBBreadcrumbItem active>Dashboard</MDBBreadcrumbItem>
            </MDBBreadcrumb>
            <form className="md-form m-0">
                <div style={{display:'flex'}}>
                <MDBInput className="form-control form-control-sm"  label="Type your query" aria-label="Search"/>
                <MDBBtn size="sm" color="primary" className="my-0" type="submit"><MDBIcon icon="search" /></MDBBtn>
                </div>
            </form>
        </MDBCardBody>
    </MDBCard>
  )
}

export default BreadcrumSection;
