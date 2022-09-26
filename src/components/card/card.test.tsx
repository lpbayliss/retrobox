import { render, screen } from '@testing-library/react';
import Card from './card.component';

describe('Card', () => {
  it('Renders children', () => {
    render(<Card>Hello World</Card>);
    expect(screen.getByText(/Hello World/i)).toBeInTheDocument();
  });
});
