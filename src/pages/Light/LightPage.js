// Dependencies
import React from 'react'
import $ from "jquery";
import map from 'lodash/map';
// import { bindActionCreators } from 'redux'
// import { connect } from 'react-redux'
// import { setCustomers, setUnlimiteds, selectCustomer, selectUnlimited } from '../../actions'

class LightPage extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
          id: props.match.params.lightId,
          state: {}
        }

        this.getState = this.getState.bind(this)
        this.updateLight = this.updateLight.bind(this)

        this.getState()
    }

    getState() {
        let component = this

        $.ajax({
            url: `http://localhost:3001/getLights?light=${this.state.id}/`
        }).done((light) => {
            component.setState({...light})
        });
    }

    updateLight(e) {
        let component = this,
            light = this.state,
            target = e.target,
            newState = {}

        newState[target.name] = target.type === 'checkbox' ? target.checked : target.name.match(/hue|sat|bri|^ct$/) ? parseInt(target.value) : target.value

        $.ajax({
            url: `http://localhost:3001/updateLight/${this.state.id}`,
            method: 'put',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            data: JSON.stringify(newState)
        }).done((res) => {
            light['state'] = {
                ...light['state'],
                ...newState
            }
            component.setState({...light})
        })
    }

    render() {
        let light = this.state,
            state = light.state
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
                        <input type="checkbox" name="on" checked={state.on} onClick={this.updateLight} className="hidden"/>
                        <label> Is On?</label>
                      </div>
                    </div>

                    { state.on ?
                      <div>
                          <div className="field">
                            <label>Hue</label>
                            <input type="number" name="hue" defaultValue={parseInt(state.hue)} onBlur={this.updateLight} placeholder="First Name"/>
                          </div>

                          <div className="field">
                            <label>Brightness</label>
                            <input type="number" name="bri" defaultValue={parseInt(state.bri)} onBlur={this.updateLight} placeholder="First Name"/>
                          </div>

                          <div className="field">
                            <label>Saturation</label>
                            <input type="number" name="sat" defaultValue={parseInt(state.sat)} onBlur={this.updateLight} placeholder="First Name"/>
                          </div>

                          <div className="field">
                            <label>ct</label>
                            <input type="number" name="ct" defaultValue={parseInt(state.ct)} onBlur={this.updateLight} placeholder="First Name"/>
                          </div>

                          <div className="field">
                            <label>Effect</label>
                            <select name="effect" defaultValue={state.effect} onChange={this.updateLight} placeholder="First Name">
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

export default LightPage
