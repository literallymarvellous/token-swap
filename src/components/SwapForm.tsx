import React from "react";
import styled from "styled-components";

const SwapForm = () => {
  return (
    <Wrapper>
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
            <SelectButton></SelectButton>
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
          <SelectWrapper>
            <SelectButton></SelectButton>
            <Input id="from" />
          </SelectWrapper>
        </InputWrapper>
      </FormWrapper>
    </Wrapper>
  );
};

const Wrapper = styled.section`
  /* font-scale */
  --step-0: clamp(2rem, calc(1.64rem + 1.82vw), 3rem);

  font-family: var(--font-family-incon);
  padding-inline: var(--spacing-wrapper);
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
  padding-inline: 32px;
  padding-block: 28px;
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
`;

const InputWrapper = styled.div`
  flex: 1;
`;

const InputLabel = styled.label``;

const SelectWrapper = styled.div`
  background: var(--color-white);
`;

const SelectButton = styled.button`
  background: var(--color-black);
`;

const Input = styled.input``;

export default SwapForm;
