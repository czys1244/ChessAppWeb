import './styles/SidebarButtons.css'
import {Link} from 'react-router-dom';
import {getAuthToken, setAuthHeader} from "../auth/auth.js";
import {useEffect, useState} from "react";
import {jwtDecode} from "jwt-decode";

export const SidebarButtons = ()=>{
    const [name, setName] = useState('Username');
    const [rating, setRating] = useState('---');
    useEffect(()=>{
        let token = getAuthToken();
        // console.log(jwtDecode(getAuthToken()))
        setName(jwtDecode(getAuthToken()).sub)
        fetch('/api/game/rating', {
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            }
        })
            .then(response=>{
                if (response.status === 200)
                    return response.json()
            })
            .then(json=>{
                setRating(json);
                console.log(json);
            })
            .catch(err=>{
                console.error(err)
            })
    }, []);
    return (
        <div className="sidebarButtons">
            <Link to="/home">
                <button className="sidebarButton">Play ranked</button>
            </Link>
            <Link to={"/invite"}>
                <button className="sidebarButton">Play with friend</button>
            </Link>
            <Link to={"/history"}>
                <button className="sidebarButton">History</button>
            </Link>
            <div className="username">
                <p>{name}</p>
                <p>Rank: {rating}</p>
            </div>
            <Link to={"/"}>
            <button onClick={()=>setAuthHeader("null")} className="sidebarButton">Log out</button>
            </Link>
        </div>

    )
}