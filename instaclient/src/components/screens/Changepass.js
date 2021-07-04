import React,{useState,useContext} from 'react'
import { Link,useHistory, useParams } from 'react-router-dom'
import M from 'materialize-css';
import { API_URL } from '../../helper/Env';
import {userContext} from '../../App';
import { USER } from '../../reducers/constant';

export default function Changepass() {
    const {dispatch}= useContext(userContext);

    const [inpuut, setinpuut] = useState({
        password:"",
        confirmpass:""
    })

    const history = useHistory();
    const {token} = useParams();
    console.log(token);

    const changeInput = (e)=>{
        setinpuut({...inpuut,[e.target.name]:e.target.value})
    }

    const formSubmit = ()=>{
        if(inpuut.password !== inpuut.confirmpass){
            M.toast({html: "password or confirm not match",classes:"#c62828 red darken-3"})
            return;
        }
        
        fetch(`${API_URL}/changepass`,{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({...inpuut,token})
        }).then(res => res.json())
        .then((response) => {
            console.log(response);
            if(response.error){
                M.toast({html: response.error,classes:"#c62828 red darken-3"})
            }else{
                M.toast({html: response.message,classes:"#c62828 green darken-3"});
            }
        })
        .catch((err) => {
            M.toast({html: "something went wrong",classes:"#c62828 red darken-3"})
        })
    }

    return (
        <div className="mycard">
            <div className="card auth-card">
                <h2>Instagram</h2>
                <input type="password" name="password" onChange={changeInput} value={inpuut.password} placeholder="Enter New Password" />
                <input type="text" name="confirmpass" onChange={changeInput} value={inpuut.confirmpass} placeholder="Confirm password" />
              
                <button onClick={formSubmit} className="btn waves-effect waves-light #64b5f6 blue lighten-2">Change</button>
                <h5>
                    <Link to="/signup">Don't have an acount?</Link>
                </h5>
            </div>
        </div>
    )
}
