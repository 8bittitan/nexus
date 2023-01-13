import { RemixBrowser } from '@remix-run/react';
import { hydrate } from 'react-dom';

import reportWebVitals from '~/utils/vitals';

hydrate(<RemixBrowser />, document);

reportWebVitals();
