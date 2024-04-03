import React, { ChangeEvent, useEffect, useState } from 'react';
import { MDBBtn, MDBIcon, MDBInput } from 'mdb-react-ui-kit';
import './EmailInput.css';
import *as xlsx from 'xlsx';
import { styled } from '@mui/material';
const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});
interface EmailInputProps {
  label: string;
  onChange: (emails: string[]) => void;

}

const EmailInput: React.FC<EmailInputProps> = ({ label,onChange }) => {
  const [emails, setEmails] = useState<string[]>(['']);  
  console.log("🚀 ~ emails:", emails)
  
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

  const readExcel = async (e: ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files && e.target.files[0];
      console.log("🚀 ~ readExcel ~ file:", file);
      if (!file) return;
  
      const reader = new FileReader();
      reader.onload = async (event) => {
        if (!event.target) return;
  
        const data = event.target.result;
        console.log("🚀 ~ reader.onload= ~ data:", data);
        if (!data) return;
  
        const buffer = new Uint8Array(data as ArrayBuffer);
        const workbook = xlsx.read(buffer, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        console.log("🚀 ~ reader.onload= ~ sheet:", sheet);
        const exceljson: any[] = xlsx.utils.sheet_to_json(sheet, { defval: "" }); 
        
        // Extract values from each row
        const rowValuesArray = exceljson.map(row => Object.values(row));
        
        // Flatten the array of arrays to get a single array of all values
        const allValues = rowValuesArray.flat();
        
        // Filter out empty or undefined values
        const filteredValues = allValues.filter((value: unknown): value is string => 
          typeof value === 'string' && value.trim() !== ""
        );
    
        console.log("🚀 ~ reader.onload= ~ filteredValues:", filteredValues);
        setEmails(filteredValues); 
      };
    
      reader.readAsArrayBuffer(file);
    } catch (error) {
      console.error('Error reading Excel file:', error);
    }
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
            <>
               <MDBBtn type="button" onClick={addEmailField} className="add-btn me-5" >
                <MDBIcon icon="add" style={{marginRight:"3px"}}/>
                  Add 
              </MDBBtn>

              <MDBBtn type="button" color='info'>
                <input type="file"  onChange={(e) => readExcel(e)} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }} />
                <MDBIcon icon="file-excel" style={{marginRight:"3px"}}/>
                  Download Excel 
              </MDBBtn>
            </>
     
        
      )}
        </div>
        </>
      ))}
    </div>
  );
};

export default EmailInput;
