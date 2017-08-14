import styled from 'styled-components'

export default styled.div`
  background-color: ${props => props.bg ? '#fff' : 'transparent'};
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 0px 0px 8px rgba(0,0,0,0.2);
  border-radius: ${props => props.size}px;
  height: ${props => props.size}px;
  width: ${props => props.size}px;
  font-size: ${props => props.size * 0.35}px;
  font-weight: bold;
  color: #fff;
  position: relative;
  overflow: hidden;
  z-index: 2;
  cursor: pointer;

  &:hover {
    text-decoration: none;
  }

  img {
    width: 100%;
    height: auto;
    position: absolute;
    top:0;
    left:0;
  }
`
