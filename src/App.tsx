import './App.css';

import React, { useEffect } from 'react';
import styled from 'styled-components';

import Apod from './components/Apod';
import { useAppDispatch, useAppSelector } from './app/store';
import { ADD_DAY, FETCH_DATA, SUB_DAY } from './features/apod/apodSlice';
import Modal from './components/Modal';

const Container = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  background: #F38181;
  align-items: center;
`

let LeftPanel = styled.div`
  position: fixed;
  width: 50%;
  height: 100%;
  left: 0;
  border-right: 2px dashed #FCE389;
  cursor: pointer;

  &:hover {
    background: rgb(247, 64, 64);
  }

  & span {
    display: block;
    font-size: 36px;
    font-weight: bold;
    color: white;
    text-align: left;
    transform-origin: 0 0;
    transform: rotate(-45deg);
    margin-top: 15%;
  }

`

let RightPanel = styled.div`
  position: fixed;
  width: 50%;
  height: 100%;
  right: 0;
  border-left: 2px dashed #FCE389;
  cursor: pointer;

  &:hover {
    background: rgb(133, 121, 242)
  }

  & span {
    display: block;
    font-size: 36px;
    font-weight: bold;
    color: white;
    text-align: right;

    position: absolute;
    bottom: 0px;
    right: 0px;
    transform-origin: 0 0;
    transform: rotate(-45deg);
  }

`


function App() {
  
  const dispatch = useAppDispatch();

  const targetDate = useAppSelector((state) => state.apodReducer.targetDate);

  useEffect(() => {
    dispatch(FETCH_DATA(targetDate));
  }, [dispatch, targetDate])

  const dateHandler = (flag: string) => {

    if (flag === 'ADD') {
      dispatch(ADD_DAY());
    } else {
      dispatch(SUB_DAY());
    }
    
  }
  
  return (
    <>
      <Container>
        <Modal/>
        <LeftPanel onClick={() => dateHandler('SUB')}>
          <span>PREVIOUS</span>
        </LeftPanel>
        <RightPanel onClick={() => dateHandler('ADD')}>
          <span>NEXT</span>
        </RightPanel>
        <Apod/>
      </Container>
    </>
  )
  
}

export default App;
