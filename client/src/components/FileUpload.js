import React, { useState } from 'react'
import axios from 'axios';
import Message from './Message';
import Progress from './Progress';

const FileUpload = () => {
    const [file, setFile] = useState("");
    const [filename, setFileName] = useState('choose file');
    const [uploadedfile, setUploadedfile] = useState({});
    const [uploadmsg, setUploadmsg] = useState('');
    const [uploadpercent, setUploadpercent] = useState(0);


    const onChange = (e) => {
        setFile(e.target.files[0]);
        setFileName(e.target.files[0].name);
        
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("file",file);
  
        try {
            const response = await axios.post('/upload',formData,{
                'Content-type' : 'multipart/form-data',
                onUploadProgress: ProgressEvent=> {
                   setTimeout(() => setUploadpercent(parseInt(Math.round((ProgressEvent.loaded * 100) / ProgressEvent.total))) ,500 )
                }
            })

            const {filename , filepath} = response.data;

            setUploadedfile({filename,filepath});
            setTimeout(() => {
                setUploadpercent(0)
            },8000)

            setUploadmsg("file Uploaded");

        } catch(err) {
            if(err) {
                if(err.response.status === 500) {
                    setUploadmsg("there was some problem with the server");
                }
                else {
                    setUploadmsg(err.response.data.msg);
                    setUploadedfile({});
                }
             }
             setUploadpercent(0);

        }
        
    }

    return (
        <>
        {uploadmsg? <Message msg={uploadmsg}/>: null}
            <form onSubmit={handleSubmit}>
                <div className='custom-file mb-4'>
                    <input
                        type='file'
                        className='custom-file-input'
                        id='customFile'
                        onChange={onChange}
                    />
                    <label className='custom-file-label' htmlFor='customFile'>
                        {filename}
                    </label>
                </div>

                <Progress percentage={uploadpercent}/>

                <input
                    type='submit'
                    value='Upload'
                    className='btn btn-primary btn-block mt-4'
                />
            </form>

            {uploadedfile? <div className='row mt-5'>
                <div className='col-md-6 m-auto'>
                    <h3 className='text-center'>{uploadedfile.filename}</h3>
                    <img style={{ width: '100%' }} src={uploadedfile.filepath} alt='' />
                </div>
            </div> : null }
        </>
    )
}

export default FileUpload
