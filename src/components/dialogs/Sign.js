import React, { Component } from 'react';
import { StyleSheet, Text, TextInput, View, ScrollView, Button, Picker } from 'react-native';
type Transaction = Object;

export default class Sign extends Component {

  props: {
    transaction: Transaction,
    keys: Object,
    onSubmit: Function,
    onCancel: Function,
  };

  state: {
    selectedAddress: string,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      selectedAddress: Object.keys(props.keys)[0]
    }
  }

  render() {
    const { keys, onSubmit, onCancel } = this.props;
    const { selectedAddress } = this.state;
    return (
      <View style={{ alignSelf: "stretch" }}>
        <Text style={styles.title}>Sign with</Text>
        <View style={ { marginTop: 5, marginBottom: 10, borderBottomWidth: 0.5, borderBottomColor: '#000' } } />
        <Text>Select an address to sign the scanned transaction with a corresponding private key</Text>
        <Picker
          selectedValue={ selectedAddress }
          onValueChange={(value) => this.setState({selectedAddress: value})}>
          { Object.keys(keys).map((address) =>
            <Picker.Item key={ address } label={ '0x' + address } value={ address } />
          ) }
        </Picker>
        <View style={ { flexShrink: 1, flexDirection: 'row', height: 40, justifyContent: 'space-between'} }>
          <Button
            title="Back"
            onPress={ onCancel }/>
          <Button
            title="Sign"
            onPress={ () => onSubmit(selectedAddress) } />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
  },
});