import React, { ButtonHTMLAttributes } from 'react';
import { Container } from './styles';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

const Button: React.FC = ({ children, ...rest }) => (
  <Container>
    <button type="button" {...rest}>
      {children}
    </button>
  </Container>
);

export default Button;
