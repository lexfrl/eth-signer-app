import React, { Component } from 'react';
import { StyleSheet, Text, TextInput, View, ScrollView, Button, Picker } from 'react-native';
import Svg, { Path, Rect, Circle } from 'react-native-svg';
import qr from 'javascript-qrcode';

type Transaction = Object;

export default class Result extends Component {

  props: {
    transaction: Transaction,
    size: number,
  };

  render() {
    const { signedTx, onSubmit } = this.props;
    const code = new qr.QrCode(signedTx);
    const qzone = 5;
    const msize = 2;
    const { d, width, height } = this.genSvgPath(code.getData(), msize, qzone);
    return (
      <View style={{ }}>
        <Text style={styles.title}>Signed transaction</Text>
        <View style={ { flexShrink: 1, marginTop: 5, marginBottom: 10, borderBottomWidth: 0.5, borderBottomColor: '#000' } } />
        <View style={ { flexShrink: 1, flexDirection: 'row', justifyContent: 'center'} }>
        <Svg height="200" width="200" viewBox={'0 0 ' + (width + 2 * qzone * msize) + ' ' + (height + 2 * qzone * msize) + ''}>
          <Path d={d} stroke="black" />
        </Svg>
        </View>

        <View style={ { flexShrink: 1, flexDirection: 'row',  height: 40, justifyContent: 'center'} }>
          <Button
            style={{}}
            title="Done"
            onPress={ onSubmit }/>
        </View>
      </View>
    );
  }

  genSvgPath(code, size = 3, quietZoneSize = 4) {
    const width = code.length * size;
    const height = code.length * size;
    let r, c;
    let d = '';

    for (r = 0; r < code.length; r += 1) {
      for (c = 0; c < code[r].length; c += 1) {
        if (code[r][c] === 1) {
          d += 'M' + ((c + quietZoneSize) * size) + ' ' + ((r + quietZoneSize) * size) + 'h' + size + 'v' + size + 'h-' + size + 'z';
        }
      }
    }
    return { d, width, height }
  }
}

Result.defaultProps = {
  size: 200,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    padding: 20,
  },
  innerContainer: {
    borderRadius: 10,
    alignItems: 'center',
  },
  transactionContainer: {
    height: 200,
  },
  transactionView: {
    flex: 1,
  },
  title: {
    fontSize: 20,
  },
});