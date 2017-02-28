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
  Button,
} from 'react-native';
import Camera from 'react-native-camera';

import Modal from './src/components/Modal';
import KeyCreate from './src/components/dialogs/KeyCreate';
import TransactionInfo from './src/components/dialogs/TransactionInfo';
import Sign from './src/components/dialogs/Sign';
import Result from './src/components/dialogs/Result';

import { decodeTransaction, getTxFields, toAddress, serialize, unserialize, ec, sign, fromPhrase } from './src/common';

const STORAGE_KEY = '@EthSigner:keys';

export default class EthSigner extends React.Component {
  constructor(props) {
    super(props);
    this.camera = null;
    this.state = {
      keys: {},
      mode: 'loading',
      transaction: null,
      result: null,
      signedTx: null,
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

  }

  setMode(mode, state = {}) {
    this.setState({mode, ...state})
  }

  addKey(phrase) {
    this.setState({ mode: 'loading' });
    const keys = this.state.keys;
    const key = fromPhrase(phrase)
    keys[toAddress(key)] = key;
    AsyncStorage.setItem(STORAGE_KEY, serialize(keys), () => {
      this.setState({ keys, mode: 'read' });
    })
  }

  parseTx({ data }) {
    if (this.state.mode !== 'read') {
      return undefined;
    }
    const transaction = decodeTransaction(data);
    if (transaction) {
      this.setState({transaction: data, mode: 'preview'});
    }
  }

  sign(address) {
    const { keys, transaction } = this.state;
    const signedTx = sign(keys[address], transaction).toString('hex');
    this.setMode('result', { signedTx }); // TODO: implement signing
  }

  render() {
    console.log(this.state);
    const { keys, transaction, mode, signedTx } = this.state;
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
          { 'preview' === mode && <TransactionInfo transaction={ getTxFields(transaction) }
                                                   onSubmit={ () => this.setMode('sign') }
                                                   onCancel={ () => this.setMode('read') }
                                                  /> }
          { 'sign' === mode && <Sign transaction={ getTxFields(transaction) }
                                     keys={ keys }
                                     onSubmit={ (address) => this.sign(address) }
                                     onCancel={ () => this.setMode('preview') }
                                     /> }
          { 'result' === mode && <Result transaction={ getTxFields(transaction) }
                                         signedTx={ signedTx }
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
  innerContainer: {
    position: 'absolute',
    backgroundColor: '#000',
    width: 360,
    height: 600,
    flex: 1,
    flexDirection: 'column',
    padding: 20,
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
});