import React, {useState} from 'react';
import axios from 'axios';
import {API_BASE_URL, ACCESS_TOKEN_NAME} from '../../constants/apiContants';
import { withRouter } from "react-router-dom";
import Axios from "axios";

function Profile(props) {
    const [state , setState] = useState({
        password : "",
        newPassword: "",
        ConfirmnewPassword: "",
        successMessage: null,
        email: ""
    })
    Axios.get(API_BASE_URL + "/user/me", {
        headers: { token: localStorage.getItem(ACCESS_TOKEN_NAME) },
      })
      .then(function(response) {
        //console.log(response);
        if(state.email.length < 1) {
        
            state.email = response.data.email
        
        if(response.status !== 200) {
          redirectToLogin();
        }}
      })
      .catch(function (error) {
        window.alert("Sessio aikakatkaistu. Palautetaan sisäänkirjautumiseen.");

        redirectToLogin();
      });
      
    
    const handleChange = (e) => {
        const {id , value} = e.target   
        setState(prevState => ({
            ...prevState,
            [id] : value
        }))
    }
    function redirectToLogin() {
        props.history.push("/login");
      }
      function redirectToHome() {
        props.history.push("/home");
      }

    const sendDetailsToServer = () => {

        if(state.password.length) {
            props.showError(null);
            console.log(state.email);
            const payload={
                "email":state.email,
                "password":state.password,
                "newPassword": state.newPassword,
                "ConfirmnewPassword": state.ConfirmnewPassword
            }
            axios.post(API_BASE_URL+'/user/reset', payload)
                .then(function (response) {
                    if(response.status === 200){
                        setState(prevState => ({
                            ...prevState,
                            'successMessage' : 'Salasanan vaihtaminen onnistui. Ohjataan kotisivulle..'
                        }))
                        props.showError(null);
                        window.alert("Salasanan vaihto onnistui. Ohjataan kotisivulle");
                        redirectToHome();
                    } else{
                        props.showError("Some error ocurred");
                    }
                })
                .catch(function (error) {
                    console.log(error);
                    props.showError("Salasana väärin!");
                });    
        } else {
            props.showError('Kirjoita salasana')    
        }
        
    }
    const handleSubmitClick = (e) => {
        e.preventDefault();
        if(state.newPassword === state.ConfirmnewPassword) {
            sendDetailsToServer()    
        } else {
            props.showError('Passwords do not match');
        }
    }
    return(
        <div className="card col-12 col-lg-4 login-card mt-2 hv-center">
            <form>
                <h3>Vaihda salasana</h3>

                <div className="form-group text-left">
                    <label htmlFor="exampleInputPassword1">Salasana</label>
                    <input type="password" 
                        className="form-control" 
                        id="password" 
                        placeholder="Password"
                        value={state.password}
                        onChange={handleChange} 
                    />
                </div>
                <div className="form-group text-left">
                    <label htmlFor="exampleInputPassword1">Uusi salasana</label>
                    <input type="password" 
                        className="form-control" 
                        id="newPassword" 
                        placeholder="New Password"
                        value={state.newPassword}
                        onChange={handleChange} 
                    />
                </div>
                <div className="form-group text-left">
                    <label htmlFor="exampleInputPassword1">Toista uusi salasana</label>
                    <input type="password" 
                        className="form-control" 
                        id="ConfirmnewPassword" 
                        placeholder="Confirm new Password"
                        value={state.ConfirmnewPassword}
                        onChange={handleChange} 
                    />
                </div>
                <button 
                    type="submit" 
                    className="btn btn-primary"
                    onClick={handleSubmitClick}
                >
                    Change password
                </button>

            </form>
            <div className="alert alert-success mt-2" style={{display: state.successMessage ? 'block' : 'none' }} role="alert">
                {state.successMessage}
            </div>
            
        </div>
    )
}

export default withRouter(Profile);