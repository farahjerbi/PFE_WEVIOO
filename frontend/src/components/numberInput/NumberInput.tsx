import React, { ChangeEvent, useEffect, useState } from 'react';
import { MDBBtn, MDBIcon, MDBInput } from 'mdb-react-ui-kit';
import *as xlsx from 'xlsx';
import PhoneInput from 'react-phone-input-2'
import "react-phone-input-2/lib/style.css";
import ExcelButton from '../button/ExcelButton';

interface NumberInputProps {
    label: string;
    onChange: (numbers: string[]) => void;
  
  }
const NumberInput : React.FC<NumberInputProps> = ({ label,onChange }) => {
    const [numbers, setNumbers] = useState<string[]>(['']);  
    console.log("🚀 ~ numbers:", numbers)

    
    useEffect(() => {
      onChange(numbers);
    }, [numbers, onChange]);

    const handleSMSChange = (index: number, value: string) => {
      const newSMS = [...numbers];
      newSMS[index] = value;
      setNumbers(newSMS);
    };
  
    const addSMSField = () => {
      if (numbers.length < 4) {
        setNumbers([...numbers, '']);
      }
    };
  
    const removeSMSField = (index: number) => {
      const newSMS = [...numbers];
      newSMS.splice(index, 1);
      setNumbers(newSMS);
    };
  

    const handleExcelUpload = (uploadedEmails: string[]) => {
      setNumbers(uploadedEmails); 
    };
    
  return (
    <div className='container-input'>

      <label className='ms-5'>{label}</label>
      {numbers.map((number, index) => (
        <>
               <div key={index} className='d-flex mb-2'>
        
              <PhoneInput
              country={'us'}
              value={number}
              onChange={(e) => handleSMSChange(index, e)}
              />
   
          {index > 0 && (
            <MDBBtn type="button" onClick={() => removeSMSField(index)} className="remove-btn">
               <MDBIcon icon="remove" style={{marginRight:"3px"}}/>
            </MDBBtn>
          )}
        </div>
        <div>
           {numbers.length- 1 === index && numbers.length < 4 && (
            <>
               <MDBBtn type="button" onClick={addSMSField} className="add-btn me-5" >
                <MDBIcon icon="add" style={{marginRight:"3px"}}/>
                  Add 
              </MDBBtn>

              <ExcelButton onExcelUpload={handleExcelUpload} />

            </>
     
        
      )}
        </div>
        </>
      ))}
    </div>  )
}

export default NumberInput