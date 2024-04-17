import React, { useRef, useState } from "react";
import EmailEditor from "react-email-editor"; 
import { EmailTemplate } from '../../../../models/email/EmailTemplate'
import { useAddDesignTemplateMutation, useAddTemplateEmailMutation } from "../../../../redux/services/emailApi";
import { toast } from "sonner";
import './EmailTemplate.css'
import { useNavigate } from "react-router-dom";
import { LIST_EMAIL_TEMPLATES } from "../../../../routes/paths";
import BreadcrumSection from "../../../../components/BreadcrumSection/BreadcrumSection";
import Button from '@mui/joy/Button';
import Add from '@mui/icons-material/Add';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import DialogTitle from '@mui/joy/DialogTitle';
import DialogContent from '@mui/joy/DialogContent';
import Stack from '@mui/joy/Stack';
import { useDispatch } from "react-redux";
import { setEmail } from "../../../../redux/state/emailSlice";
import InstructionsModal from "../../../../components/modals/InstructionsModal";


const EmailDragAndDrop: React.FC = () => {
  
  const initialState={
    name: '',
    language: '',
    subject:''
  }
  
  const emailEditorRef = useRef<any>(null); 
  const [isOpenMailModal, setIsOpenMailModal] = useState<boolean>(false); 
  const [mailContent, setMailContent] = useState<string>(""); 
  const [basicModal, setBasicModal] = useState(false);
  const [templateDesign,setTemplateDesign]= useState<JSON>();
  const [formData, setFormData] = useState(initialState);
  const {name,language,subject}=formData;
  const[addTemplateEmail]=useAddTemplateEmailMutation();
  const[addDesignTemplate]=useAddDesignTemplateMutation();
  const navigate=useNavigate();
  const dispatch=useDispatch();
  const [open, setOpen] = React.useState<boolean>(false);
  const [openInstruction, setOpenInstruction] = React.useState<boolean>(true);




  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({...formData, [e.target.name]: e.target.value})
  }


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
      emailEditorRef.current.editor.saveDesign((data: any) => { 
        if (data) {
          console.log("🚀 ~ emailEditorRef.current.editor.saveDesign ~ data:", data)
          const templateDesignString =data; 
          setTemplateDesign(templateDesignString);       
         }
      });
    }
    setBasicModal(!basicModal);
  };


  const toggleMailModal = () => {
    setIsOpenMailModal((prevIsOpen) => !prevIsOpen);
  };

  const onLoad = () => {
    // if(templateDesign)
    // {
    //   emailEditorRef.current?.editor.loadDesign(templateDesign);
    // }
  };



  const handleAddTemplate: (evt: React.FormEvent<HTMLFormElement>) => void = async (e) => {
    e.preventDefault();
    try {
      const emailTemplate: EmailTemplate = {
        name: formData.name,
        language: formData.language,
        state: 'COMPLEX',
        templateBody: {
          subject: formData.subject,
          content: mailContent,
        }
      };
      
      const userData = await addTemplateEmail(emailTemplate).unwrap();
      dispatch(setEmail(emailTemplate))
    if (templateDesign) {
        const requestData = {
          jsonObject: templateDesign,
          id: userData.id
        };
        await addDesignTemplate(requestData);}
      console.log("🚀 ~ emailData:", userData);
      toast.success("Template added successfully");
      setFormData(initialState);
      setBasicModal(!basicModal);
      navigate(LIST_EMAIL_TEMPLATES)
    } catch (error) {
      toast.error("Error! Yikes");
      console.error("🚀 ~ error:", error);
    }
  };


  


  
  return (
    <>
      <BreadcrumSection/>
      <InstructionsModal show={openInstruction} onClose={()=>setOpenInstruction(false)}  />

    <div className="Editor-container">
      <div className="export_button">
        <Button
        size="sm"
        variant="outlined"
        color="primary"
        startDecorator={<Add />}
        onClick={() =>{exportHtml();setOpen(true)} }
      >
        New template
      </Button>
      </div>

      <EmailEditor
        editorId="editor_container"
        ref={emailEditorRef}
        onLoad={onLoad}
        minHeight={"74.5vh"}

      />
  
  <Modal open={open} onClose={() => setOpen(false)}>
        <ModalDialog>
          <DialogTitle>Create new template</DialogTitle>
          <DialogContent>Fill in the information of the template.</DialogContent>
          <form onSubmit={handleAddTemplate}>
            <Stack spacing={2}>
              <FormControl>
                <FormLabel>Name</FormLabel>
                <Input name='name' value={name} onChange={handleChange} autoFocus required />
              </FormControl>
              <FormControl>
                <FormLabel>Language</FormLabel>
                <Input name='language' value={language} onChange={handleChange} required />
              </FormControl>
              <FormControl>
                <FormLabel>Subject</FormLabel>
                <Input name='subject' value={subject} onChange={handleChange}  required />
              </FormControl>
              <Button type="submit">Submit</Button>
            </Stack>
          </form>
        </ModalDialog>
      </Modal>
    </div>
    </>
  );
};

export default EmailDragAndDrop;
