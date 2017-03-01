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
      <Text style={ { fontSize: 11 } }>{ to }</Text>
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
      <View>
        <Text style={styles.title}>Scanned transaction</Text>
        <View style={{ paddingTop: 5, borderBottomWidth: 0.5, borderBottomColor: '#000' }} />
        <ScrollView style={{ marginTop: 10, flex: 1,flexGrow: 1}} >
          <TransactionView transaction={ transaction } />
        </ScrollView>
        <View style={{ flexDirection: 'row', height: 40, justifyContent: 'space-between'}}>
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
  title: {
    fontSize: 20,
  },
  small: {
    fontSize: 12,
  }
});