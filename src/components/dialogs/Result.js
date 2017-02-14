import React, { Component } from 'react';
import { StyleSheet, Text, TextInput, View, ScrollView, Button, Picker } from 'react-native';

type Transaction = Object;

export default class Result extends Component {

  props: {
    transaction: Transaction,
  };

  render() {
    const { transaction, onSubmit } = this.props;
    return (
      <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'space-between', alignItems: 'stretch', flexBasis: 400, width: 290 }}>
        <Text style={styles.title}>Result</Text>
        <View style={ { flexShrink: 1, marginTop: 5, marginBottom: 10, borderBottomWidth: 0.5, borderBottomColor: '#000' } } />
        <Text style={ { flexGrow: 1}}>QR HERE</Text>
        <View style={ { flexShrink: 1, flexDirection: 'row',  height: 40, justifyContent: 'center'} }>
          <Button
            style={{}}
            title="Done"
            onPress={ onSubmit }/>
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