import React from 'react';
import {StyleSheet, SafeAreaView, View, Text, Animated} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-view';

export default class ScrollBarHeader extends React.Component {
  constructor(props: any) {
    super(props);

    this.state = {
      opacityState: new Animated.Value(1),
      headerScale: 1,
    };

    this.setAnimOpacityState = this.setAnimOpacityState.bind(this);
  }

  setAnimOpacityState = (value: number) => {
    console.log(value);
    this.setState({
      headerScale: value,
    });
    Animated.timing(this.state.opacityState, {
      toValue: value,
      duration: 0,
    }).start();
  };

  renderSideFlexView = () => {
    const flex = this.state.opacityState.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 0.1],
    });
    return (
      <Animated.View style={[styles.sideFlex, {flex: flex}]}></Animated.View>
    );
  };

  renderInnerLeftFlex = () => {
    const flex = this.state.opacityState.interpolate({
      inputRange: [0, 1],
      outputRange: [6, 1],
    });
    const fontSz = this.state.opacityState.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 12],
    });
    const iconSz = this.state.opacityState.interpolate({
      inputRange: [0, 1],
      outputRange: [16, 50],
    });
    const mBottom = this.state.opacityState.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 5],
    });
    return (
      <Animated.View
        style={{...styles.innerFlex, backgroundColor: 'green', flex: flex}}>
        <Animated.View
          style={[
            styles.iconBtn,
            {width: iconSz, height: iconSz, marginBottom: mBottom},
          ]}></Animated.View>
        {this.state.headerScale > 0 && (
          <Animated.Text style={{fontSize: fontSz}}>{'Tim kiem'}</Animated.Text>
        )}
      </Animated.View>
    );
  };

  renderRightIcon = (title: string) => {
    const fontSz = this.state.opacityState.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 12],
    });
    const iconSz = this.state.opacityState.interpolate({
      inputRange: [0, 1],
      outputRange: [22, 50],
    });
    const mBottom = this.state.opacityState.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 5],
    });
    return (
      <View style={styles.innerFlex}>
        <Animated.View
          style={[
            styles.iconBtn,
            {width: iconSz, height: iconSz, marginBottom: mBottom},
          ]}></Animated.View>
        {this.state.headerScale > 0 && (
          <Animated.Text numberOfLines={1} style={{fontSize: fontSz}}>
            {title}
          </Animated.Text>
        )}
      </View>
    );
  };

  renderTitle = () => {
    const fontSz = this.state.opacityState.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 20],
    });
    return this.state.headerScale > 0 ? (
      <Animated.Text
        style={{
          fontWeight: 'bold',
          color: 'white',
          fontSize: fontSz,
        }}>
        {'Hello Minh!'}
      </Animated.Text>
    ) : null;
  };

  renderSubtitle = () => {
    const fontSz = this.state.opacityState.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 15],
    });
    const mBottom = this.state.opacityState.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 19],
    });
    const mTop = this.state.opacityState.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 13],
    });
    return this.state.headerScale > 0 ? (
      <Animated.Text
        style={{
          color: 'white',
          fontSize: fontSz,
          marginBottom: mBottom,
          marginTop: mTop,
        }}>
        {'What do you want to learn today?'}
      </Animated.Text>
    ) : null;
  };

  render() {
    return (
      <SafeAreaView style={{backgroundColor: '#2196F3'}}>
        <View style={styles.appBar}>
          <View style={styles.appBarContentView}>
            {this.renderTitle()}
            {this.renderSubtitle()}
            <View style={styles.row}>
              {this.renderSideFlexView()}
              <View style={{flexDirection: 'row', flex: 1}}>
                {this.renderInnerLeftFlex()}
                {this.renderRightIcon('Thong bao')}
                {this.renderRightIcon('Tin nhan')}
                {this.renderRightIcon('Gio hang')}
              </View>
              {this.renderSideFlexView()}
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  appBar: {
    height: '100%',
    paddingHorizontal: 16,
  },
  appBarContentView: {
    backgroundColor: 'red',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    width: '100%',
    // alignItems: 'center',
    justifyContent: 'space-between',
  },
  sideFlex: {
    flex: 0.1,
    backgroundColor: 'white',
  },
  innerFlex: {
    flex: 1,
    backgroundColor: 'blue',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBtn: {
    backgroundColor: 'white',
    marginBottom: 5,
    borderRadius: 18,
    alignSelf: 'center',
  },
});
