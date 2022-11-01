import 'normalize.css';
import './index.css';
import { FC, useState } from 'react';
import UiBarsDiagram from './components/UiBarsDiagram/UiBarsDiagram';
import styled from 'styled-components';

const App: FC = () => {
  const [yAxisMaxBar1, setYAxisMaxBar1] = useState(15);
  const [yAxisMaxBar2, setYAxisMaxBar2] = useState(15);

  const [bars1ReadOnly, setBars1ReadOnly] = useState(false);
  const [bars2ReadOnly, setBars2ReadOnly] = useState(false);

  const [bars1, setBars1] = useState(4);

  const [bars2, setBars2] = useState([
    {
      key: 'a',
      value: 3,
      color: '#f542c2',
    },
    {
      key: 'b',
      value: 6,
      color: '#42f56c',
      borderThickness: '3px',
      borderColor: '#289e49',
    },
    {
      key: 'd',
      value: 4,
    },
    {
      key: 'e',
      value: 8,
      color: '#bf264c',
      borderThickness: '0',
    }
  ]);

  function changeBar2Value(key: string, value: number): void {
    const bars2Copy = [...bars2];
    const targetBarIdx = bars2Copy.findIndex(bar => bar.key === key);

    if (targetBarIdx !== -1) {
      const targetBar = bars2Copy[targetBarIdx];

      bars2Copy.splice(targetBarIdx, 1, {
        ...targetBar,
        value,
      });

      setBars2(bars2Copy);
    }
  }

  function handleYAxisMaxBar1Change(e: any) {
    let resultValue = e.target.value;
    if (resultValue < 1) resultValue = 1; 
    setYAxisMaxBar1(resultValue);
  }

  function handleYAxisMaxBar2Change(e: any) {
    let resultValue = e.target.value;
    if (resultValue < 1) resultValue = 1; 
    setYAxisMaxBar2(resultValue);
  }

  return (
    <WrapperStyled>
      <div>
        <InputContainerStyled>
          <div>
            <span>Y-Axis Maximum: </span>
            <input type="number" value={yAxisMaxBar1} onChange={handleYAxisMaxBar1Change} />
          </div>
          <div style={{ marginTop: '4px' }}>
            <button onClick={() => setBars1(bars1 + 1)}>Add bar</button>
            <button onClick={() => bars1 ? setBars1(bars1 - 1) : {}}>Remove bar</button>
            <button onClick={() => setBars1ReadOnly(!bars1ReadOnly)}>Read Only</button>
          </div>
        </InputContainerStyled>
        <div>
          <UiBarsDiagram
            bars={bars1}
            max={yAxisMaxBar1}
            notableStep={5}
            readOnly={bars1ReadOnly}
            defaultBarValue={2}
          />
        </div>
      </div>

      <div>
        <InputContainerStyled>
          <div>
            <span>Y-Axis Maximum: </span>
            <input type="number" value={yAxisMaxBar2} onChange={handleYAxisMaxBar2Change} />
          </div>
          <div style={{ marginTop: '4px' }}>
            <button onClick={() => setBars2ReadOnly(!bars2ReadOnly)}>Read Only</button>
          </div>
        </InputContainerStyled>
        <div>
          <UiBarsDiagram
            bars={bars2}
            max={yAxisMaxBar2}
            notableStep={5}
            readOnly={bars2ReadOnly}
            onBarValueChanged={changeBar2Value}
          />
        </div>
      </div>
    </WrapperStyled>
  );
}

const WrapperStyled = styled.div`
  align-items: center;
  justify-content: space-around;
  min-height: 100vh;
`;

const InputContainerStyled = styled.div`
  font-weight: bold;
  margin-bottom: 24px;
`;

export default App;
