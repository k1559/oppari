import React, { Component } from "react";
import axios from "axios";
import { API_BASE_URL, ACCESS_TOKEN_NAME } from "../../constants/apiContants";
import "react-day-picker/lib/style.css";
import DataTable from "./data-table";

export default class GetUsers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userArray: [],
      selectedOption: "None",
    };
  }

  componentDidMount() {
    axios
      .get(API_BASE_URL + "/user/getall", {
        headers: { token: localStorage.getItem(ACCESS_TOKEN_NAME) },
      })
      .then((res) => {
        this.setState({ 
            userArray: res.data, 
            selectedOption: res.data[0].email
        });
        //console.log(this.state.userArray);
      })
      //console.log(this.state.userid + " data 2");
      .catch(function (error) {
        console.log(error);
      });
  }

  handleChange = ({ target }) => {
    this.setState({
      selectedOption: target.value
    });
    this.props.selectedOption(target.value);
  };

  dataTable() {
    return this.state.userArray.map((data, i) => {
      return <DataTable obj={data} key={i} />;
    });
  }

  render() {
    return (
      <div>
        <div className="container">
          <table className="table table-striped table-dark">
            <tbody>{this.dataTable()}</tbody>
          </table>
        </div>
        <span>{this.state.selectedOption}</span>
        <select value={this.state.selectedOption} onChange={this.handleChange}>
          {this.state.userArray.map(({ email, label }, index) => (
            <option value={email} key={email}>
              {email}
            </option>
          ))}
        </select>
      </div>
    );
  }
}
