import React, { useState } from 'react'
import styles from './FileBox.module.css'

function FileBox(){

    const [isDragOver, setIsDragOver] = useState(false)

    const handleDropZoneClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const file = event.target.files[0];
            handleFileUpload(file);
        }
    };
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragOver(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragOver(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const file = e.dataTransfer.files[0];
            handleFileUpload(file);
        }
    };

    const handleFileUpload = (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        fetch('/upload', {
            method: 'POST',
            body: formData
        }).then(response => {
            if (response.ok) {
                response.blob().then(blob => {
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = '_removeBG.png';  
                    a.click();
                    window.URL.revokeObjectURL(url);
                });
            } else {
                console.error('File upload failed:', response.statusText);
                // Handle failure, e.g., show an error message
            }
        }).catch(error => {
            console.error('Error uploading file:', error);
        });
    };

    const fileInputRef = React.createRef<HTMLInputElement>();

    return(
        <div className={`${styles.dropZone} ${isDragOver ? styles.isDragOver : ''}`}
            onClick={handleDropZoneClick}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}>
            <h1>Remove background</h1>
            <form id="uploadForm" encType="multipart/form-data">
                <input id="fileInput" type="file" name="file" onChange={handleFileInputChange} ref={fileInputRef} />
                <input type="submit" value="rm" style={{ display: 'none' }} />
            </form>
        </div>
    )
}


export default FileBox