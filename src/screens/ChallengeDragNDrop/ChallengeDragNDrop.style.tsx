import styled from 'styled-components/native';

export const StViewContainer = styled.View<{ color?: string }>`
  flex: 1;
  background-color: ${(props) =>
    props.color ? props.color : props.theme.challMainBackground1};
`;
