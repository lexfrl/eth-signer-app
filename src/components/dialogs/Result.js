import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, Picker, Clipboard } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { QrCode } from 'javascript-qrcode';

type Transaction = Object;

export default class Result extends Component {

  constructor(props, context) {
    super(props, context);
  }

  props: {
    transaction: Transaction,
    size: number,
  };

  render() {
    const { signedTx, onSubmit } = this.props;
    const code = new QrCode(signedTx);
    const qzone = 5;
    const msize = 2;
    const { d, width, height } = genSvgPath(code.getData(), msize, qzone);
    return (
      <View>
        <Text style={styles.title}>Signed transaction</Text>
        <View style={ { flexShrink: 1, marginTop: 5, marginBottom: 10, borderBottomWidth: 0.5, borderBottomColor: '#000' } } />
        <View style={ { flexShrink: 1, flexDirection: 'row', justifyContent: 'center'} }>
        <Svg height="200" width="200" viewBox={'0 0 ' + (width + 2 * qzone * msize) + ' ' + (height + 2 * qzone * msize) + ''}>
          <Path d={d} stroke="black" />
        </Svg>
        </View>
        <View style={ {} }>
          <Button
            style={{}}
            title="Copy to clipboard"
            onPress={ () => Clipboard.setString(signedTx) || this.setState({ copied: true }) }/>
        </View>
        <Text/>
        <Text/>
          <Button
            style={{}}
            title="Done"
            onPress={ onSubmit }/>
      </View>
    );
  }
}

Result.defaultProps = {
  size: 200,
};

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
  },
});

function genSvgPath(code, size = 3, quietZoneSize = 4) {
  const width = code.length * size;
  const height = code.length * size;
  let r, c;
  let d = '';

  for (r = 0; r < code.length; ++r) {
    for (c = 0; c < code[r].length; ++c) {
      if (code[r][c] === 1) {
        d += 'M' + ((c + quietZoneSize) * size) + ' ' + ((r + quietZoneSize) * size) + 'h' + size + 'v' + size + 'h-' + size + 'z';
      }
    }
  }
  return { d, width, height }
}