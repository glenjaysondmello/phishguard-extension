import React from 'react';
import { createRoot } from 'react-dom/client';
import Popup from './Popup';
import './i18n';

const root = createRoot(document.getElementById('root')!);
root.render(<Popup />);