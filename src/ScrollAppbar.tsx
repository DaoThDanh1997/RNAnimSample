/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {
  Animated,
  Dimensions,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import SafeAreaView, {SafeAreaProvider} from 'react-native-safe-area-view';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const str = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vel ultrices ante. Duis vulputate lorem non tortor pharetra, aliquet aliquet leo efficitur. Ut sed rutrum nisi. Pellentesque facilisis erat sit amet mi ornare, et dapibus tortor congue. Integer vulputate magna a vehicula accumsan. Cras nec nunc consequat, volutpat felis vitae, pulvinar nibh. Vestibulum lacinia in tortor vel maximus. Suspendisse semper dolor ligula. Praesent pellentesque suscipit enim, at dictum nisl pellentesque non. Phasellus nec consectetur magna. Interdum et malesuada fames ac ante ipsum primis in faucibus. Sed condimentum porttitor elit ut dignissim. Nunc nec libero a orci porttitor accumsan eget sed diam. Cras dignissim, nulla sed laoreet accumsan, mi quam egestas mauris, id posuere purus lorem sagittis purus. Duis sollicitudin neque ac aliquet sollicitudin.
In eros est, sollicitudin sit amet risus eget, porttitor pulvinar ipsum. Nulla eget quam arcu. Mauris vel odio cursus, hendrerit augue et, ultricies massa. Phasellus pharetra et libero id semper. Sed sollicitudin commodo mi, nec efficitur sem congue vitae. Ut pellentesque augue ut lacus finibus sollicitudin. Donec a auctor augue. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nullam vitae convallis nulla. Maecenas venenatis lorem at mi commodo pharetra. Mauris finibus hendrerit magna, sit amet ultrices turpis aliquet nec. Proin et diam suscipit, sollicitudin risus ac, porta nibh.
Aliquam pretium, elit maximus vehicula lobortis, neque dolor tempor nisl, sit amet interdum erat turpis eu metus. Sed semper libero ac diam finibus, ac interdum orci placerat. Donec nec erat ac erat rhoncus blandit. Nunc felis dui, semper eu porttitor in, porttitor vitae eros. In vel mattis est, vel molestie dui. Nulla semper nisl tempor scelerisque egestas. Duis faucibus, elit id accumsan aliquet, turpis felis scelerisque felis, quis tincidunt felis massa nec eros. Vivamus pellentesque congue velit finibus porttitor. Pellentesque eu mi lacinia sapien fermentum tincidunt sit amet eu nisl. Suspendisse pharetra ex in magna molestie venenatis.
Suspendisse non gravida tortor. Donec tristique ipsum eget arcu aliquet molestie. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nam cursus purus eget accumsan maximus. Duis eu iaculis arcu. Donec iaculis, sem vel condimentum maximus, lectus nisl pellentesque dolor, non ullamcorper sapien lectus sed enim. Aenean et leo nisi. Nulla viverra magna id luctus fermentum. Donec et mauris placerat, mollis elit lacinia, cursus lacus. Donec aliquet libero arcu, non consectetur elit maximus sit amet. Quisque lacinia, libero et fermentum rutrum, lorem arcu tincidunt ante, sed iaculis velit tortor non lacus.
Sed accumsan lectus laoreet mollis cursus. Phasellus sagittis vulputate erat, non tempus dui pellentesque vel. Fusce imperdiet nulla vitae mauris facilisis bibendum. Fusce vestibulum fringilla orci, sit amet euismod nunc eleifend id. Curabitur mattis dolor at odio maximus lacinia. Vivamus ornare lorem sed augue faucibus, vel volutpat lacus elementum. Suspendisse potenti.`;

const HEADER_EXPANDED_HEIGHT = 300;
const HEADER_COLLAPSED_HEIGHT = 100;
const HDIFF = HEADER_EXPANDED_HEIGHT - HEADER_COLLAPSED_HEIGHT;

const {width: SCREEN_WIDTH} = Dimensions.get('screen');

const clamp = (val: number, min: number, max: number) =>
  Math.min(Math.max(val, min), max);

interface Props {}

interface State {
  headerHeight: number;
  contentWidth: number;
  scrollY: number;
  iconScale: number;
  searchIconWidth: number;
  searchIconOpacity: number;
  searchIconScale: number;
}

export default class ScrollAppbar extends Component<Props, State> {
  constructor(props: any) {
    super(props);

    this.state = {
      headerHeight: HEADER_EXPANDED_HEIGHT,
      contentWidth: -1,
      scrollY: 0,
      iconScale: 1,
      searchIconWidth: -1,
      searchIconOpacity: 1,
      searchIconScale: 1,
    };
  }

  componentDidMount() {}

  _setContentFromScrollOffset = (dy: number) => {
    console.log(this.state);
    this.setState({
      headerHeight: clamp(
        HEADER_EXPANDED_HEIGHT - dy,
        HEADER_COLLAPSED_HEIGHT,
        HEADER_EXPANDED_HEIGHT,
      ),
      scrollY: clamp(dy, 0, HDIFF),
      iconScale: clamp((HDIFF - 0.52 * dy) / HDIFF, 0.48, 1),
      searchIconOpacity: clamp((HDIFF - dy) / HDIFF, 0, 1),
      searchIconScale: clamp((HDIFF - dy) / HDIFF, 0, 1),
    });
  };

  _setInitialContentWidth = (width: number) => {
    this.setState({
      contentWidth: width,
    });
  };

  _setInitialSearchIconWidth = (width: number) => {
    this.setState({
      searchIconWidth: width,
    });
  };

  render() {
    const {
      headerHeight,
      iconScale,
      searchIconOpacity,
      searchIconScale,
    } = this.state;
    const max =
      Dimensions.get('screen').width - 16 * 2 - this.state.contentWidth;
    return (
      <View style={styles.container}>
        <View style={[styles.header, {height: headerHeight}]}>
          <SafeAreaProvider>
            <SafeAreaView
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'red',
              }}>
              {this.state.headerHeight > HEADER_COLLAPSED_HEIGHT && (
                <Text
                  style={{
                    backgroundColor: 'blue',
                    includeFontPadding: false,
                    fontSize: 30 * this.state.searchIconScale,
                    color: 'white',
                    opacity: this.state.searchIconOpacity,
                  }}>
                  {'Hello React Native'}
                </Text>
              )}
              {this.state.headerHeight > HEADER_COLLAPSED_HEIGHT && (
                <Text
                  style={{
                    backgroundColor: 'blue',
                    includeFontPadding: false,
                    fontSize: 30 * this.state.searchIconScale,
                    color: 'white',
                    opacity: this.state.searchIconOpacity,
                  }}>
                  {'Hello React Native'}
                </Text>
              )}
              <View
                style={{
                  alignSelf: 'center',
                  alignItems: 'center',
                  flexDirection: 'row',
                  backgroundColor: 'green',
                  justifyContent: 'space-between',
                  marginHorizontal: 16,
                }}>
                <View
                  style={{
                    width: (max * this.state.scrollY) / HDIFF,
                    height: '100%',
                    backgroundColor: 'green',
                  }}></View>
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'blue',
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      backgroundColor: 'white',
                      alignItems: 'center',
                    }}
                    onLayout={({nativeEvent}) =>
                      this._setInitialContentWidth(nativeEvent.layout.width)
                    }>
                    {this.state.headerHeight > HEADER_COLLAPSED_HEIGHT && (
                      <MaterialIcons
                        size={50 * searchIconScale}
                        name={'search'}
                        color={'black'}
                        style={{opacity: searchIconOpacity}}
                      />
                    )}
                    <MaterialIcons
                      size={50 * iconScale}
                      name={'message'}
                      color={'black'}
                    />
                    <MaterialIcons
                      size={50 * iconScale}
                      name={'notifications-none'}
                      color={'black'}
                    />
                    <MaterialIcons
                      size={50 * iconScale}
                      name={'shopping-cart'}
                      color={'black'}
                    />
                  </View>
                </View>
              </View>
            </SafeAreaView>
          </SafeAreaProvider>
        </View>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          onScroll={({nativeEvent}) =>
            this._setContentFromScrollOffset(nativeEvent.contentOffset.y)
          }
          scrollEventThrottle={16}>
          <Text style={styles.title}>This is Title</Text>
          <Text style={styles.content}>{str}</Text>
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
  content: {
    fontSize: 24,
  },
  headerInner: {
    height: '100%',
  },
  outerHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
});
