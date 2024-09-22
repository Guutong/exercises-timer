import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html, body, #root {
    height: 100%;
  }

  body {
    font-family: Arial, sans-serif;
    background: linear-gradient(135deg, #f06, #f96);
    color: #333;
  }

  input {
    padding: 10px;
    font-size: 16px;
    width: 100%;
    margin-top: 10px;
  }

  @media only screen and (max-width: 600px) {
    input {
      font-size: 14px;
    }
  }
`;
