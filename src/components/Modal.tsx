import styled from "styled-components";

import Lottie from "react-lottie";
import * as animationData from '../data/lottie-cat.json'
import { useAppSelector } from "../app/store";

const FullScreenDiv = styled.div`
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 100%;
    z-index: 99999;
    background: rgba(128, 128, 128, 0.6);
`

function Modal() {
    
    const data = useAppSelector((state) => state.apodReducer.data);
    const isLoad = useAppSelector((state) => state.apodReducer.isLoad);
    const options = {
        animationData: animationData,
        loop: true,
        autoplay: true,
    };
    // Modal
    return (
        <FullScreenDiv style={{ display: data.title && isLoad ? 'none' : 'block' }}>
            <Lottie options={options}/>
        </FullScreenDiv>
    )
}

export default Modal;