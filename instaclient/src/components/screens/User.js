import React, { useState, useEffect, useContext } from 'react'
import { useParams } from 'react-router-dom';
import { API_URL } from '../../helper/Env';
import { userContext } from '../../App';
import { UPDATE } from '../../reducers/constant';
import M from 'materialize-css';

export default function User() {
    const [Profile, setProfile] = useState();
    const [Mypost, setMypost] = useState([]);
    const { userid } = useParams();
    const { state, dispatch } = useContext(userContext);
    const [ShowFollow, setShowFollow] = useState(true);

    const fetchmypost = () => {
        fetch(`${API_URL}/user/${userid}`, {
            method: "get",
            headers: {
                "Content-Type": "application/json",
            },
        }).then(res => res.json())
            .then((result) => {
                setProfile(result.user)
                setMypost(result.posts);
            })
            .catch((err) => {
                alert("something went wrong")
                M.toast({ html: err.error, classes: "#c62828 red darken-3" })

            })
    }

    const checkIsFollow = ()=>{
        state && state.following.following.map(ele => ele === userid && setShowFollow(false))
    }


    useEffect(() => {
        fetchmypost();
        checkIsFollow()
    }, [])

    const followUser = () => {
        fetch(`${API_URL}/follow`, {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Barrer " + localStorage.getItem('jwt')
            },
            body: JSON.stringify({ followid: userid })
        }).then(res => res.json())
            .then((result) => {
                // console.log(result);    
                const { following, followers } = result.following;
                dispatch({ type: UPDATE, payload: { following: following, followers: followers } });
                localStorage.setItem('user', JSON.stringify(result))
                // console.log("mypro",Profile);
                setProfile((prevstate) => {
                    return {
                        ...prevstate,
                        followers: result.followers.followers,
                        following: result.followers.following
                    }
                })
                setShowFollow(false);
            })
            .catch((err) => {
                M.toast({ html: err.error, classes: "#c62828 red darken-3" })
            })
    }

    const unFollowUser = () => {
        fetch(`${API_URL}/unfollow`, {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Barrer " + localStorage.getItem('jwt')
            },
            body: JSON.stringify({ followid: userid })
        }).then(res => res.json())
            .then((result) => {
                // console.log(result);
                const { following, followers } = result.following;
                dispatch({ type: UPDATE, payload: { following: following, followers: followers } });
                localStorage.setItem('user', JSON.stringify(result))

                setProfile((prevstate) => {
                    return {
                        ...prevstate,
                        followers: result.followers.followers,
                        following: result.followers.following
                    }
                })
                setShowFollow(true);

            })
            .catch((err) => {
                M.toast({ html: err.error, classes: "#c62828 red darken-3" })
            })
    }

    return (
        <div className="main">
            <div style={{ maxWidth: '100%', width: "60vw", margin: "0px auto" }}>
                <div style={{ display: 'flex', justifyContent: 'space-around', margin: '18px 0px', borderBottom: '1px solid gray' }}>
                    <div>
                        <img style={{ width: '160px', height: '160px', borderRadius: '80px' }} src={Profile && `${API_URL}/profilepic/${Profile.pic}`} alt="profile" srcSet="" />
                    </div>
                    <div>
                        <div className="sec" style={{ display: 'flex', height: '63px' }}>

                            <h4>{Profile && Profile.name}</h4>

                            {
                                ShowFollow ? (
                                    <button onClick={followUser} style={{ height: '33px', width: '102px', margin: '26px 12px', border: 'none', backgroundColor: '#0095f6', color: 'white', cursor: 'pointer' }}>Follow</button>
                                ) : (
                                    <button onClick={unFollowUser} style={{ height: '33px', width: '102px', margin: '26px 12px', border: 'none', backgroundColor: '#0095f6', color: 'white', cursor: 'pointer' }}>unfollow</button>
                                )
                            }

                            <button style={{ height: '33px', width: '35px', margin: '26px 0px', border: 'none', backgroundColor: '#0095f6', color: 'white', cursor: 'pointer' }}>
                                <i class="material-icons">arrow_drop_down</i>
                            </button>

                        </div>
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

