# Trouble Shoot

## Component의 Layout 알아내기

<https://stackoverflow.com/questions/45744739/check-if-panresponder-value-exceeds-view-width>

Animated를 작동시키기 위해 View의 width, height, x, y 값을 알아내야 한다. 이를 위해 `onLayout` 이벤트를 사용한다.

```jsx
<View
  onLayout={event => {
    const { width, height, x, y } = event.nativeEvent.layout;
  }}
>
...
```

## PanResponder는 state에 반응하지 않을 가능성이 높다

### 이슈

PanResponder의 제스처에 따른 실행이 어떤 상태값에 따라 달라질 것으로 기대했으나 제대로 반응하지 않을 가능성이 높다.

사전에 정의한 state 값이 있다고 하자.<br />
이후 PanResponder의 `onPanResponderMove` 단계에서 해당 state 값을 변화시키고,
`onPanResponderRelease` 단계에서 state 값에 따른 조건분기를 하려는 경우,<br/>
`onPanResponderRelease`에 할당된 함수 내부에서는 state 값이 갱신/반영되지 않기 때문에,
함수가 디자인한대로 동작하지 않는다.

그렇다고 이를 해결하기 위해 PanResponder의 정의할 때 `useRef`로 감싸는 것이 아닌,
`useMemo`와 `dependency`를 사용하는 전략을 시도하려고 한다면 얼른 머리에서 지워버리자.
그 전략은 말이 안되는 방법이다.<br/>
PanResponder를 갱신하려는 시도이겠지만, 대개 제스처에 따라서 `dependency`의 내용이 바뀌는 로직이 될 것인데
그러면 PanResponder가 제스처 마다 re-define 되기 때문에 제스처 자체가 올바로 작동하지 못하게 된다.

## 원인

PanResponder는 `useRef`로 정의하는데 `useRef`로 정의한 변수는 리렌더링이 발생해도 재할당되지 않기 때문이다.
따라서 state 값을 업데이트 해도 PanResponder 내부에서 업데이트 된 state 값을 제대로 받아들이지 못한다.

## 해결 1

이 이슈는 PanResponder를 정의할 때 `useRef`를 사용하기 때문에 발생한다.

첫번째 방법으로, PanResponder의 Handler 함수가 state 변화에 반응하도록
Component를 Class Component로 만들면되지만 React는 공식적으로 Class Component를 추천하지 않는다.

따라서 두번째 방법으로 해결한다.<br/>
두번째 방법은 PanResponder 내부에서 trigger를 발생시켜 간접적으로 원하는 작업을 호출하도록 유도하는 방식이다.

PanResponder는 `useRef`로 정의한다.

PanResponder의 `onPanResponderMove` 단계에서 어떤 state를 업데이트 하고,
`onPanResponderRelease`에서 해당 state를 참조하여 어떤 기능을 수행하는 함수가 실행된다고 하자.

PanResponder의 `onPanResponderRelease`에서 수행할 함수 로직은 `onPanResponderRelease` 내부가 아닌 외부에 미리 선언한다.
그리고 `useEffect`를 이용해서 실행되도록 만들어주고 dependency로 새로운 state `trigger`를 달아준다.

그리고 `onPanResponderRelease`는
해당 `useEffect`를 trigger 시키는 state `trigger`를 `true`로 만드는 역할만 하도록 한다.<br/>
PanResponder 내부에서는 `setState`를 호출해도 state 값의 변화에 반응하지 않지만 외부에서는 정상적으로 업데이트 된다.

이렇게 간접적으로, `onPanResponderRelease`에 의해 state `trigger`가 `true`가 되면서
Release 제스처 로직을 수행할 외부의 `useEffect` 함수가 실행되도록 할 수 있다.

## 해결 2 - 트릭

개발하던 중에 우연히 트릭을 발견했다.
state를 아래처럼 쓰면 PanResponder 내부 함수에서도 변경된 state 값을 받아들일 수 있다.

```jsx
const [lighter, setLighter] = useState({isOn: false});

const PanResponder = useRef(
  PanResponder.create({
    onPanResponderMove: (event, gestureState) => {
      if(lighter.isOn) {
        console.log('lighter is On')
      } else {
        console.log('lighter is Off')
      }
    },
    ...
  })
).current;

...

const targetReached = () => {
  lighter.isOn = true;  // <-- 이 녀석이 트릭
  setLighter({ ...lighter });
};
```

위 함수에서 주석으로 "`<-- 이 녀석이 트릭`"이라 작성한 부분은 `state` 개념에서 봤을땐 아무 의미가 없다.<br/>
그러나 `PanResponder` 내부에서는 이 트릭으로 상태값 변수 `trigger`의 업데이트 된 값을 받아 올 수 있었다.

이것은 Java Object의 mutable 특성을 이용한 것이다.<br/>
단, PanResponder 외부에서 state 값이 올바로 작동하도록 하기위해 `setState`도 반드시 같이 호출하자.

## 애니메이션 정지 이슈

질문 워드를 오답 슬롯으로 Drag & Drop 하면,<br/>
오답을 표시하는 의미로, 오답 슬롯에 있는 아이콘이 좌우로 흔들리는 애니메이션(이하 "오답 Sake Animation"라 한다)이 발생한다.<br/>
그리고 질문 워드 또한 spring 애니메이션과 함께 다시 원래 자리(스크린 가운데)로 돌아간다.

이때, "오답 Sake Animation"은 일련의 animation들의 Composite Animation이다(`sequence` 사용)

### 이슈

* (제스처 1회차) 질문 워드를 오답슬롯으로 Drag & Drop 해서 "오답 Sake Animation"이 재생중 일 때,
* (제스처 2회차) 재빨리 질문 워드를 다시 터치하면 "오답 Sake Animation"이 중간에 즉시 정지한다.
* (제스처 3회차) 한편, 또다시 같은 과정을 다시 반복했을 때는, "오답 Sake Animation"이 정지하지 않고 정상작동한다.
* (제스처 n회차) 그이후로도 "오답 Sake Animation"은 정상작동한다.

### 해결

`Animated.reset()` 함수를 사용한다.<br/>
<https://reactnative.dev/docs/animated#reset>

* `reset`: Stops any running animation and resets the value to its original.

## TypeError: Cannot read property 'start' of undefined

### 이슈

컴포넌트가 re-render 된 후, 그 전에 한번 호출했던 어떤 `Animated`의 `start` 함수를 호출하면 발생하는 것으로 추정.

### 해결

* 해당 `Animated` 객체의 `start`를 호출하기 전에 `reset`을 호출한다.
* 해당 `Animated`가 `sequence`, `loop` 등으로 연결된 `Animated.CompositeAnimation`이라면 nested `Animated`들도 `reset` 해야 할 수 있다.
