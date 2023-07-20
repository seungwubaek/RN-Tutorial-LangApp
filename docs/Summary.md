# Stacks

* Animated

# Animated

* `Animated.Value`, `Animated.ValueXY`: 애니메이션에 사용할 변수
  * `addListener`: 변수의 변화 감지 후 액션
  * `interpolate`: interpolation을 통한 변수 변환값 생성
* `Animated` 액션 함수
  * `timing`: 시간에 따라 애니메이션 적용
  * `spring`: 스프링 애니메이션 적용
  * `decay`
  * `sequence`
  * `loop`
* `Animated` 액션 함수의 옵션
  * `useNativeDriver`: 네이티브 장비의 애니메이션 사용 여부

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
  const posY = new Animated.Value(0);

  const animationFn = () => {
    Animated.timing(posY, {
      toValue: 200,
      useNativeDriver: true,
    }).start();
  };

  return (
    <TouchableOpacity onPress={animationFn}>
      <StView>
        <AniStView
          style={{
            transform: [{ translateY: posY }],
          }}
        />
      </StView>
    </TouchableOpacity>
  );
};
```
