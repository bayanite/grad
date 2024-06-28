// VideoUpload.js
import React, {useState} from 'react';
import {FaCloudUploadAlt, FaTrashAlt} from "react-icons/fa";
import {IoMdAdd} from "react-icons/io";
import './ContentOnlineCourses.scss'

const VideoUpload = ({
                         index,
                         handleFileUpload,
                         handleDeleteVideo,
                         handleVideoDragStart,
                         handleVideoDragOver,
                         handleVideoDrop,
                         content
                     }) => {
    return (
        <div className="dynamicContent-input-video">

            {content.videoFiles && content.videoFiles.length > 0 && (
                <div className="video-cont">
                    {content.videoFiles.map((file, fileIndex) => (
                        <div key={fileIndex}
                             draggable={true}
                             onDragStart={(e) => handleVideoDragStart(e, index, fileIndex)}
                             onDragOver={(e) => handleVideoDragOver(e)}
                             onDrop={(e) => handleVideoDrop(e, index, fileIndex)}>
                            <span onClick={() => handleDeleteVideo(index, fileIndex)}><FaTrashAlt/></span>
                            <span>{file.name}</span>
                            <span>{file.duration}</span>
                        </div>
                    ))}
                </div>
            )}
            <label htmlFor={`video-upload-${index}`}>
                <FaCloudUploadAlt className="add-icon"/>
                إضافة فيديوهات
            </label>
            <input
                id={`video-upload-${index}`}
                type="file"
                accept="video/*"
                multiple
                style={{display: 'none'}}
                onChange={(event) => handleFileUpload(index, event)}
            />
        </div>
    )
};
export default VideoUpload
