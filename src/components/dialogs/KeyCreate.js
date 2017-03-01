import React, { Component } from 'react';
import { Text, TextInput, View, Button, StyleSheet } from 'react-native';

import { fromPhrase, toAddress } from '../../common'

export default class KeyCreate extends Component {

  props: {
    onSubmit: Function,
    onCancel: Function,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      phrase: '',
    }
  }

  render() {
    const { first, onSubmit, onCancel } = this.props;
    const { phrase } = this.state;
    return (
      <View style={ { alignSelf: "stretch" } }>
        <Text style={styles.title}>Create a new key (address)</Text>
        <View style={ { flexShrink: 1, marginTop: 5, marginBottom: 10, borderBottomWidth: 0.5, borderBottomColor: '#000' } } />
        <Text/>
        <Text>Enter the passphrase and keep it in secret</Text>
        <Text/>
        <TextInput
          autoFocus
          secureTextEntry={true}
          autoCorrect= { false }
          style={{height: 40}}
          placeholder="Secret passphrase"
          onChangeText={ (value) => this.setState({phrase: value}) }
          value={ phrase }  />
        <Text/>
        <Text style={styles.small}>{ phrase.length ? '0x' + toAddress(fromPhrase(phrase)) : '' }</Text>
        <Text/>
        <Button
          style={{height: 40}}
          title="Create"
          disabled={ phrase.length === 0 }
          onPress={ () => phrase && onSubmit(phrase) } />
        { !first && <Button
          title="Cancel"
          onPress={ onCancel }/> }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
  },
  small: {
    fontSize: 12,
  }
});