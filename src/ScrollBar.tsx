import React, {Component, createRef} from 'react';
import {
  Animated,
  Dimensions,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import ScrollBarHeader from './ScrollBarHeader';

const HEADER_EXPANDED_HEIGHT = 300;
const HEADER_COLLAPSED_HEIGHT = 120;
const HDIFF = 300 - 120;

const {width: SCREEN_WIDTH} = Dimensions.get('screen');

const str =
  'a\n\na\n\na\n\na\n\na\n\na\n\na\n\na\n\na\n\na\n\na\n\na\n\na\n\na\n\na\n\na\n\na\n\na\n\na\n\na\n\nz\n\n';

export default class ScrollBar extends Component {
  constructor(props: any) {
    super(props);

    this.state = {
      scrollY: new Animated.Value(0),
    };

    this.headerHeight = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_EXPANDED_HEIGHT - HEADER_COLLAPSED_HEIGHT],
      outputRange: [HEADER_EXPANDED_HEIGHT, HEADER_COLLAPSED_HEIGHT],
      extrapolate: 'clamp',
    });

    this.headerRef = createRef();
  }

  componentDidMount() {
    this.headerHeight.addListener(({value}: any) => {
      this.headerRef.current.setAnimOpacityState(
        (value - HEADER_COLLAPSED_HEIGHT) / HDIFF,
      );
    });
  }

  render() {
    const headerTitleOpacity = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_EXPANDED_HEIGHT - HEADER_COLLAPSED_HEIGHT],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    });
    const heroTitleOpacity = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_EXPANDED_HEIGHT - HEADER_COLLAPSED_HEIGHT],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });

    return (
      <View style={styles.container}>
        <Animated.View style={[styles.header, {height: this.headerHeight}]}>
          <ScrollBarHeader ref={this.headerRef} />
        </Animated.View>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          onScroll={Animated.event([
            {
              nativeEvent: {
                contentOffset: {
                  y: this.state.scrollY,
                },
              },
            },
          ])}
          scrollEventThrottle={16}>
          <Text style={styles.title}>This is Title</Text>
          <Text>{str}</Text>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eaeaea',
  },
  scrollContainer: {
    padding: 16,
    paddingTop: HEADER_EXPANDED_HEIGHT,
  },
  header: {
    backgroundColor: 'lightblue',
    position: 'absolute',
    width: SCREEN_WIDTH,
    top: 0,
    left: 0,
    zIndex: 9999,
  },
  title: {
    marginVertical: 16,
    color: 'black',
    fontWeight: 'bold',
    fontSize: 24,
  },
});
