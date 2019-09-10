import styled from 'styled-components';


export const TopText = styled.p `
    font-size: 14px;
    left: -5px;
    position: relative;
    margin: 0 auto;
    max-width: 75%;
`

export const VinoHeader = styled.div `
    height: 40px;
    margin: 10px 0px;
    position: relative;
    text-align: center;
`

export const CompanyName = styled.h1 `
    display: inline-block;
    vertical-align: middle;
    margin: 0 auto;
    font-weight: 700;
    font-size: 1.2em;
`




// Styling for antd modules

const AntdButton = {
    borderRadius: '2px',
    fontSize: '.8em',
    letterSpacing: '.03em',
    margin: '30px auto', 
    width: '360px',

}

const FormItem = {
    margin: '0 auto',
    maxWidth: '78%'
}

const LoginButton = {
    backgroundColor: '#E41E13',
    border: 'none',
    borderTopRightRadius: 0,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: '5px',
    borderBottomRightRadius: '5px',
    height: '40px',
    fontSize: '.8em',
    letterSpacing: '.03em',
    position: 'relative',
    width: '100%',
   
}

const LoginForm = {
    padding: '10px 0px 0px 0px',
    borderRadius: '5px',
    position: 'relative',
    maxWidth: '360px',
    margin: '0 auto',
    boxShadow: '0px 6px 5px 1px rgba(221,221,221,0.58)',
    textAlign: 'center',
    backgroundColor: '#fff',
}

export const styles = {
    AntdButton: AntdButton,
    FormItem: FormItem,
    LoginButton: LoginButton,
    LoginForm: LoginForm
}




