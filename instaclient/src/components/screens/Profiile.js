import React, { useState, useEffect } from 'react'
import { API_URL } from '../../helper/Env';

export default function Profiile() {
    const [Profile, setProfile] = useState();
    const [Mypost, setMypost] = useState([]);
    const [namepic, setnamepic] = useState(null);
    const [File, setFile] = useState(null);

    const changeFile = (e) => {
        console.log(e.target.files);
        setFile(e.target.files[0]);
        formSubmit();

    }
    const formSubmit = ()=>{
        const data = new FormData();
        data.append("image",File);
        fetch(`${API_URL}/changepic`,{
            method:"post",
            headers:{
                "Authorization":"Barer "+localStorage.getItem('jwt')
            },
            body:data
        })
        .then(res => res.json())
        .then((response) => {
            console.log(response);
            setnamepic(response.image)
            // if(response.error){
            //     M.toast({html: response.error,classes:"#c62828 red darken-3"})
            // }else{
            //     M.toast({html: response.message,classes:"#c62828 green darken-3"});
            //     // history.push('/dashboard')
            // }
        })
        .catch((err) => {
            alert("something went wrong")
        })
    }

    const fetchmypost = () => {
        fetch(`${API_URL}/mypost`, {
            method: "get",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Barrer " + localStorage.getItem('jwt')
            },
        }).then(res => res.json())
            .then((result) => {
                setMypost(result.resp);
            })
            .catch((err) => {
                alert("something went wrong")
            })
    }

    const myProfile = () => {
        fetch(`${API_URL}/myprofile`, {
            method: "get",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Barrer " + localStorage.getItem('jwt')
            },
        }).then(res => res.json())
            .then((result) => {
                setProfile(result.resp);
                setnamepic(result.resp.pic)
            })
            .catch((err) => {
                console.log(err);
                alert("something went wrong")
            })
    }


    useEffect(() => {
        myProfile();
        fetchmypost();
    }, [])

    const filefire = ()=>{
        document.getElementById("fileupload").click()
    }

    return (
        <div className="main">
            <div style={{ maxWidth: '100%', width: "60vw", margin: "0px auto" }}>
                <div style={{ display: 'flex', justifyContent: 'space-around', margin: '18px 0px', borderBottom: '1px solid gray' }}>
                    <div>
                        <img onClick={filefire} style={{ width: '160px', height: '160px', borderRadius: '80px' }} src={Profile && `${API_URL}/profilepic/${Profile && namepic}`} alt="profile" srcSet="" />
                    </div>
                    <input className="hide" id="fileupload" name="file" onChange={changeFile} type="file" />
                    <div>
                        <h4>{Profile && Profile.name}</h4>
                        <p>{Profile && Profile.email}</p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', width: '300px', alignItems: 'center' }}>
                            <h6>{Mypost.length} Posts</h6>
                            <h6>{Profile && Profile.followers.length} followrs</h6>
                            <h6>{Profile && Profile.following.length} Following</h6>
                        </div>
                    </div>
                </div>

                <div className="gallery">
                    {
                        Mypost ? Mypost.map((ele, ind) => (
                            <img key={ind} className="item" src={`${API_URL}/uploads/${ele.photo}`} alt="" srcSet="" />
                        )) : null
                    }
                </div>
            </div>
        </div>
    )
}

