import { MDBCard, MDBCardBody, MDBCardImage, MDBCol, MDBRow, MDBTabs, MDBTabsItem, MDBTabsLink } from 'mdb-react-ui-kit'
import {useEffect, useState}from 'react'
import Register from '../../components/register/Register';
import Login from '../../components/login/Login';
import './Authentication.css'
import { useNavigate, useParams } from 'react-router-dom';
import { isTokenExpired } from '../../redux/state/authSlice';
import { AUTHENTICATION } from '../../routes/paths';
import axios from 'axios';

interface Template {
  id: number;
  type: string;
  name: string;
  subject: string;
  body?: string;
  language: string;
}
const Authentication = () => {
    const { emailUser } = useParams();
    const [loginRegisterActive, setLoginRegisterActive] = useState<string>("login");
    const navigate = useNavigate();
    const [userDescription, setUserDescription] = useState('');
    const [matchedTemplates, setMatchedTemplates] = useState<Template[]>([]);

    const handleSearch = async () => {
        try {
          const response = await axios.post('http://localhost:5000/api/search', { description: userDescription });
          setMatchedTemplates(response.data);
        } catch (error) {
            console.error('Error fetching template:', error);
        }
    };

    useEffect(() => {

      if(emailUser && isTokenExpired(emailUser)){
        navigate(AUTHENTICATION)}
        if(emailUser){
          setLoginRegisterActive('register')
        }
       } , []);
  
    return (
    <div className="container-auth ">
       {/* <div>
            <input type="text" value={userDescription} onChange={(e) => setUserDescription(e.target.value)} />
            <button onClick={handleSearch}>Search Template</button>

            {matchedTemplates.length > 0 ? (
                    <div>
                        <h3>Matched Templates:</h3>
                        {matchedTemplates.map((template, index) => (
                            <div key={index}>
                                <p>ID: {template.id}</p>
                                <p>Type: {template.type}</p>
                                <p>Name: {template.name}</p>
                                <p>Subject: {template.subject}</p>
                                {template.body && <p>Body: {template.body}</p>}
                                <p>Language: {template.language}</p>
                                <hr />
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No matching templates found.</p>
                )}
        </div> */}
    <MDBCard className='my-5 auth-card'  >
      <MDBRow>
        <MDBCol md="6">
          <MDBCardImage className='illustration' src="../assets/auth.jpg" />
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