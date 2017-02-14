import React, { Component } from 'react';
import { StyleSheet, Text, TextInput, View, ScrollView, Button, Picker } from 'react-native';

type Transaction = Object;

class TransactionView extends Component {

  props: {
    transaction: Transaction,
  };

  render() {
    const { transaction: { to, value, nonce, gasPrice, gasLimit } } = this.props;
    return <View>
      <Text style={ styles.small }>To address:</Text>
      <Text>{ to }</Text>
      <Text></Text>
      <Text style={ styles.small }>Amount:</Text>
      <Text>{ value }</Text>
      <Text></Text>
      <Text style={ styles.small }>Gas price:</Text>
      <Text>{ gasPrice }</Text>
      <Text></Text>
      <Text style={ styles.small }>Gas limit:</Text>
      <Text>{ gasLimit }</Text>
      <Text></Text>
      <Text style={ styles.small }>Nonce:</Text>
      <Text>{ nonce }</Text>
    </View>
  }
}

export default class TransactionInfo extends Component {

  props: {
    transaction: Transaction,
  };

  render() {
    const { transaction, onSubmit, onCancel } = this.props;
    return (
      <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'stretch', flexBasis: 400 }}>
        <Text style={styles.title}>Scanned transaction</Text>
        <View style={ { paddingTop: 5, borderBottomWidth: 0.5, borderBottomColor: '#000' } } />
        <ScrollView style={ styles.transactionContainer } >
          <TransactionView transaction={ transaction } />
        </ScrollView>
        <View style={ { flexShrink: 1, flexDirection: 'row', flexBasis: 40, justifyContent: 'space-between'} }>
          <Button
            style={{}}
            title="Dismiss"
            onPress={ onCancel }/>
          <Button
            style={{}}
            title="Proceed"
            onPress={ () => onSubmit() } />
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
    marginTop: 10,
    flex: 1,
    flexGrow: 1,
  },
  transactionView: {
    flex: 1,
  },
  title: {
    fontSize: 20,
  },
  small: {
    fontSize: 12,
  }
});