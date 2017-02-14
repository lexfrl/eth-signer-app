import React, { Component } from 'react';
import { Text, TextInput, View, Button, StyleSheet } from 'react-native';

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
      <View>
        <TextInput
          autoFocus
          style={{height: 40, width: 200}}
          placeholder="Enter passphrase"
          onChangeText={ (value) => this.setState({phrase: value}) }
          value={ phrase }  />
        <Button
          style={{height: 40}}
          title="Create"
          onPress={ () => phrase && onSubmit(phrase) } />
        { !first && <Button
          title="Cancel"
          onPress={ onCancel }/> }
      </View>
    );
  }
}

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
});