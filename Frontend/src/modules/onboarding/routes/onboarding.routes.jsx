import { Routes, Route } from 'react-router-dom';
import { OnboardingPage } from '../pages/OnboardingPage';

export const OnboardingRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<OnboardingPage />} />
    </Routes>
  );
};
