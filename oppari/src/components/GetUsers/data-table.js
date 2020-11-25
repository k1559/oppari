import React, { Component } from 'react';
class DataTable extends Component {


    render() {
        return (
            <tr>
                <td>
                    {this.props.obj.email}
                </td>
            </tr>
        );
    }
}

export default DataTable;