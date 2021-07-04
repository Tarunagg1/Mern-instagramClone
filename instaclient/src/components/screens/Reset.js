import React, { useState, useContext } from 'react'
import { Link, useHistory } from 'react-router-dom'
import M from 'materialize-css';
import { API_URL } from '../../helper/Env';

export default function Reset() {

    const [email, setemail] = useState("")

    const history = useHistory();

    const formSubmit = () => {
        fetch(`${API_URL}/resetpassword`, {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({email})
        }).then(res => res.json())
            .then((response) => {
                console.log(response);
                if (response.error) {
                    M.toast({ html: response.error, classes: "#c62828 red darken-3" })
                } else {
                    M.toast({ html: response.message, classes: "#c62828 green darken-3" });
                    setemail("");
                }
            })
            .catch((err) => {
                console.log(err);
                alert("something went wrong")
            })
    }

    return (
        <div className="mycard">
            <div className="card auth-card">
                <h2>Instagram</h2>
                <input type="email" value={email} name="email" onChange={(e) => setemail(e.target.value)}  placeholder="Enter email" />
                <button onClick={formSubmit} className="btn waves-effect waves-light #64b5f6 blue lighten-2">Reset password</button>
                <h5>
                    <Link to="/"> have an acount?</Link>
                </h5>
            </div>
        </div>
    )
}
