import { MDBBtn, MDBIcon } from 'mdb-react-ui-kit';
import React, { useState } from 'react'
import *as xlsx from 'xlsx';
interface ExcelButtonProps {
    onExcelUpload: (
      emails: string[],
      phones: string[],
      whatsapp: string[],
      auth: string[],
      publicKey: string[],
      endPoint: string[]
    ) => void;
  }
  const getValue = (row: any, key: string) => {
    const lcKey = key.toLowerCase();
    for (const k in row) {
      if (k.toLowerCase() === lcKey) {
        return row[k];
      }
    }
    return undefined;
  };

  const validateEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    const regex = /^\d{11}$/;
    return regex.test(phone);
  };
  
const ExcelButton: React.FC<ExcelButtonProps> = ({ onExcelUpload }) => {

    const [uploadedEmails, setUploadedEmails] = useState<string[]>([]);
    const [uploadedPhones, setUploadedPhones] = useState<string[]>([]);
    const [uploadedWhatsapp, setUploadedWhatsapp] = useState<string[]>([]);
    const [uploadedAuth, setUploadedAuth] = useState<string[]>([]);
    const [uploadedPublicKey, setUploadedPublicKey] = useState<string[]>([]);
    const [uploadedEndPoint, setUploadedEndPoint] = useState<string[]>([]);

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
              const jsonData = xlsx.utils.sheet_to_json(sheet);
    
              const emails: string[] = [];
              const phones: string[] = [];
              const whatsapp: string[] = [];
              const auth: string[] = [];
              const publicKey: string[] = [];
              const endPoint: string[] = [];

              jsonData.forEach((row: any) => {
                const email = getValue(row, 'email') || getValue(row, 'emails');
                const phone = getValue(row, 'phone') || getValue(row, 'phone');
                const wa = getValue(row, 'whatsapp') || getValue(row, 'whatsapp');
                const a = getValue(row, 'auth') || getValue(row, 'auth');
                const pk = getValue(row, 'publicKey') || getValue(row, 'publicKey');
                const ep = getValue(row, 'endPoint') || getValue(row, 'endPoint');

                        if (email && validateEmail(email)) {
                            emails.push(email);
                        }
                        if (phone && validatePhone(phone)) {
                            phones.push(phone);
                        }
                        if (wa && validatePhone(wa)) {
                            whatsapp.push(wa);
                        }
                        if (a) {
                            auth.push(a);
                        }
                        if (pk) {
                            publicKey.push(pk);
                        }
                        if (ep) {
                            endPoint.push(ep);
                        }
                        });
                    
              setUploadedEmails(emails);
              setUploadedPhones(phones);
              setUploadedWhatsapp(whatsapp);
              setUploadedAuth(auth);
              setUploadedPublicKey(publicKey);
              setUploadedEndPoint(endPoint);
    
              onExcelUpload(emails, phones, whatsapp, auth, publicKey, endPoint);
            }
          };
          reader.readAsBinaryString(file);
        }
      };
    
  return (
    <MDBBtn type="button" color='info'>
    <input type="file" accept=".xlsx, .xls" onChange={(e) => readExcel(e)} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }} />
    <MDBIcon icon="file-excel" style={{marginRight:"3px"}}/>
      Download Excel 
  </MDBBtn>
    )
}

export default ExcelButton