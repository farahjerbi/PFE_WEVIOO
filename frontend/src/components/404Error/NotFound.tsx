import { MDBBtn } from 'mdb-react-ui-kit'
import "./Error.css" 
import { DASHBOARD } from '../../routes/paths'
import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <div className="not-found-container">
     <div style={{ margin: "20px" }} >
    <h4 style={{color:"#6873C8"}}>
      This page you are looking for might have been removed, had its name changed or is temporarily unavailable.
    </h4>
    <MDBBtn className='mt-5' color='secondary' style={{marginLeft:"35%"}}>
      <Link to={DASHBOARD}>Go To Dashboard</Link>
      </MDBBtn>
  </div>
    <img src='../../../assets/error.gif' alt='ops!' style={{ height: "100vh" }} />
  </div>
  
  )
}

export default NotFound