/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import App from '../App';

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
});

test('renders correctly', async () => {
  let app: ReactTestRenderer.ReactTestRenderer;

  await ReactTestRenderer.act(() => {
    app = ReactTestRenderer.create(<App />);
  });

  await ReactTestRenderer.act(() => {
    jest.advanceTimersByTime(2000);
  });

  await ReactTestRenderer.act(() => {
    app.unmount();
  });
});
