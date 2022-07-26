import React from "react";
import styled from "styled-components";

const SwapForm = () => {
  return (
    <Wrapper>
      <SwapContainer>
        <HeadingWrapper>
          <Heading>
            <span>currency</span> / <span>swap</span>
          </Heading>

          <ContinueButton>Continue</ContinueButton>
        </HeadingWrapper>

        <FormWrapper>
          <InputWrapper>
            <InputLabel htmlFor="from">from</InputLabel>
            <SelectWrapper>
              <SelectButton>
                <IconWrapper></IconWrapper>
                <span>Choose</span>
                <span>..</span>
              </SelectButton>
              <Input id="from" />
            </SelectWrapper>
          </InputWrapper>

          <ArrowIcon>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="-0.3 -0.3 2.6 7.6">
              <path
                d="M 0 0 L 2 1 M 0 3 L 2 2 M 2 4 L 0 5 M 2 7 L 0 6"
                stroke="#000000"
                strokeWidth="0.5"
                fill="#000000"
              />
            </svg>
          </ArrowIcon>

          <InputWrapper>
            <InputLabel htmlFor="to">to</InputLabel>
            <SelectWrapper onClick={() => console.log("hey")}>
              <SelectButton>
                <IconWrapper></IconWrapper>
                <span>Choose</span>
                <span>..</span>
              </SelectButton>
              <Input id="from" />
            </SelectWrapper>
          </InputWrapper>
        </FormWrapper>
      </SwapContainer>
    </Wrapper>
  );
};

const Wrapper = styled.section`
  /* font-scale */
  --step-0: clamp(2rem, calc(1.64rem + 1.82vw), 3rem);

  font-family: var(--font-family-incon);
  min-height: 100vh;
  display: grid;
  grid-template-rows: 1fr 2fr 1.6fr;
  grid-template-areas:
    "."
    "main"
    ".";
`;

const SwapContainer = styled.div`
  grid-area: main;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const HeadingWrapper = styled.div`
  display: flex;
`;

const Heading = styled.h1`
  text-transform: uppercase;
  font-size: var(--step-0);
  font-weight: 500;
  font-stretch: 100%;
  letter-spacing: 0.4em;
  margin-right: auto;
`;

const ContinueButton = styled.button`
  background: var(--color-primary-light);
  border: none;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-elevation-medium);
  padding-inline: 28px;
  padding-block: 24px;
  color: var(--color-primary-dark);
  text-transform: uppercase;
  font-family: var(--font-family-nova);
  font-size: 0.7rem;
  font-weight: 600;
`;

const FormWrapper = styled.div`
  display: flex;
  gap: 20px;
`;

const ArrowIcon = styled.div`
  width: 12px;
  height: 12px;
  align-self: center;
`;

const InputWrapper = styled.div`
  flex: 1;
`;

const InputLabel = styled.label`
  text-transform: uppercase;
  font-family: var(--font-family-nova);
  font-size: 0.9rem;
  color: var(--color-primary-dark);
`;

const SelectWrapper = styled.div`
  background: var(--color-white);
  padding: 4px;
  display: flex;
  justify-content: space-between;
  margin-top: 16px;
`;

const SelectButton = styled.button`
  border: none;
  background: var(--color-black);
  color: var(--color-white);
  font-family: var(--font-family-incon);
  font-size: 1rem;
  letter-spacing: 2px;
  text-transform: uppercase;
  padding-inline: 12px;
  padding-block: 16px;
  display: flex;
  align-items: center;
  gap: 16px;
  cursor: pointer;

  & > span:last-of-type {
    font-size: 1.1rem;
    margin-bottom: 8px;
  }
`;

const Input = styled.input`
  border: none;
  font-family: var(--font-family-incon);
  text-align: right;
  padding-right: 24px;
  font-size: 1.2rem;
  font-weight: 500;
`;

const IconWrapper = styled.div`
  width: 30px;
  height: 30px;
  background: #fff;
`;

export default SwapForm;
