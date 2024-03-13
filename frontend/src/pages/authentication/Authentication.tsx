import { MDBCard, MDBCardBody, MDBCardImage, MDBCol, MDBRow, MDBTabs, MDBTabsItem, MDBTabsLink } from 'mdb-react-ui-kit'
import {useState}from 'react'
import Register from '../../components/register/Register';
import Login from '../../components/login/Login';
import './Authentication.css'


const Authentication = () => {
    const [loginRegisterActive, setLoginRegisterActive] = useState<string>("login"); 
    return (
    <div className="container">
    <MDBCard className='my-5'  >
      <MDBRow>
        <MDBCol md="6">
          <MDBCardImage className='illustration' src="../assets/email.png" />
        </MDBCol>
        <MDBCol md="6">
          <MDBCardBody  >
            <img  className='logoo'  src="../assets/logo.png" alt="" />
            <MDBTabs pills justify className='mb-3'>
              <MDBTabsItem>
                <MDBTabsLink
                  onClick={() => setLoginRegisterActive('login')}
                  active={loginRegisterActive === 'login'}
                >
                  Login
                </MDBTabsLink>
              </MDBTabsItem>
              <MDBTabsItem>
                <MDBTabsLink
                  onClick={() => setLoginRegisterActive('register')}
                  active={loginRegisterActive === 'register'}
                >
                  Register
                </MDBTabsLink>
              </MDBTabsItem>
            </MDBTabs>
            {loginRegisterActive === 'login' && (
                <Login/>
              )}

              {loginRegisterActive === 'register' && (
                  <Register />
              )}
          </MDBCardBody>
        </MDBCol>
      </MDBRow>
    </MDBCard>
</div>  )
}

export default Authentication