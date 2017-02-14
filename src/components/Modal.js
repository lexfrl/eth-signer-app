import React, { Component } from 'react';
import { Modal as NativeModal, View, StyleSheet } from 'react-native';

export default class Modal extends Component {

  render() {
    const { height } = this.props;
    const extraStyles = height ? { height } : {};
    return (
      <NativeModal
        animationType={"fade"}
        transparent={false}
        { ...this.props }
      >
        <View style={[styles.container]}>
          <View style={[styles.innerContainer, extraStyles ]}>
            { this.props.children }
          </View>
        </View>
      </NativeModal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 1)',
  },
  innerContainer: {
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
});