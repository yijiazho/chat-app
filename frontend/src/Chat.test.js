// src/Chat.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Chat from './Chat';

describe('Chat Component', () => {
    test('renders join form initially', () => {
        render(<Chat />);
        expect(screen.getByPlaceholderText('Enter your username')).toBeInTheDocument();
        expect(screen.getByText('Join Chat')).toBeInTheDocument();
    });

    test('allows user to join chat', () => {
        render(<Chat />);
        fireEvent.change(screen.getByPlaceholderText('Enter your username'), { target: { value: 'testuser' } });
        fireEvent.click(screen.getByText('Join Chat'));
        expect(screen.getByPlaceholderText('Enter your message')).toBeInTheDocument();
        expect(screen.getByText('Leave Chat')).toBeInTheDocument();
    });

    test('allows user to leave chat', () => {
        render(<Chat />);
        fireEvent.change(screen.getByPlaceholderText('Enter your username'), { target: { value: 'testuser' } });
        fireEvent.click(screen.getByText('Join Chat'));
        fireEvent.click(screen.getByText('Leave Chat'));
        expect(screen.getByPlaceholderText('Enter your username')).toBeInTheDocument();
        expect(screen.getByText('Join Chat')).toBeInTheDocument();
    });
});
