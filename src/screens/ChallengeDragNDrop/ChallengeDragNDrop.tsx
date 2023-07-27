import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Dimensions, PanResponder, Animated, Easing } from 'react-native';
import { StatusBar } from 'react-native';

// Components
import Loader from '~/components/molecules/Loader';
import WordSlotContainer from '~/components/organisms/WordSlotContainer';
import CenterSlotContainer from '~/components/organisms/CenterSlotContainer';

// Helpers
import {
  checkAnswer,
  generateDropPosition,
  getWordSamples,
} from '~/helpers/challenge';

// Types
import { TabScreenProps } from '~/types/react-navigation';
import { Word, LayoutRect } from '~/types/challenge';

// Styles
import { StViewContainer } from './ChallengeDragNDrop.style';
import {
  SLOT_PADDING,
  SLOT_SIZE,
} from '~/components/organisms/WordSlotContainer/WordSlotContainer.style';

// Values
const { width: WINDOW_WIDTH, height: WINDOW_HEIGHT } = Dimensions.get('window');

const ChallengeDragNDrop: React.FC<TabScreenProps<'ChallengeDragNDrop'>> = (
  props
) => {
  // States
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [wordSamples, setWordSamples] = useState<Array<Word>>([]);
  const [questionWord, setQuestionWord] = useState<Word>({
    en: '',
    ko: '',
    icon: 'ellipsis-horizontal',
  });
  let [questionSlotHighlighterSwitch, setQuestionSlotHighlighterSwitch] =
    useState<boolean>(false);
  const [answerCheckTrigger, setAnswerCheckTrigger] = useState<boolean>(false);
  const [dropPosition, setDropPosition] = useState<string>('');
  const [wordSlotHighlighterSwitches, setWordSlotHighlighterSwitches] =
    useState<LayoutRect<boolean>>({
      topLeft: false,
      topRight: false,
      bottomLeft: false,
      bottomRight: false,
    });
  const [triggerQuestionResponderRelease, setTriggerQuestionResponderRelease] =
    useState<boolean>(false);

  useEffect(() => {
    setWordSamples(getWordSamples());
  }, []);

  const getQuestionWord = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * wordSamples.length);
    return wordSamples[randomIndex];
  }, [wordSamples]);

  useEffect(() => {
    setQuestionWord({ ...getQuestionWord() });
  }, [getQuestionWord]);

  // Values
  const screenHeightNoNav = useRef<number>(
    WINDOW_HEIGHT -
      (props.route.params.navHeight ?? 0) -
      (StatusBar.currentHeight ?? 0)
  ).current;
  // Values - Question
  const questionThresholdCoordTop = useRef<number>(
    screenHeightNoNav / 4
  ).current;
  const questionThresholdCoordBottom = useRef<number>(
    (screenHeightNoNav / 4) * 3
  ).current;
  const questionThresholdCoordLeft = useRef<number>(
    SLOT_PADDING + SLOT_SIZE
  ).current;
  const questionThresholdCoordRight = useRef<number>(
    WINDOW_WIDTH - SLOT_PADDING - SLOT_SIZE
  ).current;
  const questionPosition = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const questionScale = useRef(new Animated.Value(1)).current;
  const questionOpacity = useRef(new Animated.Value(0)).current;
  // Values - Question Slot Highlighter
  const questionSlotHighlighterScale = useRef(new Animated.Value(0)).current;
  const questionSlotHighlighterOpacity = useRef(
    new Animated.Value(0.35)
  ).current;
  // Values - Answer Check Slot
  const answerCheckSlotScale = useRef(new Animated.Value(0)).current;
  const answerCheckSlotOpacity = useRef(new Animated.Value(0)).current;
  const answerReminderSlotPosition = useRef(
    new Animated.ValueXY({ x: 0, y: 0 })
  ).current;
  const answerReminderSlotScale = useRef(new Animated.Value(0)).current;
  const answerReminderSlotOpacity = useRef(new Animated.Value(0)).current;
  // Values - Word Slots
  const wordSlotOpacities = useRef<LayoutRect<Animated.Value>>({
    topLeft: new Animated.Value(1),
    topRight: new Animated.Value(1),
    bottomLeft: new Animated.Value(1),
    bottomRight: new Animated.Value(1),
  }).current;
  const wordSlotIconPositions = useRef<LayoutRect<Animated.ValueXY>>({
    topLeft: new Animated.ValueXY({ x: 0, y: 0 }),
    topRight: new Animated.ValueXY({ x: 0, y: 0 }),
    bottomLeft: new Animated.ValueXY({ x: 0, y: 0 }),
    bottomRight: new Animated.ValueXY({ x: 0, y: 0 }),
  }).current;
  const wordSlotIconOpacities = useRef<LayoutRect<Animated.Value>>({
    topLeft: new Animated.Value(0),
    topRight: new Animated.Value(0),
    bottomLeft: new Animated.Value(0),
    bottomRight: new Animated.Value(0),
  }).current;
  // Values - Word Slot Highlighters
  const wordSlotHighlighterScales = useRef<LayoutRect<Animated.Value>>({
    topLeft: new Animated.Value(0),
    topRight: new Animated.Value(0),
    bottomLeft: new Animated.Value(0),
    bottomRight: new Animated.Value(0),
  }).current;
  const wordSlotHighlighterOpacities = useRef<LayoutRect<Animated.Value>>({
    topLeft: new Animated.Value(0.35),
    topRight: new Animated.Value(0.35),
    bottomLeft: new Animated.Value(0.35),
    bottomRight: new Animated.Value(0.35),
  }).current;

  // PanResponder
  const questionPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: (_, gs) => {
        questionPosition.setValue({ x: 0, y: 0 });
        setDropPosition('');
        decreaseQuestionScale.start();
      },
      onPanResponderMove: (_, gs) => {
        questionPosition.setValue({ x: gs.dx, y: gs.dy });

        const curDropPosition = generateDropPosition({
          gestureState: gs,
          questionThresholdCoordTop,
          questionThresholdCoordBottom,
          questionThresholdCoordLeft,
          questionThresholdCoordRight,
        });

        setDropPosition(curDropPosition);

        if (
          curDropPosition === 'topLeft' ||
          curDropPosition === 'topRight' ||
          curDropPosition === 'bottomLeft' ||
          curDropPosition === 'bottomRight'
        ) {
          if (questionSlotHighlighterSwitch) {
            turnOffQuestionSlotHighlighter();
          }
          if (wordSlotHighlighterSwitches[curDropPosition] === false) {
            turnOnWordSlotHighlighter(curDropPosition);
          }
        } else {
          if (!questionSlotHighlighterSwitch) {
            turnOnQuestionSlotHighlighter();
          }
          const anyLighterOn = Object.values(wordSlotHighlighterSwitches).some(
            (value) => value === true
          );
          if (anyLighterOn) {
            turnOffAllSlotHighlighters();
          }
        }
      },
      onPanResponderRelease: (_, gs) =>
        setTriggerQuestionResponderRelease(true),
    })
  ).current;

  const questionPanResponderRelease = useCallback(() => {
    turnOffAllSlotHighlighters();
    if (dropPosition !== '') {
      const checkResult = checkAnswer({
        dropPosition,
        questionWord,
        wordSamples,
      });

      if (!checkResult) {
        // 오답
        wordSlotIconShakings[
          dropPosition as keyof LayoutRect<Animated.ValueXY>
        ].reset();
        wordSlotIconShakings[
          dropPosition as keyof LayoutRect<Animated.ValueXY>
        ].start();
        goQuestionHome();
        turnOnQuestionSlotHighlighter();
      } else {
        // 정답
        setAnswerCheckTrigger(true);
      }
    } else {
      goQuestionHome();
    }
  }, [dropPosition, questionWord, wordSamples]);

  useEffect(() => {
    if (triggerQuestionResponderRelease) {
      setTriggerQuestionResponderRelease(false);
      questionPanResponderRelease();
    }
  }, [triggerQuestionResponderRelease, questionPanResponderRelease]);

  // Animations - Question
  const showQuestion = useRef(
    Animated.timing(questionOpacity, {
      toValue: 1,
      useNativeDriver: true,
      duration: 1000,
    })
  ).current;

  const decreaseQuestionScale = useRef(
    Animated.timing(questionScale, {
      toValue: 0.5,
      useNativeDriver: true,
      duration: 80,
    })
  ).current;

  const initQuestionScale = useRef(
    Animated.timing(questionScale, {
      toValue: 1,
      useNativeDriver: true,
      duration: 100,
    })
  ).current;

  const initQuestionPosition = useRef(
    Animated.spring(questionPosition, {
      toValue: { x: 0, y: 0 },
      useNativeDriver: true,
      speed: 20,
      restDisplacementThreshold: 0.2,
      restSpeedThreshold: 0.2,
    })
  ).current;

  // Animations - Question Slot Highlighter
  const aniQuestionSlotHighlighter = useRef(
    Animated.loop(
      Animated.parallel([
        Animated.timing(questionSlotHighlighterScale, {
          toValue: 1,
          useNativeDriver: true,
          easing: Easing.ease,
          duration: 1000,
        }),
        Animated.timing(questionSlotHighlighterOpacity, {
          toValue: 0,
          useNativeDriver: true,
          easing: Easing.ease,
          duration: 1000,
        }),
      ])
    )
  ).current;

  // Animations - Answer Check Slot
  const showAnswerCheckSlot = useRef(
    Animated.sequence([
      Animated.parallel([
        Animated.timing(answerCheckSlotOpacity, {
          toValue: 1,
          useNativeDriver: true,
          duration: 100,
        }),
        Animated.spring(answerCheckSlotScale, {
          toValue: 1,
          useNativeDriver: true,
          bounciness: 10,
          speed: 25,
          restDisplacementThreshold: 0.2,
          restSpeedThreshold: 0.2,
        }),
      ]),
      Animated.delay(200),
      Animated.parallel([
        Animated.timing(answerCheckSlotOpacity, {
          toValue: 0,
          useNativeDriver: true,
          duration: 100,
        }),
        Animated.timing(answerCheckSlotScale, {
          toValue: 4,
          useNativeDriver: true,
          duration: 100,
        }),
      ]),
    ])
  ).current;

  // Animations - Answer Reminder Slot
  const showAnswerReminderSlot = useRef(
    Animated.sequence([
      Animated.parallel([
        Animated.timing(answerReminderSlotOpacity, {
          toValue: 1,
          useNativeDriver: true,
          duration: 200,
        }),
        Animated.spring(answerReminderSlotScale, {
          toValue: 1,
          useNativeDriver: true,
          bounciness: 5,
          speed: 20,
        }),
      ]),
      Animated.delay(1000),
      Animated.parallel([
        Animated.timing(answerReminderSlotPosition, {
          toValue: { x: 0, y: screenHeightNoNav / 2 },
          useNativeDriver: true,
          duration: 100,
        }),
        Animated.timing(answerReminderSlotOpacity, {
          toValue: 0,
          useNativeDriver: true,
          duration: 100,
        }),
      ]),
    ])
  ).current;

  // Animations - Word Slot
  const getAnimationShakingWordSlotIcon = useCallback(
    (rectName: keyof LayoutRect<Animated.ValueXY>) => {
      const shakingStep1 = Animated.timing(wordSlotIconPositions[rectName], {
        toValue: { x: -10, y: 0 },
        useNativeDriver: true,
        duration: 50,
      });
      const shakingStep2 = Animated.timing(wordSlotIconPositions[rectName], {
        toValue: { x: 10, y: 0 },
        useNativeDriver: true,
        duration: 100,
      });
      const shakingStep3 = Animated.timing(wordSlotIconPositions[rectName], {
        toValue: { x: 0, y: 0 },
        useNativeDriver: true,
        duration: 50,
      });
      return Animated.sequence([shakingStep1, shakingStep2, shakingStep3]);
    },
    [wordSlotIconPositions]
  );

  const wordSlotIconShakings = useRef({
    topLeft: getAnimationShakingWordSlotIcon('topLeft'),
    topRight: getAnimationShakingWordSlotIcon('topRight'),
    bottomLeft: getAnimationShakingWordSlotIcon('bottomLeft'),
    bottomRight: getAnimationShakingWordSlotIcon('bottomRight'),
  }).current;

  // Animations - Word Slot Highlighter
  const getAnimationBlinkWordSlotHighlighter = useCallback(
    (rectName: keyof LayoutRect<Animated.Value>) => {
      return Animated.timing(wordSlotHighlighterScales[rectName], {
        toValue: 1,
        useNativeDriver: true,
        easing: Easing.ease,
        duration: 1000,
      });
    },
    []
  );

  const getAnimationOpacityWordSlotHighlighter = useCallback(
    (rectName: keyof LayoutRect<Animated.Value>) => {
      return Animated.timing(wordSlotHighlighterOpacities[rectName], {
        toValue: 0,
        useNativeDriver: true,
        easing: Easing.ease,
        duration: 1000,
      });
    },
    []
  );

  const aniWordSlotHighlighters = useRef({
    topLeft: Animated.loop(
      Animated.parallel([
        getAnimationBlinkWordSlotHighlighter('topLeft'),
        getAnimationOpacityWordSlotHighlighter('topLeft'),
      ])
    ).start(),
    topRight: Animated.loop(
      Animated.parallel([
        getAnimationBlinkWordSlotHighlighter('topRight'),
        getAnimationOpacityWordSlotHighlighter('topRight'),
      ])
    ).start(),
    bottomLeft: Animated.loop(
      Animated.parallel([
        getAnimationBlinkWordSlotHighlighter('bottomLeft'),
        getAnimationOpacityWordSlotHighlighter('bottomLeft'),
      ])
    ).start(),
    bottomRight: Animated.loop(
      Animated.parallel([
        getAnimationBlinkWordSlotHighlighter('bottomRight'),
        getAnimationOpacityWordSlotHighlighter('bottomRight'),
      ])
    ).start(),
  }).current;

  // Functions
  // Functions - Question
  const goQuestionHome = useCallback(() => {
    Animated.parallel([initQuestionPosition, initQuestionScale]).start();
  }, []);

  // Functions - Question Slot Highlighter
  useEffect(() => {
    aniQuestionSlotHighlighter.start();
  }, [questionSlotHighlighterSwitch]);

  const turnOnQuestionSlotHighlighter = useCallback(() => {
    questionSlotHighlighterSwitch = true;
    setQuestionSlotHighlighterSwitch(questionSlotHighlighterSwitch);
  }, []);

  const turnOffQuestionSlotHighlighter = useCallback(() => {
    questionSlotHighlighterSwitch = false;
    setQuestionSlotHighlighterSwitch(questionSlotHighlighterSwitch);
  }, []);

  // Functions - Question - Prepare for next question
  const calcMovingDistToCenterForWordSlotIcon = useCallback(
    (rectName: keyof typeof wordSlotIconPositions) => {
      let movingDistX = WINDOW_WIDTH / 2 - SLOT_PADDING - SLOT_SIZE / 2;
      let movingDistY =
        screenHeightNoNav / 2 -
        SLOT_SIZE / 2 -
        (screenHeightNoNav / 4 - SLOT_SIZE);
      if (rectName === 'topLeft') {
      } else if (rectName === 'topRight') {
        movingDistX *= -1;
      } else if (rectName === 'bottomLeft') {
        movingDistY *= -1;
      } else if (rectName === 'bottomRight') {
        movingDistX *= -1;
        movingDistY *= -1;
      }
      return { movingDistX, movingDistY };
    },
    []
  );

  useEffect(() => {
    if (questionWord && questionWord.en !== '') {
      // 애니메이션 초기화
      const animations = Object.keys(wordSlotIconPositions).map((rectName) => {
        const aniSchedule = Animated.parallel([
          Animated.timing(
            wordSlotIconOpacities[
              rectName as keyof typeof wordSlotIconOpacities
            ],
            {
              toValue: 1,
              useNativeDriver: true,
              duration: 30,
            }
          ),
          Animated.sequence([
            Animated.timing(
              wordSlotIconPositions[
                rectName as keyof typeof wordSlotIconPositions
              ],
              {
                toValue: {
                  x: rectName.endsWith('Left') ? -10 : 10,
                  y: rectName.startsWith('top') ? -10 : 10,
                },
                useNativeDriver: true,
                duration: 30,
              }
            ),
            Animated.timing(
              wordSlotIconPositions[
                rectName as keyof typeof wordSlotIconPositions
              ],
              {
                toValue: { x: 0, y: 0 },
                useNativeDriver: true,
                duration: 30,
              }
            ),
          ]),
        ]);
        return aniSchedule;
      });

      // 초기 상태 세팅
      // 질문 위치/크기
      questionPosition.setValue({ x: 0, y: 0 });
      questionScale.setValue(1);
      // Word Slot들은 보이게
      Object.keys(wordSlotOpacities).forEach((rectName) => {
        wordSlotOpacities[rectName as keyof typeof wordSlotOpacities].setValue(
          1
        );
        // Word Slot Icon들은 안 보이게
        wordSlotIconOpacities[
          rectName as keyof typeof wordSlotIconOpacities
        ].setValue(0);
      });
      // Word Slot Icon들의 위치를 화면 가운데로 이동
      Object.keys(wordSlotIconPositions).forEach((rectName) => {
        const { movingDistX, movingDistY } =
          calcMovingDistToCenterForWordSlotIcon(
            rectName as keyof typeof wordSlotIconPositions
          );
        wordSlotIconPositions[
          rectName as keyof typeof wordSlotIconPositions
        ].setValue({ x: movingDistX, y: movingDistY });
      });

      // 애니메이션 실행
      Animated.sequence([showQuestion, ...animations]).start(() =>
        setQuestionSlotHighlighterSwitch(true)
      );
    }
  }, [questionWord]);

  const getAniCleanAllWordAndSlotsForAnswerCheck = useCallback(() => {
    const fadeOutDuration = 100;
    const animations = Object.keys(wordSlotOpacities).map(
      // @ts-ignore
      (key: keyof LayoutRect<Animated.Value>) => {
        return Animated.timing(wordSlotOpacities[key], {
          toValue: 0,
          useNativeDriver: true,
          duration: fadeOutDuration,
        });
      }
    );
    animations.push(
      Animated.timing(questionOpacity, {
        toValue: 0,
        useNativeDriver: true,
        duration: fadeOutDuration,
      })
    );
    return Animated.parallel(animations);
  }, []);

  // Functions - Answer Check Slot
  const getAniShowAnswerCheck = useCallback(() => {
    showAnswerCheckSlot.reset();
    showAnswerReminderSlot.reset();
    return Animated.sequence([showAnswerCheckSlot, showAnswerReminderSlot]);
  }, []);

  useEffect(() => {
    if (answerCheckTrigger) {
      Animated.sequence([
        getAniCleanAllWordAndSlotsForAnswerCheck(),
        getAniShowAnswerCheck(),
      ]).start(() => {
        setAnswerCheckTrigger(false);
        setWordSamples(getWordSamples());
      });
    }
  }, [answerCheckTrigger]);

  // Functions - Word Slot Highlighter
  const turnOnWordSlotHighlighter = useCallback(
    (lighterName: keyof LayoutRect<boolean>) => {
      Object.keys(wordSlotHighlighterSwitches).forEach(
        // @ts-ignore
        (key: keyof LayoutRect<boolean>) => {
          wordSlotHighlighterSwitches[key] = false;
        }
      );
      wordSlotHighlighterSwitches[lighterName] = true;
      setWordSlotHighlighterSwitches({ ...wordSlotHighlighterSwitches });
    },
    []
  );

  const turnOffAllSlotHighlighters = useCallback(() => {
    Object.keys(wordSlotHighlighterSwitches).forEach(
      // @ts-ignore
      (key: keyof LayoutRect<boolean>) => {
        wordSlotHighlighterSwitches[key] = false;
      }
    );
    setWordSlotHighlighterSwitches({ ...wordSlotHighlighterSwitches });
  }, []);

  // Final Loading Check
  useEffect(() => {
    if (questionWord) {
      setIsLoading(false);
    }
  }, [questionWord]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <StViewContainer>
      {/* Upper */}
      <WordSlotContainer
        containerPosition="top"
        wordSamples={wordSamples}
        wordSlotOpacities={wordSlotOpacities}
        wordSlotIconPositions={wordSlotIconPositions}
        wordSlotIconOpacities={wordSlotIconOpacities}
        wordSlotHighlighterSwitches={wordSlotHighlighterSwitches}
        wordSlotHighlighterOpacities={wordSlotHighlighterOpacities}
        wordSlotHighlighterScales={wordSlotHighlighterScales}
      />

      {/* Center */}
      <CenterSlotContainer
        questionWord={questionWord}
        questionPanResponder={questionPanResponder}
        questionPosition={questionPosition}
        questionOpacity={questionOpacity}
        questionScale={questionScale}
        questionSlotHighlighterSwitch={questionSlotHighlighterSwitch}
        questionSlotHighlighterOpacity={questionSlotHighlighterOpacity}
        questionSlotHighlighterScale={questionSlotHighlighterScale}
        answerCheckTrigger={answerCheckTrigger}
        answerCheckSlotOpacity={answerCheckSlotOpacity}
        answerCheckSlotScale={answerCheckSlotScale}
        answerReminderSlotPosition={answerReminderSlotPosition}
        answerReminderSlotOpacity={answerReminderSlotOpacity}
        answerReminderSlotScale={answerReminderSlotScale}
      />

      {/* Lower */}
      <WordSlotContainer
        containerPosition="bottom"
        wordSamples={wordSamples}
        wordSlotOpacities={wordSlotOpacities}
        wordSlotIconPositions={wordSlotIconPositions}
        wordSlotIconOpacities={wordSlotIconOpacities}
        wordSlotHighlighterSwitches={wordSlotHighlighterSwitches}
        wordSlotHighlighterOpacities={wordSlotHighlighterOpacities}
        wordSlotHighlighterScales={wordSlotHighlighterScales}
      />
    </StViewContainer>
  );
};

export default ChallengeDragNDrop;
