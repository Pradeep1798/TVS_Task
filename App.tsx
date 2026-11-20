import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from 'store';
import CasesScreen from 'screen/CaseScreen';

const App = () => (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <CasesScreen />
    </PersistGate>
  </Provider>
);

export default App;
