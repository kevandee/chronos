import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {Alert} from '@mui/material'
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

import { fetchLogin } from '../../redux/slices/authSlice';

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { userInfo, error } = useSelector((state) => state.auth);

    const { register, handleSubmit } = useForm({
        defaultValues: {
            login: '',
            password: ''
        },
        mode: 'onChange'
    });

    const onSubmit = async (values) => {
        dispatch(fetchLogin(values));
    }

    React.useEffect(() => {
        if (userInfo) {
            navigate('/');
        }
    }, [userInfo])

    return (
        <main>
            <h1>Login</h1>
            {error && <Alert severity="error">{error}</Alert>}
            <form onSubmit={handleSubmit(onSubmit)} style={{display: "flex", flexDirection: "column", width: "min-content"}}>
                <label htmlFor="">Username</label>
                <input type='text' {...register('login', { required: 'Input username' })}/>
                <label htmlFor="">Password</label>
                <input type='password' {...register('password', { required: 'Input password' })}/>
                <button type='submit'>Login</button>
                <Link href='/signup'>Sign up</Link>
            </form>
        </main>
    )
}

export default Login;