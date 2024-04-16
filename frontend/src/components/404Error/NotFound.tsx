import { MDBBtn } from 'mdb-react-ui-kit'
import "./Error.css" 
import { DASHBOARD } from '../../routes/paths'
import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <div className="not-found-container">
      <img src="../../../assets/404Error.png" style={{width:"30%",height:"400px",marginLeft:"35%"}} alt="" />
      <h4 style={{color:"#6873C8"}}>
      This page you are looking for might have been removed, had its name changed or is temporarily unavailable.
    </h4>
   <MDBBtn className='mt-5' color='secondary' style={{marginLeft:"5%"}}>
      <Link to={DASHBOARD}>Go Back To Dashboard</Link>
      </MDBBtn>
  </div>
  
  )
}

export default NotFound