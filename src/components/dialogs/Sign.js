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
    const { transaction, keys, onSubmit, onCancel } = this.props;
    const { selectedAddress } = this.state;
    return (
      <View style={{ height: 320, width: 290}}>
        <Text style={styles.title}>Sign with</Text>
        <View style={ { marginTop: 5, marginBottom: 10, borderBottomWidth: 0.5, borderBottomColor: '#000' } } />
        <Text>Select an address to sign the scanned transaction with a corresponding private key</Text>
        <Picker
          style={{}}
          selectedValue={ selectedAddress }
          onValueChange={(value) => this.setState({selectedAddress: value})}>
          { Object.keys(keys).map((address) =>
            <Picker.Item key={ address } label={ address } value={ address } />
          ) }
        </Picker>
        <View style={{ flexBasis: 40, flex: 1, flexDirection: 'row', justifyContent: 'space-between' }} >
          <Button
            style={{}}
            title="Back"
            onPress={ onCancel }/>
          <Button
            style={{}}
            title="Sign"
            onPress={ () => onSubmit(selectedAddress) } />
        </View>
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
  transactionContainer: {
    flex: 1,
    flexGrow: 1,
  },
  transactionView: {
    flex: 1,
  },
  title: {
    fontSize: 20,
  },
});