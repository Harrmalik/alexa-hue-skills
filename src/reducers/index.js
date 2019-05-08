import { combineReducers } from 'redux'

let defaultConfig = {
    hueIP: '192.168.0.18',
    hueUser: 'gDiIztNg3YZOQF3ASNLHlrDj7SppTwLT-12-C-cs'
}

defaultConfig["apiUrl"] = `http://${defaultConfig.hueIP}/api/${defaultConfig.hueUser}`;

function config (state = defaultConfig, action) {
    switch (action.type) {
        case 'UPDATE_CONFIG':
                return action.order

        default:
            return state
    }
}

const rootReducer = combineReducers({
   config
})

export default rootReducer
