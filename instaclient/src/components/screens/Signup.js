import React,{useState} from 'react'
import {Link,useHistory} from 'react-router-dom';
import { API_URL } from '../../helper/Env';
import M from 'materialize-css';

export default function Signup() {
    const [inpuut, setinpuut] = useState({
        name:"",
        email:"",
        password:""
    })

    const history = useHistory();

    const changeInput = (e)=>{
        setinpuut({...inpuut,[e.target.name]:e.target.value})
    }

    const formSubmit = ()=>{
        
        fetch(`${API_URL}/signup`,{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(inpuut)
        }).then(res => res.json())
        .then((data) => {
            console.log(data);
            if(data.error){
                M.toast({html: data.error,classes:"#c62828 red darken-3"})
            }else{
                M.toast({html: data.message,classes:"#c62828 green darken-3"});
                history.push('/')
            }
        })
        .catch((err) => {
            alert("something went wrong")
        })
    }

    return (
        <div className="mycard">
        <div className="card auth-card">
            <h2>Instagram</h2>
            <input type="text" onChange={changeInput} value={inpuut.name} name="name" placeholder="Enter name" />
            <input type="text" onChange={changeInput} value={inpuut.email} name="email" placeholder="Enter email" />
            <input type="password" onChange={changeInput} value={inpuut.password} name="password" placeholder="Enter password" />
            <button onClick={formSubmit} className="btn waves-effect waves-light #64b5f6 blue lighten-2">login</button>        
            <h5>
                <Link to="/signin">Already have an acount?</Link>
            </h5>        
        </div>
    </div>
    )
}
