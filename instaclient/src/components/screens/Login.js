import React,{useState,useContext} from 'react'
import { Link,useHistory } from 'react-router-dom'
import M from 'materialize-css';
import { API_URL } from '../../helper/Env';
import {userContext} from '../../App';
import { USER } from '../../reducers/constant';

export default function Login() {
    const {dispatch}= useContext(userContext);

    const [inpuut, setinpuut] = useState({
        email:"",
        password:""
    })

    const history = useHistory();

    const changeInput = (e)=>{
        setinpuut({...inpuut,[e.target.name]:e.target.value})
    }

    const formSubmit = ()=>{
        fetch(`${API_URL}/signin`,{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(inpuut)
        }).then(res => res.json())
        .then((response) => {
            if(response.error){
                M.toast({html: response.error,classes:"#c62828 red darken-3"})
            }else{
                // console.log(data);
                const {data,token} = response;
                localStorage.setItem('jwt',token);
                localStorage.setItem('user',JSON.stringify(data));     
                dispatch({type:USER,payload:data})           
                M.toast({html: response.message,classes:"#c62828 green darken-3"});
                history.push('/dashboard')
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
                <input type="text" name="email" onChange={changeInput} value={inpuut.email} placeholder="Enter email" />
                <input type="password" name="password" onChange={changeInput} value={inpuut.password} placeholder="Enter password" />
                <div>
                    <Link to="/reset"><span style={{float:'right'}}>Forgot password</span></Link>
                </div>
                <button onClick={formSubmit} className="btn waves-effect waves-light #64b5f6 blue lighten-2">login</button>
                <h5>
                    <Link to="/signup">Don't have an acount?</Link>
                </h5>
            </div>
        </div>
    )
}
