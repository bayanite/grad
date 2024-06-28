import React from 'react';
import './ContentOnlineCourses.scss';
import { FaFileUpload, FaTrashAlt } from "react-icons/fa";

const PdfUpload = ({ index, handleFileUploadPdf, handleDeletePdf, content }) => {
    return (
        <div className="dynamicContent-input-pdf">
            {content.pdfFiles && content.pdfFiles.length > 0 && (
                <div className="pdf-files">
                    {content.pdfFiles.map((file, fileIndex) => (
                        <div key={fileIndex}>
                            <span onClick={() => handleDeletePdf(index, fileIndex)}>
                                <FaTrashAlt />
                            </span>
                            <span>{file.name}</span>
                        </div>
                    ))}
                </div>
            )}
            <label htmlFor={`pdf-upload-${index}`}>
                <FaFileUpload className="add-icon" />
                إضافة ملفات
            </label>
            <input
                id={`pdf-upload-${index}`}
                type="file"
                accept=".pdf"
                multiple
                style={{ display: 'none' }}
                onChange={(event) => handleFileUploadPdf(index, event)}
            />
        </div>
    );
};

export default PdfUpload;
