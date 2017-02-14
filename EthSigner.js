global.self = global
import React from 'react';
import {
  Image,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
  AsyncStorage,
  Text,
} from 'react-native';
import Camera from 'react-native-camera';

import Modal from './src/components/Modal';
import KeyCreate from './src/components/dialogs/KeyCreate';
import TransactionInfo from './src/components/dialogs/TransactionInfo';
import Sign from './src/components/dialogs/Sign';
import Result from './src/components/dialogs/Result';

import { parseTransaction, toAddress, serialize, unserialize, ec } from './src/common';

const STORAGE_KEY = '@EthSigner:keys';

const testTx = 'f849808609184e72a00082271094000000000000000000000000000000000000000080a47f74657374320000000000000000000000000000000000000000000000000000006000571c8080';

export default class EthSigner extends React.Component {
  constructor(props) {
    super(props);
    this.camera = null;
    // AsyncStorage.removeItem(STORAGE_KEY)
    this.state = {
      keys: {},
      mode: 'loading',
      transaction: null,
      result: null,
      camera: {
        aspect: Camera.constants.Aspect.fill,
        captureTarget: Camera.constants.CaptureTarget.cameraRoll,
        type: Camera.constants.Type.back,
        orientation: Camera.constants.Orientation.auto,
        flashMode: Camera.constants.FlashMode.auto,
      },
    };
    AsyncStorage.getItem(STORAGE_KEY).then((storage) => {
      if (storage !== null) {
        const keys = unserialize(storage);
        if (Object.keys(keys).length) {
          this.setState({ mode: 'read', keys});
        }
      } else {
        this.setState({ mode: 'key_add' });
      }
    }).catch((error) => {
      debugger;
      this.setState({ mode: 'error', error: error, errorText: error.message});
    });

    setTimeout(() => this.parseTx({}), 3000); // temporary

  }

  setMode(mode, state = {}) {
    this.setState({mode, ...state})
  }

  addKey(phrase) {
    this.setState({ mode: 'loading' });
    const keys = this.state.keys;
    const privateKey = ec.keyFromPrivate(phrase);
    keys[toAddress(privateKey)] = privateKey;
    AsyncStorage.setItem(STORAGE_KEY, serialize(keys), () => {
      this.setState({ keys, mode: 'read' });
    })
  }

  parseTx({ data }) {
    if (this.state.mode !== 'read') {
      return undefined;
    }
    const transaction = parseTransaction(testTx);
    console.log(transaction);
    if (transaction) {
      this.setState({transaction, mode: 'preview'});
    }
  }

  createVault(password) {
  }

  sign(address) {

    this.setMode('result')
  }

  render() {
    const { keys, transaction, mode } = this.state;
    console.log(this.state)
    return (
      <View style={styles.container}>
        <StatusBar
          animated
          hidden
        />
        <Camera
          ref={(cam) => {
            this.camera = cam;
          }}
          style={styles.preview}
          aspect={this.state.camera.aspect}
          captureTarget={this.state.camera.captureTarget}
          type={this.state.camera.type}
          flashMode={this.state.camera.flashMode}
          defaultTouchToFocus
          mirrorImage={false}
          onBarCodeRead={ this.parseTx.bind(this) }
        />
        <Modal visible={'read' !== mode }>
          { 'loading' === mode && <View><Text>Loading...</Text></View> }
          { 'error' === mode && <View><Text>{ this.state.errorText }</Text></View> }
          { 'key_add' === mode && <KeyCreate onSubmit={ (phrase) => this.addKey(phrase) }
                                             onCancel={ () => this.setMode('read') }
                                             first={ !Object.keys(keys).length } /> }
          { 'preview' === mode && <TransactionInfo transaction={ transaction }
                                                   onSubmit={ () => this.setMode('sign') }
                                                   onCancel={ () => this.setMode('read') }
                                                  /> }
          { 'sign' === mode && <Sign transaction={ transaction }
                                     keys={ keys }
                                     onSubmit={ (address) => this.sign(address) }
                                     onCancel={ () => this.setMode('preview') }
                                     /> }
          { 'result' === mode && <Result transaction={ transaction }
                                         keys={ keys }
                                         onSubmit={ () => this.setMode('read') }
          /> }
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
});