import React, { ChangeEvent, useEffect, useState } from 'react';
import { MDBBtn, MDBIcon, MDBInput } from 'mdb-react-ui-kit';
import *as xlsx from 'xlsx';
import PhoneInput from 'react-phone-input-2'
import "react-phone-input-2/lib/style.css";
import ExcelButton from '../button/ExcelButton';
import { NotificationType } from '../../models/NotificationType';
import ContactNumbersModal from '../modals/ContactNumbersModal';

interface NumberInputProps {
    label: string;
    onChange: (numbers: string[]) => void;
    type:NotificationType
  
  }
const NumberInput : React.FC<NumberInputProps> = ({ label,onChange,type }) => {
    const [numbers, setNumbers] = useState<string[]>(['']); 
    const [open, setOpen] = useState<boolean>(false);   
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
  

    const handleExcelUpload = (uploadedEmails: string[],uploadedPhones:string[],uploadedWhatsapp: string[]) => {
      if(type===NotificationType.SMS){
        setNumbers(uploadedPhones); 
      }else{
        setNumbers(uploadedWhatsapp); 
      }
    };
    
  return (
    <div className='container'>

      <label>{label}</label>
      {numbers.map((number, index) => (
        <>
               <div key={index} className='d-flex mb-2'>
        
              <PhoneInput
              country={'us'}
              value={number.toString()} 
              onChange={(value) => handleSMSChange(index, value)}
              />
   
          {index > 0 && (
            <MDBBtn type="button" onClick={() => removeSMSField(index)} className="remove-btn">
               <MDBIcon icon="remove" style={{marginRight:"3px"}}/>
            </MDBBtn>
          )}
        </div>
        <div>
           {numbers.length- 1 === index && numbers.length < 4 && (
            <div className="button-container d-flex" style={{ marginTop: '10px' }}>
            <MDBBtn type="button" onClick={addSMSField} className="add-btn me-3" style={{ padding: '8px 16px' }}>
              <MDBIcon icon="add" style={{ marginRight: "3px" }} />
            </MDBBtn>
      
            <ExcelButton onExcelUpload={handleExcelUpload} />
      
            <MDBBtn onClick={() => setOpen(true)} type="button" className="add-btn ms-3 baby-bluee" style={{ padding: '8px 16px' }}>
              <MDBIcon icon="address-book" style={{ marginRight: "3px" }} />
            </MDBBtn>
          </div>
      )}
        </div>
        {open && (
          <ContactNumbersModal onClose={()=>setOpen(false)} onSubmit={setNumbers} type={type} show={open} />
        )}
        </>
      ))}
    </div>  )
}

export default NumberInput