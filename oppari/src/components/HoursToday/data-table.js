import React, { Component } from 'react';
import axios from "axios";
import { API_BASE_URL} from "../../constants/apiContants";
class DataTable extends Component {
    render() {
        return (
            <tr className="table">
                <td>
                    {this.props.obj.hours}
                </td>
                <td>
                    {this.props.obj.minutes}
                </td>
                <td>
                    {this.props.obj.date.substring(0,10)}
                </td>
                <td>
                    {this.props.obj.textarea}
                </td>
                <td>
                    <button className="btn" value={this.props.obj._id} onClick={() => {
                        //console.log(this.props.obj._id);
                    axios.get(API_BASE_URL + "/mark/remove", {
                        params: {
                            markid: this.props.obj._id
                        }
                    }).then((res) => {
                        //console.log(res)
                        window.location.reload();
                    });
                    window.location.reload();
                    }}>
                        X
                    </button>
                </td>
            </tr>
        );
    }
}

export default DataTable;