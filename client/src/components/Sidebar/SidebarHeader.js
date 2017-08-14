import styled from 'styled-components'
import { spacing, typography } from 'material-ui/styles'
import { blue600 } from 'material-ui/styles/colors'

export default styled.div`
  cursor: pointer;
  font-size: 22px;
  color: ${typography.textFullWhite};
  line-height: ${spacing.desktopKeylineIncrement}px;
  font-weight: ${typography.fontWeightLight};
  background-color: ${blue600};
  padding-left: 40px;
  height: 56px;
`
