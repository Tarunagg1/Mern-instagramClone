import React,{useState} from 'react'
import M from 'materialize-css';
import { API_URL } from '../../helper/Env';

export default function Createpost() {
    const [Input, setInput] = useState({
        title:"",
        body:""
    });

    const [File, setFile] = useState(null);

    const changeInput = (e)=>{
        setInput({...Input,[e.target.name]:e.target.value})
    }

    const changeFile = (e)=>{
        setFile(e.target.files[0]);
    }

    const formSubmit = ()=>{
        const data = new FormData();

        data.append('title',Input.title);
        data.append("body",Input.body);
        data.append("image",File);

        console.log('ij');
        fetch(`${API_URL}/createpost`,{
            method:"post",
            headers:{
                "Authorization":"Barer "+localStorage.getItem('jwt')
            },
            body:data
        })
        .then(res => res.json())
        .then((response) => {
            console.log(response);
            if(response.error){
                M.toast({html: response.error,classes:"#c62828 red darken-3"})
            }else{
                M.toast({html: response.message,classes:"#c62828 green darken-3"});
                // history.push('/dashboard')
            }
        })
        .catch((err) => {
            alert("something went wrong")
        })
    }

    return (
        <div className="mai">
            <div className="card input-filed" style={{ margin: '100px auto', maxWidth: '600px', padding: '20px', textAlign: 'center' }}>
                <input type="text" onChange={changeInput} name="title" placeholder="Enter title..." />
                <input type="text" onChange={changeInput} name="body" placeholder="Enter body.." />
                <div className="file-field input-field">
                    <div class="btn #64b5f6 blue darken-1">
                        <span>Upload image</span>
                        <input onChange={changeFile} type="file" />
                    </div>
                    <div className="file-path-wrapper">
                        <input name="file" className="file-path validate" type="text" />
                    </div>
                </div>
                <button onClick={formSubmit} className="btn waves-effect waves-light #64b5f6 blue darken-1">Submit post</button>
            </div>
        </div>
    )
}
