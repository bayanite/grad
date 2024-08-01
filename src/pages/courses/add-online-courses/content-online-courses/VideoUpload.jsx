import React from 'react';
import { FaCloudUploadAlt, FaLink, FaTrashAlt } from "react-icons/fa";
import './ContentOnlineCourses.scss';

const VideoUpload = ({
                         index,
                         handleFileUpload,
                         handleDeleteVideo,
                         handleLinkExamWithVideo,
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
                            <span className={"cont_icon"}>
                            <span onClick={() => handleDeleteVideo(index, fileIndex)}><FaTrashAlt /></span>
                            {file.examTitle ? (
                                <span className="link-exam" onClick={() => handleLinkExamWithVideo(index, fileIndex)}>{file.examTitle}</span>
                            ) : (
                                <span className="link-exam" onClick={() => handleLinkExamWithVideo(index, fileIndex)}><FaLink /></span>
                            )}
                            </span>

                            <span>{file.name}</span>
                            <span>{file.duration}</span>
                        </div>
                    ))}
                </div>
            )}
            <label htmlFor={`video-upload-${index}`}>
                <FaCloudUploadAlt className="add-icon" />
                إضافة فيديوهات
            </label>
            <input
                id={`video-upload-${index}`}
                type="file"
                accept="video/*"
                multiple
                style={{ display: 'none' }}
                onChange={(event) => handleFileUpload(index, event)}
            />
        </div>
    );
};

export default VideoUpload;
