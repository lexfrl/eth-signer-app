import React, { Component } from 'react';
import { Modal as NativeModal, View, StyleSheet } from 'react-native';

export default class Modal extends Component {

  render() {
    const { height } = this.props;
    const extraStyles = height ? { height } : {};
    return (
      <NativeModal
        onRequestClose={() => {}}
        animationType={"fade"}
        transparent={true}
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
  },
  innerContainer: {
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.97)',
    padding: 20,
  },
});