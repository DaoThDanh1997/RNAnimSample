import React from 'react';
import {StyleSheet, SafeAreaView, View, Text} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-view';

export const AppBar = (props: any) => {
  return (
    <SafeAreaView style={{backgroundColor: props.backgroundColor || '#2196F3'}}>
      <View style={styles.appBar}>
        <View style={styles.rowFlex}>{props.leftIcon}</View>
        {props.centerText && (
          <View style={{flex: 2, alignItems: 'center'}}>
            <Text style={[styles.centerTitle, props.titleStyle]}>
              {props.title || ''}
            </Text>
          </View>
        )}
        <View style={{...styles.rowFlex}}>{props.rightIcons}</View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  appBar: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  centerTitle: {
    fontSize: 20,
    color: 'white',
    fontWeight: '600',
    alignSelf: 'center',
  },
  rowFlex: {
    flex: 1,
  },
});
