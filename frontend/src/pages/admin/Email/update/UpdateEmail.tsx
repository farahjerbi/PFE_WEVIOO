import React, { useEffect, useRef, useState } from 'react'
import './UpdateEmail.css'
import BreadcrumSection from '../../../../components/BreadcrumSection/BreadcrumSection'
import { MDBBtn, MDBCard, MDBCardBody, MDBCol, MDBInput, MDBRow, MDBSpinner, MDBTextArea } from 'mdb-react-ui-kit'
import { useGetDesignTemplateMutation, useGetTemplateByIdMutation, useUpdateTemplateMutation } from '../../../../redux/services/emailApi'
import EmailEditor, {  EmailEditorProps } from 'react-email-editor'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { LIST_EMAIL_TEMPLATES } from '../../../../routes/paths'
import { useDispatch, useSelector } from 'react-redux'
import { selectEmail, setSelectedEmail, setUpdateEmail } from '../../../../redux/state/emailSlice'

const UpdateEmail = () => {
  const emailEditorRef = useRef<any>(null); 
  const [loading, setLoading] = useState<boolean>(false);
  const [templateDesign,setTemplateDesign]= useState<any>(null);
  const [show,setShow]= useState<boolean>(false);
  const[getDesignTemplate]=useGetDesignTemplateMutation();
  const template=useSelector(selectEmail)
  const dispatch=useDispatch()

  const initialState={
    name: template?.name,
    state:template?.state,
    language:template?.language,
    content:template?.templateBody.content,
    subject:template?.templateBody.subject,
    design:""
  }
  const [formData, setFormData] = useState(initialState);
  const {name,state,content,subject,language}=formData;
  const navigate=useNavigate();
  const[updateTemplate]=useUpdateTemplateMutation();
  const[getTemplateById]=useGetTemplateByIdMutation()
  const{id}=useParams();

  useEffect(() => {
    fetchDataTemplate();
    if(template?.state ==="COMPLEX"){
    fetchData();
  }
  },[]);
  const fetchDataTemplate = async () => {
    try {
        const template = await getTemplateById(Number(id)).unwrap();
        setSelectedEmail(template);
    } catch (error) {
      toast.error("Error! Yikes");
      console.error("🚀 ~ error:", error);
    }
  };
    
  const fetchData = async () => {
    try {
        const design = await getDesignTemplate(Number(template?.id)).unwrap();
        setTemplateDesign(design);
    } catch (error) {
      toast.error("Error! Yikes");
      console.error("🚀 ~ error:", error);
    }
  };

  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({...formData, [e.target.name]: e.target.value})
  }

  const onLoad: EmailEditorProps["onLoad"] = (unlayer) => {
    console.log("onLoad", unlayer);
    unlayer.loadDesign(templateDesign);
  };

  
  const handleUpdateTemplate: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setLoading(true); 
  
    if (!template) {
      console.error('Template data is missing');
      return;
    }
    try {
        if (formData.state === "COMPLEX") {
          emailEditorRef.current.editor.exportHtml((data: any) => { 
            localStorage.setItem("newsletter", JSON.stringify(data));
            if (data.html) {
              formData.content=data.html
            }
          });
          emailEditorRef.current.editor.saveDesign((data: any) => { 
            if (data) {
              formData.design=data
              console.log("🚀 ~ emailEditorRef.current.editor.exportHtml ~ data.html:", data)
             }
          });
        }

        await new Promise(resolve => setTimeout(resolve, 5000));

        const emailTemplate = {
          name: formData.name,
          language: formData.language,
          state: formData.state,
          subject: formData.subject,
          content: formData.content
      };
      const requestData = {
          jsonObject: formData.design,
          emailTemplate: emailTemplate,
          id: template?.id
      };
      console.log("🚀 ~ consthandleUpdateTemplate:React.FormEventHandler<HTMLFormElement>= ~ requestData:", requestData)

          const emailTemplateWithId = {
            id: template?.id,
            name: formData.name || "", 
            language: formData.language || "",
            state: formData.state || "",
            templateBody: {
                subject: formData.subject || "",
                content: formData.content || ""
            }
        };
        await updateTemplate(requestData);
        dispatch(setUpdateEmail(emailTemplateWithId));        
        toast.success("Template updated successfully");

        navigate(LIST_EMAIL_TEMPLATES)
      
      
    } catch (error) {
      console.error('Error updating template:', error);
    }finally {
      setLoading(false); 
  }
  };


  
  return (
    <>
    <BreadcrumSection/>

    <div className='update_container' >

        <div className="p-5 bg-image" style={{backgroundImage: 'url("../../../assets/updatee.png")', height: '300px'}}></div>
        <form onSubmit={handleUpdateTemplate}>
        <MDBCard className='mx-5 mb-5 p-5 shadow-5' style={{marginTop: '-40px', background: 'hsla(0, 0%, 100%, 0.8)', backdropFilter: 'blur(30px)'}}>
        <MDBCardBody className='p-5 text-center'>

            <h2 className="fw-bold mb-5">Email Template</h2>

         {!show && (
          <>
              <MDBRow>
              <MDBCol col='6'>
                  <MDBInput name='name' value={name} onChange={handleChange} wrapperClass='mb-4' label='Name' type='text'/>
              </MDBCol>
  
              <MDBCol col='6'>
                  <MDBInput name='language' value={language} onChange={handleChange}  wrapperClass='mb-4' label='Language'  type='text'/>
              </MDBCol>
              <MDBCol col='6'>
                  <MDBInput name='state' value={state} onChange={handleChange}  wrapperClass='mb-4' label='Language' disabled  type='text'/>
              </MDBCol>
              </MDBRow>
  
              <MDBInput  name='subject' value={subject} onChange={handleChange}  wrapperClass='mb-4' label='Subject' type='text'/>
  
            {template?.state==="SIMPLE" ?
            <>
                <MDBTextArea rows={4} name='content' value={content} onChange={handleChange} wrapperClass='mb-4' label='Content' />
                {loading && (
                    <div className='d-flex justify-content-center mt-4'>
                    <MDBBtn disabled className='btn w-50 ' >
                    <MDBSpinner size='sm' role='status' tag='span' className='me-2' />
                        Loading...
                    </MDBBtn>
                    </div>

                )}
               {!loading && ( <MDBBtn className='w-100 mb-4 color_baby_bluee' type='submit' >Update</MDBBtn>)}
            </>
             :<MDBBtn className='w-100 mb-4 color_baby_bluee'  type='button' onClick={()=>setShow(true)}>Next</MDBBtn> }
          </>
 
          )}

    {show && (
            <>
              {loading && (
                    <div className='d-flex justify-content-center mt-4'>
                    <MDBBtn disabled className='btn w-50 ' >
                    <MDBSpinner size='sm' role='status' tag='span' className='me-2' />
                        Loading...
                    </MDBBtn>
                    </div>

                )}
               {!loading && ( <MDBBtn className='w-100 mb-4 color_baby_bluee' type='submit' >Update</MDBBtn>)}
            <EmailEditor
                  ref={emailEditorRef}
                  onLoad={onLoad}
                  minHeight={"71vh"}
                  options={{
                    features: {
                    },
                    options: {
                      close: () => console.log("closed")
                    }
                  }}
                  
                />
          
            </>
          )}

        </MDBCardBody>
        </MDBCard>
        </form>
        </div>
    
    </>
  )
}

export default UpdateEmail