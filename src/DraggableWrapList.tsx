import React, {useState, useEffect, useRef, useLayoutEffect} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import SafeAreaView, {SafeAreaProvider} from 'react-native-safe-area-view';
import {AppBar} from './AppBar';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {PanGestureHandler, State} from 'react-native-gesture-handler';
import {initialWindowSafeAreaInsets} from 'react-native-safe-area-context';

const setRandomBackground = () => {
  const arr = [];
  for (let i = 0; i < 3; i++) {
    arr.push(Math.round(Math.random() * 255));
  }
  return arr;
};

const setTextColor = (arr: number[]) => {
  const r = arr[0],
    g = arr[1],
    b = arr[2];
  let temp = 0;
  if (r === g && g === b) temp = r;
  else {
    temp = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }
  return temp < 128 ? 'white' : 'black';
};

const createItem = (label: string, value: string) => {
  const bgColor = setRandomBackground();
  const colorText = setTextColor(bgColor);
  return {
    label: label,
    value: value,
    backgroundColor: `rgb(${bgColor[0]}, ${bgColor[1]}, ${bgColor[2]})`,
    textColor: colorText,
  };
};

const items = [
  createItem('Math', 'Math'),
  createItem('Literature', 'Literature'),
  createItem('Physics', 'Physics'),
  createItem('History', 'History'),
  createItem('Geography', 'Geography'),
  createItem('Chemistry', 'Chemistry'),
];

const defaultTranslation = {x: 0, y: 0};

