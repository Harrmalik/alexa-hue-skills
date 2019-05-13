// Dependencies
import React from 'react'
import $ from "jquery";
import map from 'lodash/map';
// import { bindActionCreators } from 'redux'
// import { connect } from 'react-redux'
// import { setCustomers, setUnlimiteds, selectCustomer, selectUnlimited } from '../../actions'

class GroupPage extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
          id: props.match.params.groupId,
          action: {}
        }

        this.getState = this.getState.bind(this)
        this.updateLight = this.updateLight.bind(this)

        this.getState()
    }

    getState() {
        let component = this

        $.ajax({
            url: `http://localhost:3001/getGroups?group=${this.state.id}/`
        }).done((group) => {
            component.setState({...group})
        });
    }

    updateLight(e) {
        let component = this,
            group = this.state,
            target = e.target,
            newState = {}

        newState[target.name] = target.type === 'checkbox' ? target.checked : target.name.match(/hue|sat|bri|^ct$/) ? parseInt(target.value) : target.value

        $.ajax({
            url: `http://localhost:3001/updateGroup/${this.state.id}`,
            method: 'put',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            data: JSON.stringify(newState)
        }).done((res) => {
            group['action'] = {
                ...group['action'],
                ...newState
            }
            component.setState({...group})
        })
    }

    render() {
        let light = this.state,
            action = light.action
        console.log(this.state);
        return (
            <div className="container-fluid">
                <h2 className="ui header">{light.name}
                    <span className="sub header">{light.type}</span>
                </h2>

                <h3 className="ui header">State</h3>
                <form className="ui form">
                    <div className="field">
                      <div>
                        <input type="checkbox" name="on" checked={action.on} onClick={this.updateLight} className="hidden"/>
                        <label> Is On?</label>
                      </div>
                    </div>

                    { action.on ?
                      <div>
                          <div className="field">
                            <label>Hue</label>
                            <input type="number" name="hue" defaultValue={parseInt(action.hue)} onBlur={this.updateLight} placeholder="First Name"/>
                          </div>

                          <div className="field">
                            <label>Brightness</label>
                            <input type="number" name="bri" defaultValue={parseInt(action.bri)} onBlur={this.updateLight} placeholder="First Name"/>
                          </div>

                          <div className="field">
                            <label>Saturation</label>
                            <input type="number" name="sat" defaultValue={parseInt(action.sat)} onBlur={this.updateLight} placeholder="First Name"/>
                          </div>

                          <div className="field">
                            <label>ct</label>
                            <input type="number" name="ct" defaultValue={parseInt(action.ct)} onBlur={this.updateLight} placeholder="First Name"/>
                          </div>

                          <div className="field">
                            <label>Effect</label>
                            <select name="effect" defaultValue={action.effect} onChange={this.updateLight} placeholder="First Name">
                                <option value="none">None</option>
                                <option value="colorloop">Colorloop</option>
                            </select>
                          </div>
                      </div> : null
                    }
                </form>
            </div>
        )
    }
}

export default GroupPage
