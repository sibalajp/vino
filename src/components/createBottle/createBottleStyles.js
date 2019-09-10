import styled from "styled-components";

export const BottleContainer = styled.div`
  background: #fff;
  width: 400px;
  min-height: 218px;
  margin: 0 auto;
  padding: 2rem;
  box-shadow: 0px 6px 5px 1px rgba(221, 221, 221, 0.58);
  position: relative
`;

export const Label = styled.div`
    fontSize: '16px';
`;

export const BottleTitle = styled.div`
    font-size: 18px;
    font-weight: 700;
    margin-bottom: 1rem;
`;

export const NextStepButton = styled.div`
    background: ${({ valid }) => (valid ? "#E41E13" : "#C6C6C6")};
    height: 47px;
    width: 100%;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;

    :hover {
        cursor: pointer;
    }
`

export const SuccessButtons = styled.div`
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    
    :hover {
        cursor: pointer;
    }
`

export const DropdownStyle = {
    marginTop: '8px',
    width: '340px',
    height: '40px',
    border: '1px solid #D9D9D9',
    borderRadius: '4px',
    fontSize: '16px',
    color: '#BFBFBF',
    padding: '3px 2px 2px 35px'
}

export const NumberOfBatches = {
    marginTop: '-1rem',
    width: '340px',
    height: '40px',
    fontSize: '16px',
    color: '#BFBFBF',
    padding: '2px 2px 2px 35px',
    display: 'flex',
}

export const DropdownStyleNum = {
    marginTop: '8px',
    width: '340px',
    height: '40px',
    border: '1px solid #D9D9D9',
    borderRadius: '4px',
    fontSize: '16px',
    color: '#BFBFBF',
    padding: '3px'
}

export const IconStyle = {
    fill: '#525866',
    height: '25px',
    width: '25px',
    position: 'absolute',
    marginTop: '15px',
    marginLeft: '12px'
}

export const SelectedIconStyle = {
    fill: '#525866',
    height: '25px',
    width: '25px',
    position: 'absolute',
    marginTop: '2px',
}

export const NextStep = {
    color: '#fff', 
    margin: '0 auto', 
    width: '200px', 
    textAlign: 'center',
    fontSize: '16px', 
    paddingTop: '10px',
    fontWeight: '400'
}

export const SelectedDropStyle = {
    width: '340px',
    fontSize: '16px',
    color: '#BFBFBF',
    padding: '2px 2px 2px 35px',
    display: 'flex',
    marginBottom: '1rem'
}

export const DatePickerStyle = {
    marginTop: '8px',
    width: '340px',
    height: '40px',
    borderRadius: '4px',
    fontSize: '16px',
    color: '#BFBFBF'
}

export const Change = {
    fontSize: '12px',
    color: '#488AFF',
    padding: '4px',
    cursor: 'pointer',
    width: '15%'
}

export const Spinner = {
   top: "45%",
   zIndex: 2,
   position: "fixed",
   left: "50%"
}
