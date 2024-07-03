import React, { useState } from 'react';
import * as xlsx from 'xlsx';
import { MDBBtn, MDBIcon } from 'mdb-react-ui-kit';
import { getValue, validateEmail, validatePhone } from '../../routes/Functions';

interface ExcelButtonProps {
    onExcelUpload: (data: Record<string, string[]>) => void;
  }
  
const ExcelSendButton : React.FC<ExcelButtonProps> = ({ onExcelUpload }) => {
    const [uploadedData, setUploadedData] = useState<Record<string, string[]>>({});
    console.log("🚀 ~ uploadedData:", uploadedData)
    const readExcel = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            const data = e.target?.result;
            if (data) {
              const workbook = xlsx.read(data, { type: 'binary' });
              const sheetName = workbook.SheetNames[0];
              const sheet = workbook.Sheets[sheetName];
    
              // Preprocess the sheet data to include empty cells
              const range = xlsx.utils.decode_range(sheet['!ref'] || '');
              for (let R = range.s.r; R <= range.e.r; ++R) {
                for (let C = range.s.c; C <= range.e.c; ++C) {
                  const cell_address = { c: C, r: R };
                  const cell_ref = xlsx.utils.encode_cell(cell_address);
                  if (!sheet[cell_ref]) {
                    sheet[cell_ref] = { t: 's', v: 'unknown' }; // Set default value for empty cells
                  }
                }
              }
    
              const jsonData = xlsx.utils.sheet_to_json(sheet, { defval: 'unknown' });
    
              const dataObj: Record<string, string[]> = {};
              jsonData.forEach((row: any) => {
                const email = getValue(row, 'email') || getValue(row, 'emails');
                const phone = getValue(row, 'phone');
                const wa = getValue(row, 'whatsapp');
    
                if (!validateEmail(email)) {
                  row.email = 'unknown';
                }
                if (!validatePhone(phone)) {
                  row.phone = 'unknown';
                }
                if (!validatePhone(wa)) {
                  row.whatsapp = 'unknown';
                }
    
                Object.keys(row).forEach((key) => {
                  if (!dataObj[key]) {
                    dataObj[key] = [];
                  }
                  dataObj[key].push(row[key]);
                });
              });
    
              setUploadedData(dataObj);
              onExcelUpload(dataObj);
            }
          };
          reader.readAsBinaryString(file);
        }
      };
  return (
    <MDBBtn type="button" className='ms-5 w-60 mb-4 color_baby_bluee me-5'>
      <input
        type="file"
        accept=".xlsx, .xls"
        onChange={(e) => readExcel(e)}
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
      />
      <MDBIcon icon="file-excel" style={{ marginRight: '3px' }} />
      Upload Excel
    </MDBBtn>  )
}

export default ExcelSendButton