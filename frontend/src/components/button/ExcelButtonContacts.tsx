import { MDBBtn, MDBIcon } from 'mdb-react-ui-kit';
import * as xlsx from 'xlsx';
import { getValue, validateEmail, validatePhone } from '../../routes/Functions';
interface ExcelButtonContactsProps {
    onDataProcessed: (data: any[]) => void;
}
const ExcelButtonContacts: React.FC<ExcelButtonContactsProps> = ({ onDataProcessed }) => {

    const filterAndValidateData = (data: any[]) => {
        const keysToKeep = ['fullName', 'phone', 'whatsapp', 'email', 'auth', 'endPoint', 'publicKey'];
        return data.map(row => {
            const filteredRow: any = {};
            keysToKeep.forEach(key => {
                const value = getValue(row, key);
                if (value !== undefined) {
                    filteredRow[key] = value;
                }
            });
    
            // Validate email and phone
            if (filteredRow.email && !validateEmail(filteredRow.email)) {
                console.warn(`Invalid email: ${filteredRow.email}`);
                filteredRow.email = undefined; // or handle invalid email
            }
            if (filteredRow.phone && !validatePhone(filteredRow.phone)) {
                console.warn(`Invalid phone: ${filteredRow.phone}`);
                filteredRow.phone = undefined; // or handle invalid phone
            }
            
            return filteredRow;
        });
    };
    

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
                    const filteredData = filterAndValidateData(jsonData);

                    console.log("🚀 ~ readExcel ~ jsonData:", filteredData);
                    onDataProcessed(filteredData);
                }
            };
            reader.readAsBinaryString(file); 
        }
    };

    return (
        <MDBBtn type="button" color='info' className='mt-3'>
            <input type="file" accept=".xlsx, .xls" onChange={(e) => readExcel(e)} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }} />
            <MDBIcon icon="file-excel" style={{ marginRight: "3px" }} />
            Upload Excel 
        </MDBBtn>
    )
}

export default ExcelButtonContacts;
