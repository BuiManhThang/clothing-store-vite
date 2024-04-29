import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './store'
import './index.css'
import TheLayout from './components/layout/TheLayout'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import router from './router'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <TheLayout>
          <RouterProvider router={router} />
        </TheLayout>
      </QueryClientProvider>
    </Provider>
  </React.StrictMode>
)
