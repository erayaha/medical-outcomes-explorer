import '@testing-library/jest-dom';
import React from 'react';

jest.mock('next/link', () => {
  return function Link({ children, href, ...props }) {
    return React.createElement('a', { href, ...props }, children);
  };
});

jest.mock('next/navigation', () => ({
  notFound: jest.fn(() => {
    throw new Error('notFound called');
  }),
}));
