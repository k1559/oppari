import React, { Component } from "react";
import { API_BASE_URL, ACCESS_TOKEN_NAME } from "../../constants/apiContants";
import axios from "axios";
import fileDownload from "js-file-download";

class Download extends Component {
  componentDidMount() {
    axios
      .get(API_BASE_URL + "/user/me", {
        headers: { token: localStorage.getItem(ACCESS_TOKEN_NAME) },
      })
      .then((res) => {
        this.setState({
          userid: res.data.response,
          useremail: res.data.email,
        });
        axios
          .get(API_BASE_URL + "/mark/download", {
            params: {
              testi: "testi",
              userid: this.state.userid,
            },
          })
          .then((res) => {
            //console.log(res.data);
            //console.log(this.state.userid + " data 2");
          })
          .catch(function (error) {
            console.log(error);
          });
      });
  }
  handleDownload = (url, filename) => {
    axios
      .get(url, {
        responseType: "blob",
      })
      .then((res) => {
        fileDownload(res.data, filename);
      });
  };
  render() {
    return (
      <div>
        <h2>Moikkamoi</h2>
        <button
          onClick={() => {
            this.handleDownload(
              "/files/" + this.state.userid +".csv",
              this.state.userid + ".csv"
            );
          }}
        >
          Download CSV
        </button>
      </div>
    );
  }
}

export default Download;
