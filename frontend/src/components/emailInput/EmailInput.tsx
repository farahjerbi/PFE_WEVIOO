import React, { useEffect, useState } from 'react';
import { MDBBtn, MDBIcon, MDBInput } from 'mdb-react-ui-kit';
import './EmailInput.css';
interface EmailInputProps {
  label: string;
  onChange: (emails: string[]) => void;

}

const EmailInput: React.FC<EmailInputProps> = ({ label,onChange }) => {
  const [emails, setEmails] = useState<string[]>(['']);  
  
  useEffect(() => {
    onChange(emails);
  }, [emails, onChange]);

  const handleEmailChange = (index: number, value: string) => {
    const newEmails = [...emails];
    newEmails[index] = value;
    setEmails(newEmails);
  };

  const addEmailField = () => {
    if (emails.length < 4) {
      setEmails([...emails, '']);
    }
  };

  const removeEmailField = (index: number) => {
    const newEmails = [...emails];
    newEmails.splice(index, 1);
    setEmails(newEmails);
  };

  return (
    <div className='container-input'>
      <label>{label}</label>
      {emails.map((email, index) => (
        <>
               <div key={index} className='d-flex mb-2'>
          <MDBInput
            name="email"
            type="text"
            value={email}
            onChange={(e) => handleEmailChange(index, e.target.value)}
            required
          />
          {index > 0 && (
            <MDBBtn type="button" onClick={() => removeEmailField(index)} className="remove-btn">
               <MDBIcon icon="remove" style={{marginRight:"3px"}}/>
            </MDBBtn>
          )}
        </div>
        <div>
           {emails.length- 1 === index && emails.length < 4 && (
        <MDBBtn type="button" onClick={addEmailField} className="add-btn">
         <MDBIcon icon="add" style={{marginRight:"3px"}}/>
          Add 
        </MDBBtn>
      )}
        </div>
        </>
      ))}
    </div>
  );
};

export default EmailInput;
