import React from 'react';
import styled from 'styled-components';
import Button from '../Button';

const StyledApp = styled.div`
  background: #eaeaea;
  padding: 2em;
`;

function App() {
  return (
    <StyledApp>
      <Button>Click Me!</Button>
    </StyledApp>
  );
}

export default App;
