import React, { ChangeEvent, useEffect, useState } from 'react';
import { MDBBtn, MDBIcon, MDBInput } from 'mdb-react-ui-kit';
import *as xlsx from 'xlsx';
import PhoneInput from 'react-phone-input-2'
import "react-phone-input-2/lib/style.css";

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
            
            const rowValuesArray = exceljson.map(row => Object.values(row));
            
            const allValues = rowValuesArray.flat();
            
            const filteredValues = allValues.filter((value: unknown): value is string => 
              typeof value === 'string' && value.trim() !== ""
            );
        
            console.log("🚀 ~ reader.onload= ~ filteredValues:", filteredValues);
            setNumbers(filteredValues); 
          };
        
          reader.readAsArrayBuffer(file);
        } catch (error) {
          console.error('Error reading Excel file:', error);
        }
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
    </div>  )
}

export default NumberInput