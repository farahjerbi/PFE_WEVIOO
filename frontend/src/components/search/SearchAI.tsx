import axios from 'axios';
import React, { useState } from 'react'
import BreadcrumSection from '../BreadcrumSection/BreadcrumSection';
import "./SearchAI.css"
interface Template {
    id: number;
    type: string;
    name: string;
    subject: string;
    body?: string;
    language: string;
  }
const SearchAI = () => {
    const [userDescription, setUserDescription] = useState('');
    const [matchedTemplates, setMatchedTemplates] = useState<Template[]>([]);

    const handleSearch = async () => {
        try {
          const response = await axios.post('http://localhost:5000/api/search', { description: userDescription });
          setMatchedTemplates(response.data);
        } catch (error) {
            console.error('Error fetching template:', error);
        }
    };
  return (
    <>
    <BreadcrumSection/>
    <div className='container-search'>
            <input type="text" value={userDescription} onChange={(e) => setUserDescription(e.target.value)} />
            <button onClick={handleSearch}>Search Template</button>

            {matchedTemplates.length > 0 ? (
                    <div>
                        <h3>Matched Templates:</h3>
                        {matchedTemplates.map((template, index) => (
                            <div key={index}>
                                <p>ID: {template.id}</p>
                                <p>Type: {template.type}</p>
                                <p>Name: {template.name}</p>
                                <hr />
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No matching templates found.</p>
                )}
        </div>     
    </>

  )
}

export default SearchAI