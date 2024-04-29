import React, { ChangeEvent, useEffect, useState } from 'react';
import { MDBBtn, MDBIcon, MDBInput } from 'mdb-react-ui-kit';
import *as xlsx from 'xlsx';
import { FormControl, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { CountryCode } from '../../models/sms/CountryCode';
interface NumberInputProps {
    label: string;
    onChange: (numbers: string[]) => void;
  
  }
const NumberInput : React.FC<NumberInputProps> = ({ label,onChange }) => {
    const [numbers, setNumbers] = useState<string[]>(['']);  
    const[countryCode,setCountryCode]=useState<string[]>(['']);
    const[newNumberWithCountryCode,setNumberWithCountryCode]=useState<string[]>(['']);
    console.log("🚀 ~ newNumberWithCountryCode:", newNumberWithCountryCode)

    const numericRegex = /^[0-9]+$/;
    
    useEffect(() => {
      onChange(numbers);
      onChange(countryCode)
    }, [numbers,countryCode, onChange]);

    const handleSMSChange = (index: number, value: string) => {
        const newNumbers = [...numbers];
        newNumbers[index] = value; 
        setNumbers(newNumbers);
        newNumberWithCountryCode[index] = countryCode[index] + value;
        setNumberWithCountryCode(newNumberWithCountryCode);
      };
    
      const addSMSField = () => {
        if (numbers.length < 4 && countryCode.length<4) {
            setNumbers([...numbers, '']);
            setCountryCode([...countryCode, ''])
        }
      };
    
      const removeEmailField = (index: number) => {
        const newSMSs = [...numbers];
        const countryCodes = [...countryCode];
        newSMSs.splice(index, 1);
        countryCodes.splice(index, 1);
        setCountryCode(countryCodes)
        setNumbers(newSMSs);
      };
      const handleChangeCountry =  (event: SelectChangeEvent,index:number) => {
        const newSMSs = [...numbers];
        newSMSs[index] = event.target.value;
        setCountryCode(newSMSs);
        
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
        <label className='me-5'>Country:</label>

      <label className='ms-5'>{label}</label>
      {numbers.map((email, index) => (
        <>
               <div  key={`${index}-${countryCode[index]}`} className='d-flex mb-2'>
              <FormControl style={{width:"20%"}} className='me-2'>
                <Select
                    id={`country-select-${index}`}
                  value={countryCode[index]}
                  onChange={(e) => handleChangeCountry(e, index)}
                  variant="outlined"
                  >
               {Object.entries(CountryCode).map(([key, value]) => (
                  <MenuItem key={value} value={value}>
                      {key}
                  </MenuItem>
              ))}
                              
                      </Select>
              </FormControl>
          <MDBInput
            name="number"
            type="text"
            value={email}
            onChange={(e) => handleSMSChange(index, e.target.value)}
            required
          />
          {index > 0 && (
            <MDBBtn type="button" onClick={() => removeEmailField(index)} className="remove-btn">
               <MDBIcon icon="remove" style={{marginRight:"3px"}}/>
            </MDBBtn>
          )}
        </div>
        {countryCode[index]==="" && (<label style={{color:"red"}}>
            <i style={{ color: "red" }} className="fas fa-exclamation-circle trailing"></i>
            Choose a country
            </label>)}

        {(numericRegex.test(numbers[index]) || numbers[index].length!==10) && (
        <label style={{color:"red"}} className='ms-4'>
               <i style={{ color: "red" }} className="fas fa-exclamation-circle trailing"></i>
            Incorrect Number
            </label>)}
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