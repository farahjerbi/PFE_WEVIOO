import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { selectPush } from '../../redux/state/pushSlice'
import { MDBInput } from 'mdb-react-ui-kit'
interface PushSettingsProps {
    onChange: (placeholdersValues:{ [key: string]: string }) => void;  
}
  
const PushSettings : React.FC<PushSettingsProps> = ({ onChange }) => {
    const template=useSelector(selectPush)
    const [placeholdersValues, setPlaceholdersValues] = useState<{ [key: string]: string }>({});
    useEffect(() => {
        onChange(placeholdersValues);
      }, [placeholdersValues, onChange]);
    const handleInputChange = (key: string, value: string ) => {
        setPlaceholdersValues((prevPlaceholders) => ({
            ...prevPlaceholders,
            [key]: value.toString()
        }));
    };

  return (
    <div className='mt-5'>
                {template?.placeholders.map((placeholder) => (
                    <div key={placeholder}>
                        <MDBInput
                            className='mb-3'
                            label={placeholder}
                            required
                            type="text"
                            onChange={(e) => handleInputChange(placeholder, e.target.value)}
                        />
                    </div>
        ))}
    </div>
  )
}

export default PushSettings