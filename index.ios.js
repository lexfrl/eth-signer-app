// import './shim.js'
global.Buffer = require('buffer/').Buffer;
import React from 'react';
import { AppRegistry } from 'react-native';

import EthSigner from './EthSigner';

AppRegistry.registerComponent('EthSigner', () => EthSigner);
