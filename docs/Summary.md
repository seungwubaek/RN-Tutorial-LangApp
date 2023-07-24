# Stacks

* Animated
* PanResponder
* Shadow

# Animated

* `Animated.Value`, `Animated.ValueXY`: 애니메이션에 사용할 변수
  * `addListener`: 변수의 변화 감지 후 액션
  * `interpolate`: interpolation을 통한 변수 변환값 생성
  * `getTranslateTransform`: `transform`에 사용할 수 있는 값으로 변환
  * `setOffset`: 변수의 변화값을 보존
  * `flattenOffset`: offset을 초기화
* `Animated` 액션 함수
  * `timing`: 시간에 따라 애니메이션 적용
  * `spring`: 스프링 애니메이션 적용
  * `decay`
  * `sequence`
  * `loop`
* `Animated` 액션 함수의 옵션
  * `useNativeDriver`: 네이티브 장비의 애니메이션 사용 여부
* `Animated.spring`의 옵션 <https://reactnative.dev/docs/animated#spring>
  * `restSpeedThreshold`, `restDisplacementThreshold`
    * 애니메이션을 정지로 취급하는 조건 설정
    * 애니메이션 속도(변화하는 초당 픽셀 수)가 특정 값보다 작으면 정지로 취급하며,
      그 정지취급지점으로부터(?) 특정 거리 이내로 들어오면 정지로 취급한다.
    * 보통 두 옵션을 함께 사용하는 것으로 추정. 각 옵션을 배타적으로 사용하면 제대로 작동하지 않는다. 다른 하나의 default가 `0.001` 이기 때문일 것으로 추정.
    * 두 옵션의 의미를 직관적으로 이해하기 어려움.

### Animated 규칙

* Animation에 사용할 변수는 `state`가 아닌 `Animated.Value`를 사용한다.
* Animation에 사용할 변수를 수정하려면 `Animated`의 API를 사용한다.
* Animation을 적용할 Component는 `Animated` API가 제공하는 Component(ex. `Animated.View`)를 사용한다.
* Styled Component와 같이 커스텀 Component에 Animation을 적용하고 싶다면 `Animated.createAnimatedComponent`를 사용한다.
* Animation이 완료됐을때, re-render가 일어나면서 Animation에 사용한 변수가 초기값으로 바뀌는 것을 방지하기 위해 `useRef`를 사용해서 변수의 변화한 값을 보존한다.

### 두개 애니메이션 중복

`TouchableOpacity`에 애니메이션을 추가하면, 자체의 Press Animation과 추가한 애니메이션이 동시에 일어나야하므로 부자연스러운 애니메이션이 발생한다. 따라서 하나의 `View`를 더 추가해서 각각 애니메이션을 분할적용 하도록 한다.

```jsx
import React from 'react';
import { TouchableOpacity, Animated } from 'react-native';
import styled from 'styled-components/native';

const StView = styled.View``;
const AniStView = Animated.createAnimatedComponent(StView);

const SomeComponent = () => {
  const position = new Animated.Value(0);

  const animationFn = () => {
    Animated.timing(position.y, {
      toValue: 200,
      useNativeDriver: true,
    }).start();
  };

  return (
    <TouchableOpacity onPress={animationFn}>
      <StView>
        <AniStView
          style={{
            transform: [...position.getTranslateTransform()],
          }}
        />
      </StView>
    </TouchableOpacity>
  );
};
```

### transform 순서

transform은 순서대로 적용된다(그래서 `Array`). 순서에 유의하자. 보통 `{...position.getTranslateTransform()}`을 먼저 적용한다.

* 예1: `translate`, `rotate`
  * `rotate`를 먼저하면 회전한 만큼 translate X, Y축이 회전한다.
* 예2: `translate`, `scale`
  * `scale`을 먼저하면 scale 값 만큼 translate 변화량이 증가/감소한다.

# PanResponder

아래처럼 컴포넌트에 제스처 기능을 부여하기위해, `panResponder` 객체의 `panHandlers`를 destructure해서 `View`의 props로 전달

```jsx
import React, { useRef } from 'react';
import { View, PanResponder } from 'react-native';

const SomeComponent = () => {
  const panResponder = useRef(PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderGrant: () => { ... },
    onPanResponderMove: () => { ... },
    ...
  })).current;

  return <View {...panResponder.panHandlers} />;
};
```

* Event Callbacks
  * `onStartShouldSetPanResponder`: 체스처 감지 on/off
  * `onPanResponderGrant`: 터치가 시작될 때 호출되는 함수
  * `onPanResponderMove`: 터치가 움직일 때 호출되는 함수
  * `onPanResponderRelease`: 터치가 끝날 때 호출되는 함수
  * `onPanResponderTerminate`: 터치가 취소될 때 호출되는 함수
  * `onShouldBlockNativeResponder`: 터치가 다른 Component에 의해 차단될 때 호출되는 함수

# Shadow

* Android vs iOS 설정법이 다름
  * Android: `elevation` 사용
  * iOS: `box-shadow` (or `shadowColor`, `shadowOffset`, `shadowOpacity`, `shadowRadius`)
* 두 Platform 간 자동 변환
  * <https://ethercreative.github.io/react-native-shadow-generator/>
* 아니면 3rd Party 라이브러리 사용
  * <https://github.com/SrBrahma/react-native-shadow-2>
