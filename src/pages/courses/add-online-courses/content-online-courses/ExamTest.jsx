// PdfUpload.js
import React from 'react';
import './ContentOnlineCourses.scss'
import {IoMdAdd} from "react-icons/io";

const ExamAdd = ({index, content}) => (
    <div className={'dynamicContent-input-pdf'}>

        <label htmlFor={`pdf-upload-${index}`}>
            <IoMdAdd className="add-icon"/>
            إضافة اختبار
        </label>
        <input
            id={`pdf-upload-${index}`}
            type="file"
            accept=".pdf"
            multiple
            style={{display: 'none'}}
            // onChange={(event) => handleFileUploadPdf(index, event)}
        />

    </div>
);

export default ExamAdd;
