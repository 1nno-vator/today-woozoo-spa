import React, { useState } from 'react';
import { useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useAppDispatch, useAppSelector } from '../app/store';
import { LOAD_STATUS_TOGGLE } from '../features/apod/apodSlice';

const fadeInAnimation = keyframes`
    0% {
        bottom: -100%;
    }
    100% { 
        bottom: 0;
    }
`

const fadeOutAnimation = keyframes`
    0% {
        bottom: 0;
    }
    100% { 
        bottom: -100%;
    }
`

const Container = styled.div`
    width: 70%;
    height: 90%;
    padding: 15px;
    border: none;
    border-radius: 25px;
    background-color: #FCE389;
    z-index: 999;
`

const SubContainer = styled.div`
    position: relative;
    width: 100%;
    height: 100%;
    border: none;
    border-radius: 25px;
    overflow-x: hidden;
    overflow-y: hidden;
    
    & > div:not(.active) {
        animation-name: ${fadeOutAnimation};
        animation-duration: 2s;
        animation-fill-mode: forwards;
    }

    &:hover > div:not(.active) {
        animation-name: ${fadeInAnimation};
        animation-duration: 2s;
        animation-fill-mode: forwards;
    }
`

const ImgBox = styled.img`
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 9999;
    src: url(${props => props.src});
`

const ExplanationBox = styled.div`
    position: absolute;
    background: rgba(128, 128, 128, 0.6);
    padding: 25px;
    bottom: -100%;
    z-index: 9999;

    &.active {
        bottom: 0;
    }
`

function Apod() {
    
    let [pin, setPin] = useState<boolean>(false);
    let [active, setActive] = useState<string>('');

    const dispatch = useAppDispatch();

    const targetDate = useAppSelector((state) => state.apodReducer.targetDate);
    const isLoad = useAppSelector((state) => state.apodReducer.isLoad);
    const data = useAppSelector((state) => state.apodReducer.data);

    useEffect(() => {
        if (pin) {
            setActive('active');
        } else {
            setActive('');
        }
    }, [pin])
    
    const onLoadHandler = () => {
        dispatch(LOAD_STATUS_TOGGLE(true));
    }

    const pinToggle = () => {
        setPin(!pin);
    }

    return (
        <Container>
            
            <SubContainer>
                <ImgBox src={data.url} 
                    onLoad={() => onLoadHandler()}
                    onClick={() => pinToggle()}
                />

                <ExplanationBox className={`${active}`} 
                    style={{ display: data.title && isLoad ? 'block' : 'none' }}
                >
                    <h2>{data.title} {`(${targetDate})`}</h2>
                    <h4>{data.copyright}</h4>
                    <p>{data.explanation}</p>
                </ExplanationBox>

            </SubContainer>
            
        </Container>
    )
}

export default Apod;