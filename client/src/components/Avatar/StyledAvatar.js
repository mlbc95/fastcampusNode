import styled from 'styled-components'
import { blue300, indigo900 } from 'material-ui/styles/colors'

export default styled.div`
  background-color: ${props => props.bg ? indigo900 : 'transparent'};
  color: ${blue300};
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 0px 0px 8px rgba(0,0,0,0.2);
  border-radius: ${props => props.size}px;
  height: ${props => props.size}px;
  width: ${props => props.size}px;
  font-size: ${props => props.size * 0.35}px;
  font-weight: bold;
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
