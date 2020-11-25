import React, {useState} from 'react';
import axios from 'axios';
import {API_BASE_URL, ACCESS_TOKEN_NAME} from '../../constants/apiContants';
import { withRouter } from "react-router-dom";

function LoginForm(props) {
    const [state , setState] = useState({
        email : "",
        password : "",
        successMessage: null
    })
    const handleChange = (e) => {
        const {id , value} = e.target   
        setState(prevState => ({
            ...prevState,
            [id] : value
        }))
    }

    const handleSubmitClick = (e) => {
        e.preventDefault();
        const payload={
            "email":state.email,
            "password":state.password,
        }
        axios.post(API_BASE_URL+'/user/login', payload)
            .then(function (response) {
                if(response.status === 200){
                    setState(prevState => ({
                        ...prevState,
                        'successMessage' : 'Kirjautuminen onnistui. Ohjataan kotisivulle..'
                    }))
                    localStorage.setItem(ACCESS_TOKEN_NAME,response.data.token);
                    redirectToHome();
                    props.showError(null)
                }
                else if(response.code === 400){
                    props.showError("Username and password do not match");
                }
                else if(response.code === 400){
                    props.showError("Username does not exists");
                }
            })
            .catch(function (error) {
                console.log(error);
                setState(prevState => ({
                    ...prevState,
                    'successMessage' : 'Sähköposti ja salasana eivät ole oikeat.'
                }))
            });
    }
    const redirectToHome = () => {
        props.history.push('/home');
    }
    return(
        <div className="card col-12 col-lg-4 login-card mt-2 hv-center">
            <form>
                <div className="form-group text-left">
                <label htmlFor="exampleInputEmail1">Sähköposti</label>
                <input type="email" 
                       className="form-control" 
                       id="email" 
                       aria-describedby="emailHelp" 
                       placeholder="Sähköposti" 
                       value={state.email}
                       onChange={handleChange}
                />
                <small id="emailHelp" className="form-text text-muted">Tietojasi ei jaeta kenenkään kanssa.</small>
                </div>
                <div className="form-group text-left">
                <label htmlFor="exampleInputPassword1">Salasana</label>
                <input type="password" 
                       className="form-control" 
                       id="password" 
                       placeholder="Salasana"
                       value={state.password}
                       onChange={handleChange} 
                />
                </div>
                <div className="form-check">
                </div>
                <button 
                    type="submit" 
                    className="btn btn-primary"
                    onClick={handleSubmitClick}
                >Submit</button>
            </form>
            <div className="alert alert-success mt-2" style={{display: state.successMessage ? 'block' : 'none' }} role="alert">
                {state.successMessage}
            </div>

        </div>
    )
}

export default withRouter(LoginForm);