export default () => {
  const [selectedItems, setSelectedItems] = useState([]);

  const [unselectedItems, setUnselectedItems] = useState(items);

  const [movedIndex, setMovedIndex] = useState(-1);

  const [translation, setTranslation] = useState(defaultTranslation);

  const [rootTranslateBack, setRootTranslateBack] = useState(
    defaultTranslation,
  );

  const [triggeredMoving, setTriggeredMoving] = useState(-1);

  const [draggedSpacePos, setDraggedSpacePos] = useState({});

  const [refs, setRefs] = useState(
    useRef(unselectedItems.map(item => React.createRef())),
  );

  const [selectedRefs, setSelectedRefs] = useState(
    useRef(selectedItems.map(item => React.createRef())),
  );

  const [selectedView, setSelectedView] = useState('');

  const draggedSpaceRef = useRef();

  useEffect(() => {
    // console.log('...');
    // setRefs(useRef(unselectedItems.map(item => React.createRef())));
  }, [unselectedItems.length]);

  useEffect(() => {
    // setRefs(useRef(selectedItems.map(item => React.createRef())));
    console.log('Array change...');
    console.log(refs);
    console.log(selectedItems.length);
  }, [selectedItems.length]);

  useLayoutEffect(() => {
    if (draggedSpaceRef.current) {
      draggedSpaceRef.current.measure((ox, oy, width, height, dx, dy) => {
        setDraggedSpacePos({
          x: dx,
          y: dy,
          width: width,
          height: height,
        });
      });
    }
  }, [draggedSpaceRef.current]);

  const detectCurrLocation = (ox, oy, width, height, dx, dy) => {
    const {x: dsX, y: dsY, width: dsWidth, height: dsHeight} = draggedSpacePos;
    const centerX = dx + width / 2;
    const centerY = dy + height / 2;
    const xCalc = (centerX - dsX) * (centerX - dsX - dsWidth);
    const yCalc = (centerY - dsY) * (centerY - dsY - dsHeight);
    if (xCalc > 0 || yCalc > 0) {
      const {x, y} = translation;
      setRootTranslateBack({x, y});
      setTriggeredMoving(1);
    } else {
      const movedItem = unselectedItems[movedIndex];
      const tempArr = selectedItems;
      if (tempArr.find(item => item.value === movedItem.value) == null) {
        tempArr.push(movedItem);
      }
      setSelectedItems(tempArr);
      setUnselectedItems(
        unselectedItems.filter((item, index) => index !== movedIndex),
      );
      setTranslation(defaultTranslation);
      setRootTranslateBack(defaultTranslation);
      setSelectedView('');
      setMovedIndex(-1);
    }
  };

  useEffect(() => {
    const {x, y} = translation;
    if (triggeredMoving === -1) {
      setRootTranslateBack(defaultTranslation);
      setSelectedView('');
      setMovedIndex(-1);
      return;
    }
    const intervalId = setInterval(() => {
      if (triggeredMoving === 1 && x === 0 && y === 0) {
        setTriggeredMoving(-1);
      } else if (triggeredMoving === 1) {
        const {x: dx, y: dy} = rootTranslateBack;
        setTranslation({
          x: dx > 0 ? Math.max(x - dx / 40, 0) : Math.min(x - dx / 40, 0),
          y: dy > 0 ? Math.max(y - dy / 40, 0) : Math.min(y - dy / 40, 0),
        });
      }
    }, 8);
    return () => {
      clearInterval(intervalId);
    };
  }, [triggeredMoving, translation]);

  const onGestureTriggered = (nativeEvent: any) => {
    const {translationX: tX, translationY: tY} = nativeEvent;
    setTranslation({
      x: tX,
      y: tY,
    });
  };

  const onHandlerStateChangeTriggered = (
    nativeEvent: any,
    index: number,
    type: string,
  ) => {
    if (nativeEvent.state === State.BEGAN && movedIndex === -1) {
      setTriggeredMoving(0);
      setSelectedView(type);
      setMovedIndex(index);
    } else if (nativeEvent.state === State.END) {
      console.log(movedIndex);
      const tempRef = selectedView === 'selected' ? selectedRefs : refs;
      tempRef.current[movedIndex].current.measure(detectCurrLocation);
    }
  };

  const renderItem = (item: any, type: string, index: number) => {
    const isSelected = selectedView === type && movedIndex === index;
    return (
      <PanGestureHandler
        key={`${type}_${index}`}
        onGestureEvent={({nativeEvent}) => {
          onGestureTriggered(nativeEvent);
        }}
        onHandlerStateChange={({nativeEvent}) => {
          onHandlerStateChangeTriggered(nativeEvent, index, type);
        }}>
        <View
          ref={
            (selectedView === 'selected' ? selectedRefs : refs).current[index]
          }
          style={[
            styles.item,
            {
              backgroundColor: item.backgroundColor,
              transform: [
                {translateX: isSelected ? translation.x : 0},
                {translateY: isSelected ? translation.y : 0},
              ],
              zIndex: isSelected ? 1 : 0,
            },
          ]}>
          <Text style={[styles.text, {color: item.textColor}]}>
            {item.label}
          </Text>
        </View>
      </PanGestureHandler>
    );
  };

  return (
    <SafeAreaProvider>
      <AppBar
        leftIcon={<MaterialIcons size={24} color={'white'} name={'menu'} />}
        centerText
        title={'Draggable Wrap List'}
      />
      <View style={styles.mainView}>
        <View
          ref={draggedSpaceRef}
          style={styles.draggedSpace}
          onLayout={({nativeEvent}) => {
            setDraggedSpacePos(nativeEvent.layout);
          }}>
          {selectedItems.length > 0 ? (
            selectedItems.map((item, index) =>
              renderItem(item, 'selected', index),
            )
          ) : (
            <Text style={styles.hintText}>
              {'Select your favorite subject...'}
            </Text>
          )}
        </View>
        <View style={styles.selectionView}>
          {unselectedItems.map((item, index) =>
            renderItem(item, 'unselected', index),
          )}
        </View>
      </View>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  draggedSpace: {
    backgroundColor: 'transparent',
    marginVertical: 16,
    height: 200,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
  },
  item: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignSelf: 'baseline',
    marginBottom: 16,
    marginRight: 16,
    borderRadius: 100,
  },
  text: {
    fontSize: 16,
    fontWeight: '500',
  },
  selectionView: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  hintText: {
    fontSize: 20,
    color: 'rgb(64, 64, 64)',
  },
});
