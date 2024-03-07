import React, { useRef, useState } from "react";
import EmailEditor from "react-email-editor"; 
import { EmailTemplate } from '../../../../models/EmailTemplate'
import { MDBBtn, MDBInput, MDBModal, MDBModalContent, MDBModalDialog, MDBModalFooter, MDBModalHeader, MDBModalTitle } from "mdb-react-ui-kit";
import { useAddTemplateEmailMutation } from "../../../../redux/services/emailApi";
import { toast } from "sonner";
import './EmailTemplate.css'
const EmailDragAndDrop: React.FC = () => {
  const emailEditorRef = useRef<any>(null); 
  const [isOpenMailModal, setIsOpenMailModal] = useState<boolean>(false); 
  const [mailContent, setMailContent] = useState<string>(""); 
  const [basicModal, setBasicModal] = useState(false);
  const[addTemplateEmail]=useAddTemplateEmailMutation();
  const initialState={
    name: '',
    language: '',
    subject:''
  }
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({...formData, [e.target.name]: e.target.value})
  }

  const [formData, setFormData] = useState(initialState);
  const {name,language,subject}=formData;
  const toggleOpen = () => setBasicModal(!basicModal);

  const exportHtml = () => {
    if (emailEditorRef.current !== null) {
      emailEditorRef.current.editor.exportHtml((data: any) => { 
        localStorage.setItem("newsletter", JSON.stringify(data));
        if (data.html) {
          console.log("🚀 ~ emailEditorRef.current.editor.exportHtml ~ data.html:", data.html)
          setMailContent(data.html);
          toggleMailModal();
        }
      });
    }
    setBasicModal(!basicModal);
  };

  const toggleMailModal = () => {
    setIsOpenMailModal((prevIsOpen) => !prevIsOpen);
  };

  const onLoad = () => {
    // Editor instance is created
    // You can load your template here
    // const templateJson = {};
    // emailEditorRef.current?.editor.loadDesign(templateJson);
  };


  const handleAddTemplate: (evt: React.FormEvent<HTMLFormElement>) => void = async (e) => {
    e.preventDefault();
    try {
      const emailTemplate: EmailTemplate = {
        name: formData.name,
        language: formData.language,
        state: 'PUBLIC',
        templateBody: {
          subject: formData.subject,
          content: mailContent
        }
      };
      
      const userData = await addTemplateEmail(emailTemplate).unwrap();
      console.log("🚀 ~ emailData:", userData);
      toast.success("Template added successfully");
      setFormData(initialState);
    } catch (error) {
      toast.error("Error! Yikes");
      console.error("🚀 ~ error:", error);
    }
  };

  return (
    <div className="Editor-container">
      <div className="export_button">
        <MDBBtn onClick={exportHtml}>Create Template Email</MDBBtn>
      </div>

      <EmailEditor
        editorId="editor_container"
        ref={emailEditorRef}
        onLoad={onLoad}
        minHeight={"74.5vh"}
      />
      <MDBModal open={basicModal} setOpen={setBasicModal} tabIndex='-1'>
        <MDBModalDialog>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>In order to complete the process, please fill this form</MDBModalTitle>
              <MDBBtn className='btn-close' color='none' onClick={toggleOpen}></MDBBtn>
            </MDBModalHeader>
            <form onSubmit={handleAddTemplate} style={{margin:"5px"}}>
              <MDBInput  name='name' value={name} onChange={handleChange} wrapperClass='mb-4' label='Template Name' id='form1' type='text'/>
              <MDBInput  name='language' value={language} onChange={handleChange} wrapperClass='mb-4' label='Language' id='form1' type='text'/>
              <MDBInput  name='subject' value={subject} onChange={handleChange} wrapperClass='mb-4' label='Subject' id='form1' type='text'/>
            <MDBModalFooter>
              <MDBBtn color='secondary' onClick={toggleOpen}>
                Close
              </MDBBtn>
              <MDBBtn type="submit">Save</MDBBtn>
            </MDBModalFooter>
            </form>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    </div>

  );
};

export default EmailDragAndDrop;
