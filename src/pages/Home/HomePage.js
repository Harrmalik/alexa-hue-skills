// Dependencies
import React from 'react'
import $ from "jquery";
import map from 'lodash/map';
// import { bindActionCreators } from 'redux'
// import { connect } from 'react-redux'
// import { setCustomers, setUnlimiteds, selectCustomer, selectUnlimited } from '../../actions'

class HomePage extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
          lights: [],
          groups: [],
          sensors: []
        }

        this.refreshState = this.refreshState.bind(this)
        this.getState = this.getState.bind(this)
        this.toggleLight = this.toggleLight.bind(this)

        this.getState()
    }

    getState() {
        let component = this

        $.ajax({
            url: `http://localhost:3001/getLights/`
        }).done((lights) => {
            component.setState({lights})
        });

        $.ajax({
            url: `http://localhost:3001/getGroups/`
        }).done((groups) => {
            component.setState({groups})
        });

        $.ajax({
            url: `http://localhost:3001/getSensors/`
        }).done((sensors) => {
            component.setState({sensors})
        });
    }

    refreshState() {
        let component = this

        $.ajax({
            url: `./php/main.php?action=getCustomers`
        }).done((customers) => {
            component.refreshCustomers(customers);
        });
    }

    toggleLight(id, state) {
        let component = this,
            lights = this.state.lights

        $.ajax({
            url: `http://localhost:3001/updateLight/${id}`,
            method: 'put',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            // dataType: 'json',
            data: JSON.stringify({
                on: state
            })
        }).done((res) => {
            lights[id]['state'].on = state
            component.setState({lights})
        });
    }

    toggleGroup(id, state, groupLights) {
        let component = this,
            groups = this.state.groups,
            lights = this.state.lights

        $.ajax({
            url: `http://localhost:3001/updateGroup/${id}`,
            method: 'put',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            data: JSON.stringify({
                on: state
            })
        }).done((res) => {
            groups[id]['state'].any_on = state
            for (var i = 0; i < groupLights.length; i++) {
                lights[groupLights[i]]['state'].on = state
            }

            component.setState({groups, lights})
        });
    }

    render() {
        console.log(this.state.lights);
        return (
            <div className="container-fluid">
                <h2 className="ui header">Lights</h2>
                <table className="ui very basic table striped selectable compact">
                  <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Name</th>
                        <th scope="col">State</th>
                        <th scope="col">Color</th>
                    </tr>
                  </thead>
                  <tbody>
                    { map(this.state.lights, (l, id) => {
                        console.log(id);
                        let state = l.state.on.toString(),
                            color = state == 'true' ? 'green' : 'black'
                        return (
                            <tr key={id}>
                              <td>{id}</td>
                              <td><a href={`/#/light/${id}`}>{l.name}</a></td>
                              <td><span className={"ui circular label " + color} onClick={() => { this.toggleLight(id, !l.state.on) }}>{state}</span></td>
                              <td>{l.state.hue}</td>
                            </tr>
                        )
                    })}
                  </tbody>
                </table>

                <h2 className="ui header">Groups</h2>
                <table className="ui very basic table striped selectable compact">
                  <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Name</th>
                        <th scope="col">State</th>
                        <th scope="col">Color</th>
                    </tr>
                  </thead>
                  <tbody>
                    { map(this.state.groups, (g, id) => {
                        let state = g.state.any_on.toString(),
                            color = state == 'true' ? 'green' : 'black'

                        return (
                            <tr key={id}>
                              <td>{id}</td>
                              <td><a href={`/#/group/${id}`}>{g.name}</a></td>
                              <td><span className={"ui circular label " + color} onClick={() => { this.toggleGroup(id, !g.state.any_on, g.lights) }}>{state}</span></td>
                              <td>{g.lights}</td>
                            </tr>
                        )
                    })}
                  </tbody>
                </table>

                <h2 className="ui header">Sensors</h2>
                <table className="ui very basic table striped selectable compact">
                  <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Name</th>
                        <th scope="col">State</th>
                        <th scope="col">Last Checked</th>
                    </tr>
                  </thead>
                  <tbody>
                    { map(this.state.sensors, (s, id) => {
                        if (typeof s.state.presence === "boolean") {
                            let state = s.state.presence.toString(),
                                color = state == 'true' ? 'green' : 'black'
                            return (
                                <tr key={id}>
                                  <td>{id}</td>
                                  <td>{s.name}</td>
                                  <td><span className={"ui circular label " + color}>{state}</span></td>
                                  <td>{s.state.lastupdated}</td>
                                </tr>
                            )
                        }
                    })}
                  </tbody>
                </table>
            </div>
        )
    }
}

export default HomePage

// const mapStateToProps = state => ({
//     customers: state.customers,
//     unlimiteds: state.unlimiteds,
//     customer: state.customer,
//     unlimited: state.unlimited
// })
//
// const mapDispatchToProps = dispatch => ({
//     setCustomers: bindActionCreators(setCustomers, dispatch),
//     setUnlimiteds: bindActionCreators(setUnlimiteds, dispatch),
//     selectCustomer: bindActionCreators(selectCustomer, dispatch),
//     selectUnlimited: bindActionCreators(selectUnlimited, dispatch)
// })
//
// export default connect(
//     mapStateToProps,
//     mapDispatchToProps
// )(HomePage)
