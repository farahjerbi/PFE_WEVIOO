import React, { useEffect, useRef, useState } from 'react'
import { Button, DialogContent, Modal } from '@mui/material';
import ModalDialog from '@mui/joy/ModalDialog';
import Subject from "@mui/icons-material/Subject";
import AlternateEmail from "@mui/icons-material/AlternateEmail";
import Image from "@mui/icons-material/Image";
import EmailEditor, { EditorRef, EmailEditorProps } from 'react-email-editor';
import { ViewTemplateModalProps } from '../../../models/DeleteModels';
const ViewEmailTemplateSimple: React.FC<ViewTemplateModalProps> = ({templateDesign, template , onClose ,show }) => {
  const [open,setOpen]=useState<boolean>(show);
  const emailEditorRef = useRef<EditorRef | null>(null);

  useEffect(() => {
    setOpen(show);
}, [show]);

const toggleOpen = () =>{
  onClose();
  setOpen(false);
} 
const onLoad: EmailEditorProps["onLoad"] = (unlayer) => {
  console.log("onLoad", unlayer);
  unlayer.loadDesign(templateDesign);
  unlayer?.showPreview("desktop");
};
  return (
    <>
        <Modal open={open} onClose={() => setOpen(false)}>
        <ModalDialog >
          <DialogContent>
          {templateDesign && (
          <div className="">
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
          </div>
        )}
          {template && !templateDesign && (
                <div style={{border: "1px solid black", boxShadow: "0px 2px 5px rgba(0, 0, 1, 0.1)" }}>
            <div style={{ border: "1px solid black", padding: "5px", maxHeight: "30px"}} className="d-flex justify-content-between color_blue">
              <b style={{ fontSize: "13px" ,color:"snow" }}>Name Template:</b>
              <p style={{ fontSize: "13px",color:"snow"  }}>{template.name}</p>
            </div>

            <div style={{ border: "1px solid black", padding: "5px", maxHeight: "30px" }} className="d-flex justify-content-between ">
              <b style={{ fontSize: "13px" }}> Subject :</b>
              <p style={{ fontSize: "13px" }}>{template.templateBody.subject}</p>
            </div>

            <div style={{ border: "1px solid black", padding: "5px", minHeight: "300px" }} className="d-flex justify-content-between position-relative">
              <p className="mt-2" style={{ fontSize: "13px" }}>{template.templateBody.content}</p>
              <div style={{ position: "absolute", bottom: "3%", left: "4%" }}>
                <b style={{ marginRight: "3px" }}>B</b>
                <i style={{ marginRight: "5px" }}>I</i>
                <u>U</u>

              </div>
              <div style={{ position: "absolute", bottom: "3%", right: "4%" }}>
                  <Subject style={{ marginRight: "3px" ,fontSize:"16px"}}/>
                  <AlternateEmail style={{fontSize:"16px"}}/>
                  <Image style={{ marginLeft: "3px" ,fontSize:"16px"}}/>

                </div>
            </div>

                    
              
                </div>
              
              )}            </DialogContent>
         <Button style={{background: 'linear-gradient(90deg, rgba(106, 15, 255, 1) 0%, rgba(131, 89, 255, 1) 15%, rgba(168, 118, 230, 1) 35%, rgba(186, 155, 227, 1) 67%, rgba(234, 219, 247, 1) 100%)',color:"white"}} type="submit"  onClick={toggleOpen}>Close</Button>
        </ModalDialog>
      </Modal>
    </>
  )
}

export default ViewEmailTemplateSimple