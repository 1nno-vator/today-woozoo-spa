import React, { useState } from 'react';
import { useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useAppDispatch, useAppSelector } from '../app/store';
import { LOAD_STATUS_TOGGLE } from '../features/apod/apodSlice';
import Switch from "react-switch";

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
        animation-duration: 1s;
        animation-fill-mode: forwards;
    }

    &:hover > div:not(.active) {
        animation-name: ${fadeInAnimation};
        animation-duration: 0.5s;
        animation-fill-mode: forwards;
    }

    @media screen and (max-width: 768px) {
        -webkit-filter: blur(5px);
        -moz-filter: blur(5px);
        -o-filter: blur(5px);
        -ms-filter: blur(5px);
        filter: blur(5px);
    }
`

const ImgBox = styled.img`
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 9999;
    object-fit: cover;
    src: url(${props => props.src});
`

const ExplanationBox = styled.div`
    position: absolute;
    background: rgba(128, 128, 128, 0.8);
    padding: 25px;
    bottom: -50%;
    z-index: 9999;

    &.active {
        bottom: 0;
    }
`

const WarningBox = styled.div`
    position: fixed;
    background: rgba(128, 128, 128, 0.9);
    width: 100vw;
    height: 100vh;
    top: 0;
    left: 0;
    z-index: 99999;
    display: none;

    div {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        font-weight: bold;
        font-size: 1.5em;

        @media screen and (max-width: 480px) {
            font-size: 1em;
        }
    }

    @media screen and (max-width: 768px) {
        display: block;
    }

`

function Apod() {
    
    let [translateMode, setTranslateMode] = useState<boolean>(false)
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

    const translateModeToggle = () => {
        setTranslateMode(!translateMode);
    }

    return (
        <Container>
            <WarningBox>
                <div>원활한 사용을 위해 PC로 접속해주세요!</div>
            </WarningBox>

            <SubContainer>
                <ImgBox src={data.url} 
                    onLoad={() => onLoadHandler()}
                    onClick={() => pinToggle()}
                />

                <ExplanationBox className={`${active}`} 
                    style={{ display: data.title && isLoad ? 'block' : 'none' }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <h2>{data.translate_title && translateMode ? data.translate_title : data.title} {`(${targetDate})`}</h2>
                        <p style={{ display: 'flex', alignItems: 'center' }}>
                            <span style={{ marginRight: '10px' }}>번역보기</span>
                            <Switch onChange={() => translateModeToggle()} checked={translateMode} />
                        </p>
                    </div>
                    <h4>{data.copyright}</h4>
                    <p>{data.translate_explanation && translateMode ? data.translate_explanation : data.explanation}</p>
                </ExplanationBox>

            </SubContainer>
            
        </Container>
    )
}

export default Apod;