import * as React from 'react';
import PropTypes from 'prop-types';
import ButtonBase from '@mui/material/ButtonBase';
import ButtonUnstyled, {
    buttonUnstyledClasses,
} from '@mui/base/ButtonUnstyled';
import { styled } from '@mui/system';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

const ButtonRoot = React.forwardRef(function ButtonRoot(props, ref) {
    const { children, ...other } = props;

    const theme = useTheme();
    const smallMediaBreakpoint = useMediaQuery(theme.breakpoints.down('sm')); //boolean
    //const btnWidth = props.btnwidth || '200'; //I don't know why I did this, but the 'w' in Width is supposed to be lowercase, unless I go around and fix it everywhere
    const btnWidth =
        props.btnwidth && smallMediaBreakpoint
            ? props.btnwidth - 50
            : props.btnwidth || '200'; //I don't know why I did this, but the 'w' in Width is supposed to be lowercase, unless I go around and fix it everywhere
    const btnHeight = '50';
    return (
        <ButtonBase style={{ color: 'var(--light-color)' }}>
            <svg width={btnWidth} height={btnHeight} {...other} ref={ref}>
                <polygon
                    points={
                        '0,' +
                        btnHeight +
                        ' 0,0 ' +
                        btnWidth +
                        ',0 ' +
                        btnWidth +
                        ',' +
                        btnHeight
                    }
                    className="bg"
                />
                <polygon
                    points={
                        '0,' +
                        btnHeight +
                        ' 0,0 ' +
                        btnWidth +
                        ',0 ' +
                        btnWidth +
                        ',' +
                        btnHeight
                    }
                    className="borderEffect"
                />
                <foreignObject x="0" y="0" width={btnWidth} height={btnHeight}>
                    <div className="content">{children}</div>
                </foreignObject>
            </svg>
        </ButtonBase>
    );
});

ButtonRoot.propTypes = {
    children: PropTypes.node,
};

const yellow = {
    100: '#ffffd9',
    800: '#ffffd940', //'#ffffed66',
    900: '#ffffd922',
};

const CustomButtonRoot = styled(ButtonRoot)(
    (props) => `
  overflow: visible;
  cursor: pointer;
  --main-color: ${yellow[100]};
  --hover-color: ${yellow[900]};
  --active-color: ${yellow[800]};
  box-shadow: 0 0 0px var(--main-color);
  transition: box-shadow 800ms ease;

  & polygon {
    fill: transparent;
    transition: all 800ms ease;
    pointer-events: none;
  }
  
  & .bg {
    stroke: var(--main-color);
    stroke-width: 1;
    filter: drop-shadow(0 4px 20px rgba(0, 0, 0, 0.1));
    fill: transparent;
  }

  & .borderEffect {
    stroke: var(--main-color);
    stroke-width: 2;
    stroke-dasharray: ${(props.btnWidth || 200) * 0.75} ${
        (props.btnWidth || 200) * 4
    };
    stroke-dashoffset: ${(props.btnWidth || 200) * 0.75};
    fill: transparent;
  }

  &:hover,
  &.${buttonUnstyledClasses.focusVisible} {
    box-shadow: 0 0 5px var(--main-color);
    .borderEffect {
      stroke-dashoffset: -${(props.btnWidth || 200) * 4};
    }

    .bg {
      fill: var(--hover-color);
    }
  }

  &:focus,
  &.${buttonUnstyledClasses.focusVisible} {
    outline: none;
    outline-offset: 2px;
  }

  &.${buttonUnstyledClasses.active} { 
    & .bg {
      fill: var(--active-color);
      transition: fill 300ms ease-out;
    }
  }

  & foreignObject {
    pointer-events: none;

    & .content {
      @media screen and (min-width: 600px) {
        font-size: 0.875rem;
      }
      @media screen and (max-width: 600px) {
        font-size: 0.75rem;
      }
      font-family: Merriweather Sans;
      letter-spacing: 1px;
      font-weight: 500;
      line-height: 1.5;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--main-color);
      text-transform: uppercase;
    }

    & svg {
      margin: 0 5px;
    }
  }`
);

CustomButtonRoot.propTypes = {
    children: PropTypes.node,
};

const SvgButton = React.forwardRef(function SvgButton(props, ref) {
    return <ButtonUnstyled {...props} component={CustomButtonRoot} ref={ref} />;
});

export default SvgButton;
