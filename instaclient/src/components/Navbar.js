import React, { useContext, useRef, useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom';
import { userContext } from '../App';
import { LOGOUT } from '../reducers/constant';
import M from 'materialize-css';
import { API_URL } from '../helper/Env';

export default function Navbar() {
    const [Search, setSearch] = useState("")
    const searchModal = useRef(null);
    const { state, dispatch } = useContext(userContext);
    const history = useHistory();
    const [FindUsers, setFindUsers] = useState([]);

    useEffect(() => {
        M.Modal.init(searchModal.current);
    }, [])

    const feetchUser = (query) => {
        setSearch(query);
        fetch(`${API_URL}/search`, {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ query: Search })
        })
            .then(response => response.json())
            .then((response) => {
                console.log(response);
                setFindUsers(response);
            })
            .catch((err) => {
                M.toast({ html: err.error, classes: "#c62828 red darken-3" })

            })
    }
    
    const logout = () => {
        localStorage.removeItem('jwt');
        localStorage.removeItem('user');
        dispatch({ type: LOGOUT });
        history.push('/');
    }

    const closeModal = ()=>{
        M.Modal.getInstance(searchModal.current).close()
        setSearch("");
        setFindUsers([])
    }
    const renderLinks = () => {
        if (state) {
            return [
                <li data-target="modal1" className="modal-trigger" style={{ color: 'black', marginTop: '2px', cursor: 'pointer' }}>
                    <i class="large material-icons">search</i>
                </li>,
                <li>
                    <Link to="/profile">
                        profile
                    </Link>
                </li>,
                <li>
                    <Link to="/createpost">
                        Post
                    </Link>
                </li>,
                <li>
                    <Link to="/myfollowerpost">
                        explore
                    </Link>
                </li>,
                <li>
                    <Link to="#" onClick={logout}>
                        Logout
                    </Link>
                </li>
            ]
        } else {
            return [
                <li>
                    <Link to="/">
                        Login
                    </Link>
                </li>,
                <li>
                    <Link to="/signup">
                        signup
                    </Link>
                </li>
            ]
        }
    }

    return (
        <>
            <nav style={{ position: 'fixed', top: '0', zIndex: '1' }}>
                <div class="nav-wrapper white">
                    <Link to={state ? "/dashboard" : "/"}>
                        <a href="#pok" className="brand-logo">Instagram</a>
                    </Link>
                    <ul id="nav-mobile" class="right hide-on-med-and-down">
                        {
                            renderLinks().map((ele, ind) => (
                                <span key={ind}>{ele}</span>
                            ))
                        }
                    </ul>
                </div>

                <div id="modal1" style={{ color: 'black' }} ref={searchModal} class="modal">
                    <div className="modal-content">
                        <input type="text" placeholder="search here.." value={Search} onChange={(e) => feetchUser(e.target.value)} />

                        <ul style={{ display: 'flex', flexDirection: 'column', color: 'black' }} className="collection">
                            {
                                FindUsers.length > 0 ? (
                                    FindUsers.map((ele,ind) => (
                                        <Link onClick={closeModal} to={ele._id !== state._id ? `/profile/${ele._id}` : "/profile"}>
                                            <li key={ind} className="collection-item">{ele.name}</li>
                                        </Link>
                                    ))
                                ) : (
                                    <li className="collection-item">No user yet...</li>
                                )
                            }
                        </ul>
                    </div>
                    <div className="modal-footer">
                        <a href="#!" className="modal-close waves-effect waves-green btn-flat">Close</a>
                    </div>
                </div>
            </nav>
        </>
    )
}
