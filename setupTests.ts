import '@testing-library/jest-dom';
import { vi } from 'vitest'; // Import vi from vitest

global.URL.createObjectURL = vi.fn();

